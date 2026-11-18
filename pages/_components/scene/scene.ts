import {
  Color,
  DirectionalLight,
  Fog,
  HemisphereLight,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NeutralToneMapping,
  Object3D as Dummy,
  SphereGeometry,
  PerspectiveCamera,
  PCFShadowMap,
  PlaneGeometry,
  Scene,
  ShadowMaterial,
  Vector3,
  type Object3D,
} from "three";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import { pass, vec4 } from "three/tsl";
import { RenderPipeline, WebGPURenderer } from "three/webgpu";
import type { MenuFrame } from "../menu-scroller";
import {
  measureEmphasis,
  measureSlotCenter,
  placeBoardCamera,
  projectToTable,
  toNdc,
  toTablePoint,
  type BoardView,
  type ScreenPoint,
  type SlotOrigin,
} from "./placement";
import { createMotes, measureMote, type Mote } from "./dust";
import { measureFade, type Fade } from "./fade";
import { DROP_MS, INTRO_DELAY_MS, measureDrop, STAGGER_MS } from "./intro";
import { chooseQualityLevel, QUALITY_LEVELS } from "./quality";
import { readTokenColor } from "./tokens";
import { createWobble, measureRimOffset, measureWobble, type Wobble } from "./wobble";

export interface SceneLayout {
  readonly row: number;
  readonly subWidth: number;
  readonly iconSize: number;
  readonly board: BoardView;
}

export interface SceneState {
  readonly frame: MenuFrame;
  readonly layout: SceneLayout;
  readonly offsets: ReadonlyMap<string, ScreenPoint>;
  readonly heroId: string | null;
  readonly isSoundOn: boolean;
}

export interface TabletopScene {
  setSlots(slots: readonly SlotOrigin[]): void;
  render(state: SceneState): void;
  resize(width: number, height: number, devicePixelRatio: number): void;
  refreshColors(): void;
  recordFrameTime(ms: number): void;
  // Rocks the piece once, as a sub step brings it onto the band.
  wobble(id: string, random: () => number): void;
  dispose(): void;
}

interface Piece {
  readonly slot: SlotOrigin;
  readonly root: Object3D;
  readonly lever: Object3D | null;
  readonly meshes: readonly Mesh[];
  readonly materials: readonly { readonly material: MeshStandardMaterial; readonly token: string }[];
}

interface Motion<T> {
  readonly value: T;
  readonly startedAt: number;
}

// Matches the DOM: an item away from the band shows at 45%, and the focused
// one grows by 20% (`DIMMED_OPACITY`, `FOCUSED_SCALE_GAIN` in menu-paint.ts).
const DIMMED = 0.45;
const FOCUSED_SCALE_GAIN = 0.2;
const FOCUSED_LIFT = 0.12;
// A model's footprint is at most 0.7 units; on the board it spans this many
// times the 2D icon it replaces. The table is measured in the board's CSS px.
const MODEL_FOOTPRINT = 0.7;
const SPAN_PER_ICON = 1.1;
const LEVER_ANGLE = (25 * Math.PI) / 180;
// Below this the piece is not drawn at all; a sliver of a fading row would
// otherwise flicker in and out as the scroll settles a hair off a whole row.
const MIN_OPACITY = 0.02;
// A faint piece casts no shadow; a shadow cannot fade with it.
const SHADOW_OPACITY = 0.5;
// The opened item's piece crosses with its 2D icon, which fades in CSS over
// the same time (menu.css).
const HERO_FADE_MS = 250;
// How far from the base centre a rattling piece pivots, in model units: a
// little inside the 0.7 footprint, since most bases are narrower than it.
const RIM_RADIUS = 0.28;
const DUST_COUNT = 60;
const AMBIENT_FRAME_MS = 32;
// How far above the table, in icon sizes, a piece starts its fall on the first
// showing, and how long the dust takes to come up after the pieces start.
const DROP_HEIGHT = 0.9;
const DUST_SHOW_MS = 800;
const SWITCH_MODEL = "/models/sound--switch.glb";

function collectMaterials(root: Object3D): Piece["materials"] {
  const found: { material: MeshStandardMaterial; token: string }[] = [];
  root.traverse((node) => {
    if (!(node instanceof Mesh)) return;
    const own = Array.isArray(node.material) ? node.material : [node.material];
    const cloned = own.map((material: MeshStandardMaterial) => {
      const copy = material.clone();
      found.push({ material: copy, token: `--${material.name}` });
      return copy;
    });
    node.material = Array.isArray(node.material) ? cloned : cloned[0];
    node.castShadow = true;
  });
  return found;
}

export async function createTabletopScene(
  canvas: HTMLCanvasElement,
  readToken: (name: string) => string,
  modelUrls: readonly string[],
  onLost: () => void,
  isMotionReduced: boolean,
): Promise<TabletopScene | null> {
  // Transparent: the table and the printed labels are the DOM under the canvas,
  // so a piece in front hides the print behind it.
  const renderer = new WebGPURenderer({ canvas, antialias: true, alpha: true });
  try {
    await renderer.init();
  } catch {
    return null;
  }
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  // A soft curve, so the warm highlights roll off instead of clipping.
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;

  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const models = new Map<string, Object3D>();
  await Promise.all(
    [...new Set(modelUrls)].map(async (url) => {
      try {
        models.set(url, (await loader.loadAsync(url)).scene);
      } catch {
        // Counted below.
      }
    }),
  );
  // The 2D icons hide once the scene is ready, so a scene missing any model
  // would leave that item with a label and nothing above it.
  if (models.size < new Set(modelUrls).size) {
    void renderer.dispose();
    return null;
  }
  // After the GPU device is lost the renderer draws nothing, so the menu goes
  // back to its 2D icons.
  renderer.onDeviceLost = () => onLost();

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 1, 20000);

  // Morning light: a low, warm sun from behind and to the left throws long
  // soft shadows toward the viewer, and a warm sky fills the shade.
  const hemisphere = new HemisphereLight(0xfffbf5, 0xf2e9dc, 1.7);
  const sun = new DirectionalLight(0xffe9cf, 2.4);
  sun.castShadow = true;
  sun.shadow.radius = 8;
  sun.shadow.bias = -0.0005;
  scene.add(hemisphere, sun, sun.target);

  // The table is the DOM under the canvas; this plane only receives the
  // pieces' shadows, tinted warm rather than grey. It is measured in px, so it
  // reaches far past any screen.
  const shadowCatcher = new Mesh(new PlaneGeometry(40000, 40000), new ShadowMaterial({ opacity: 0.13, color: 0x6b4d2e }));
  shadowCatcher.rotation.x = -Math.PI / 2;
  shadowCatcher.position.y = 0;
  shadowCatcher.receiveShadow = true;
  scene.add(shadowCatcher);

  // Haze: pieces further back melt into the table's warm colour.
  const fog = new Fog(0xffffff, 1, 2);
  scene.fog = fog;

  // Dust hanging in the light, bright enough for the bloom to catch.
  const dust = new InstancedMesh(
    new SphereGeometry(1, 8, 6),
    new MeshBasicMaterial({ color: new Color(1, 0.92, 0.78).multiplyScalar(4), fog: false }),
    DUST_COUNT,
  );
  dust.frustumCulled = false;
  scene.add(dust);
  const dummy = new Dummy();
  let motes: Mote[] = [];
  const startedAt = performance.now();
  let lastAmbientDraw = 0;

  // Highlights glow softly past their edges. The glow adds to the colour but
  // keeps the scene's alpha: the canvas is premultiplied, so glow over an empty
  // pixel adds light to the DOM table under it instead of painting it black.
  const pipeline = new RenderPipeline(renderer);
  const scenePass = pass(scene, camera);
  const sceneColor = scenePass.getTextureNode("output");
  const glow = bloom(sceneColor, 0.5, 0.65, 0.78);
  pipeline.outputNode = vec4(sceneColor.rgb.add(glow.rgb), sceneColor.a);

  let pieces: Piece[] = [];
  let viewport = { width: 1, height: 1 };
  let devicePixelRatio = 1;
  let qualityLevel = 0;
  let frameTimes: number[] = [];
  let lastState: SceneState | null = null;
  let heroId: string | null = null;
  const fades = new Map<string, Motion<Fade>>();
  const wobbles = new Map<string, Motion<Wobble>>();
  let animationId = 0;
  // The first showing: when it started, each piece's place in the sequence,
  // the pieces that have landed, and when the last one lands.
  let introStartedAt: number | null = null;
  let introOrder = new Map<string, number>();
  const landedIds = new Set<string>();
  let introEndsAt = 0;
  // A deterministic source, so the dust lies the same way on every visit.
  let dustSeed = 0x2f6e2b1;
  function nextRandom(): number {
    dustSeed = (dustSeed * 1664525 + 1013904223) >>> 0;
    return dustSeed / 0x100000000;
  }
  const tableColor = new Color();

  function readColor(token: string, fallback: number): number {
    return readTokenColor(readToken, token) ?? fallback;
  }

  function applyColors() {
    tableColor.setHex(readColor("--table", 0xeeeeec));
    fog.color.copy(tableColor);
    for (const piece of pieces) {
      for (const { material, token } of piece.materials) {
        material.userData.base = new Color(readColor(token, 0xffffff));
      }
    }
  }

  function applyQuality() {
    const level = QUALITY_LEVELS[qualityLevel] ?? QUALITY_LEVELS[0];
    if (!level) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio, level.maxPixelRatio));
    if (sun.shadow.mapSize.x !== level.shadowMapSize) {
      sun.shadow.mapSize.set(level.shadowMapSize, level.shadowMapSize);
      sun.shadow.map?.dispose();
      sun.shadow.map = null;
    }
  }

  function tablePointAt(point: ScreenPoint): Vector3 | null {
    return projectToTable(toNdc(point, viewport), camera);
  }

  // The sun's shadow box covers the table the screen shows.
  function fitShadow(state: SceneState) {
    const corners = [
      { x: 0, y: 0 },
      { x: viewport.width, y: 0 },
      { x: 0, y: viewport.height },
      { x: viewport.width, y: viewport.height },
    ]
      .map((point) => projectToTable(toNdc(point, viewport), camera))
      .filter((point): point is Vector3 => point !== null);
    if (corners.length === 0) return;
    const center = corners.reduce((sum, point) => sum.add(point), new Vector3()).divideScalar(corners.length);
    const radius = Math.max(...corners.map((point) => point.distanceTo(center))) + state.layout.iconSize * 2;
    const distance = state.layout.board.perspective * 2;
    sun.target.position.copy(center);
    sun.position.copy(center).add(new Vector3(-0.62, 0.42, -0.66).normalize().multiplyScalar(distance));
    const shadowCamera = sun.shadow.camera;
    shadowCamera.left = -radius;
    shadowCamera.right = radius;
    shadowCamera.top = radius;
    shadowCamera.bottom = -radius;
    shadowCamera.near = distance * 0.2;
    shadowCamera.far = distance * 2;
    shadowCamera.updateProjectionMatrix();
    const perspective = state.layout.board.perspective;
    fog.near = perspective * 0.95;
    fog.far = perspective * 2.8;
    dustSeed = 0x2f6e2b1;
    motes = createMotes(nextRandom, DUST_COUNT, { centerX: center.x, centerZ: center.z, radius: radius * 0.8, height: state.layout.iconSize * 4 });
  }

  // Fades and wobbles play on time rather than on the scroll, so while one
  // runs the scene redraws every frame from the last state.
  // The dust alone keeps it drawing at about 30fps; reduced motion holds the
  // dust still and stops that loop.
  function keepAnimating() {
    const isAmbientOnly = fades.size === 0 && wobbles.size === 0 && performance.now() >= introEndsAt;
    if (animationId || (isAmbientOnly && isMotionReduced)) return;
    animationId = window.requestAnimationFrame(function tick(now) {
      animationId = 0;
      if (isAmbientOnly && now - lastAmbientDraw < AMBIENT_FRAME_MS) {
        animationId = window.requestAnimationFrame(tick);
        return;
      }
      if (lastState) draw(lastState);
    });
  }

  function placeDust(now: number) {
    const elapsed = isMotionReduced ? 0 : now - startedAt;
    const sinceIntro = now - (introStartedAt ?? now) - INTRO_DELAY_MS;
    const shown = Math.min(Math.max(sinceIntro / DUST_SHOW_MS, 0), 1);
    motes.forEach((mote, index) => {
      const at = measureMote(mote, elapsed);
      dummy.position.set(at.x, at.y, at.z);
      dummy.scale.setScalar(mote.size * shown);
      dummy.updateMatrix();
      dust.setMatrixAt(index, dummy.matrix);
    });
    dust.count = motes.length;
    dust.instanceMatrix.needsUpdate = true;
  }

  function startHeroFades(next: string | null) {
    const now = performance.now();
    if (heroId) fades.set(heroId, { value: { from: 0, to: 1, durationMs: HERO_FADE_MS }, startedAt: now });
    if (next) fades.set(next, { value: { from: 1, to: 0, durationMs: HERO_FADE_MS }, startedAt: now });
    heroId = next;
  }

  function readFade(id: string, now: number): number {
    const motion = fades.get(id);
    if (!motion) return id === heroId ? 0 : 1;
    const elapsed = now - motion.startedAt;
    if (elapsed >= motion.value.durationMs) fades.delete(id);
    return measureFade(motion.value, elapsed);
  }

  function readTip(id: string, now: number): { angle: number; direction: number } {
    const motion = wobbles.get(id);
    if (!motion) return { angle: 0, direction: 0 };
    const angle = measureWobble(motion.value, now - motion.startedAt);
    if (angle === null) wobbles.delete(id);
    return { angle: angle ?? 0, direction: motion.value.direction };
  }

  function setOpacity(piece: Piece, opacity: number) {
    const isTransparent = opacity < 0.999;
    for (const { material } of piece.materials) {
      if (material.transparent !== isTransparent) {
        material.transparent = isTransparent;
        material.needsUpdate = true;
      }
      material.opacity = opacity;
    }
    for (const mesh of piece.meshes) mesh.castShadow = opacity > SHADOW_OPACITY;
  }

  // The pieces on screen at the first showing fall in reading order: top to
  // bottom, then left to right. The rest are hidden by the menu anyway.
  function startIntro(state: SceneState, now: number) {
    introStartedAt = now;
    const shown = pieces
      .filter((piece) => measureEmphasis(piece.slot, state.frame).visibility > 0)
      .map((piece) => ({ id: piece.slot.id, center: measureSlotCenter(piece.slot, state.frame, state.layout) }))
      .sort((a, b) => a.center.y - b.center.y || a.center.x - b.center.x);
    introOrder = new Map(shown.map((entry, index) => [entry.id, index]));
    introEndsAt = now + INTRO_DELAY_MS + Math.max(shown.length - 1, 0) * STAGGER_MS + DROP_MS;
  }

  function readDrop(id: string, now: number) {
    const drop = measureDrop(introOrder.get(id) ?? 0, now - (introStartedAt ?? now), isMotionReduced);
    if (drop.hasLanded && !landedIds.has(id)) {
      landedIds.add(id);
      const isIntroLanding = now < introEndsAt + DROP_MS;
      if (isIntroLanding && !isMotionReduced) wobbles.set(id, { value: createWobble(Math.random), startedAt: now });
    }
    return drop;
  }

  function draw(state: SceneState) {
    const isViewChanged = lastState?.layout.board !== state.layout.board;
    lastState = state;
    if (isViewChanged) {
      placeBoardCamera(camera, state.layout.board, viewport.height);
      fitShadow(state);
    }
    if (state.heroId !== heroId) startHeroFades(state.heroId);
    const now = performance.now();
    if (introStartedAt === null && pieces.length > 0) startIntro(state, now);
    const scale = (state.layout.iconSize * SPAN_PER_ICON) / MODEL_FOOTPRINT;
    for (const piece of pieces) {
      const center = measureSlotCenter(piece.slot, state.frame, state.layout);
      const offset = state.offsets.get(piece.slot.id) ?? { x: 0, y: 0 };
      const point = toTablePoint({ x: center.x + offset.x, y: center.y + offset.y }, state.layout.board);
      const { visibility, focus } = measureEmphasis(piece.slot, state.frame);
      const fade = readFade(piece.slot.id, now);
      const drop = readDrop(piece.slot.id, now);
      const opacity = visibility * fade * drop.opacity;
      piece.root.visible = opacity >= MIN_OPACITY;
      if (!piece.root.visible) continue;
      setOpacity(piece, opacity);
      // A fading hero piece shrinks a little as it gives way to its icon.
      const pieceScale = scale * (1 + FOCUSED_SCALE_GAIN * focus) * (0.92 + 0.08 * fade);
      const tip = readTip(piece.slot.id, now);
      const rim = measureRimOffset(tip.angle, tip.direction, RIM_RADIUS * pieceScale);
      const fall = drop.lift * DROP_HEIGHT * state.layout.iconSize;
      piece.root.position.set(point.x + rim.x, FOCUSED_LIFT * focus * scale + rim.y + fall, point.z + rim.z);
      // Tipping toward +x turns about -z, toward +z about +x.
      piece.root.rotation.set(tip.angle * Math.sin(tip.direction), 0, -tip.angle * Math.cos(tip.direction));
      piece.root.scale.setScalar(pieceScale);
      const strength = DIMMED + (1 - DIMMED) * focus;
      for (const { material } of piece.materials) {
        const base = material.userData.base;
        if (base instanceof Color) material.color.copy(tableColor).lerp(base, strength);
      }
      // Tipped right when on and left when off, across the camera's view, so
      // both positions read at a glance.
      if (piece.lever) piece.lever.rotation.z = state.isSoundOn ? -LEVER_ANGLE : LEVER_ANGLE;
    }
    placeDust(now);
    lastAmbientDraw = now;
    if (qualityLevel >= QUALITY_LEVELS.length - 1) renderer.render(scene, camera);
    else pipeline.render();
    keepAnimating();
  }

  return {
    // The pieces are built once; later calls, after a resize, only move them.
    setSlots(slots) {
      if (pieces.length > 0) {
        const byId = new Map(slots.map((slot) => [slot.id, slot]));
        pieces = pieces.map((piece) => ({ ...piece, slot: byId.get(piece.slot.id) ?? piece.slot }));
        return;
      }
      pieces = slots.flatMap((slot) => {
        const model = models.get(slot.modelUrl);
        if (!model) return [];
        const root = model.clone(true);
        const materials = collectMaterials(root);
        const meshes: Mesh[] = [];
        root.traverse((node) => {
          if (node instanceof Mesh) meshes.push(node);
        });
        scene.add(root);
        return [{ slot, root, materials, meshes, lever: slot.modelUrl === SWITCH_MODEL ? (root.getObjectByName("lever") ?? null) : null }];
      });
      applyColors();
    },
    render: draw,
    resize(width, height, ratio) {
      viewport = { width, height };
      devicePixelRatio = ratio;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      applyQuality();
      if (!lastState) return;
      placeBoardCamera(camera, lastState.layout.board, height);
      fitShadow(lastState);
      draw(lastState);
    },
    refreshColors() {
      applyColors();
      if (lastState) draw(lastState);
    },
    recordFrameTime(ms) {
      frameTimes.push(ms);
      if (frameTimes.length < 30) return;
      const next = chooseQualityLevel(frameTimes, qualityLevel);
      frameTimes = [];
      if (next === qualityLevel) return;
      qualityLevel = next;
      applyQuality();
    },
    wobble(id, random) {
      wobbles.set(id, { value: createWobble(random), startedAt: performance.now() });
      if (lastState) draw(lastState);
    },
    dispose() {
      window.cancelAnimationFrame(animationId);
      for (const piece of pieces) for (const { material } of piece.materials) material.dispose();
      void renderer.dispose();
    },
  };
}
