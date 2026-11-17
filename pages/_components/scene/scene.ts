import {
  Color,
  DirectionalLight,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
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
import { WebGPURenderer } from "three/webgpu";
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
import { measureFade, type Fade } from "./fade";
import { chooseQualityLevel, QUALITY_LEVELS } from "./quality";
import { readTokenColor } from "./tokens";
import { createWobble, measureWobble, type Wobble } from "./wobble";

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

  const hemisphere = new HemisphereLight(0xffffff, 0xffffff, 1.6);
  const sun = new DirectionalLight(0xffffff, 2.2);
  sun.castShadow = true;
  sun.shadow.radius = 6;
  sun.shadow.bias = -0.0005;
  scene.add(hemisphere, sun, sun.target);

  // The table is the DOM under the canvas; this plane only receives the
  // pieces' shadows.
  const shadowCatcher = new Mesh(new PlaneGeometry(400, 400), new ShadowMaterial({ opacity: 0.16 }));
  shadowCatcher.rotation.x = -Math.PI / 2;
  shadowCatcher.position.y = 0;
  shadowCatcher.receiveShadow = true;
  scene.add(shadowCatcher);

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
  const tableColor = new Color();

  function readColor(token: string, fallback: number): number {
    return readTokenColor(readToken, token) ?? fallback;
  }

  function applyColors() {
    tableColor.setHex(readColor("--table", 0xeeeeec));
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
    sun.position.copy(center).add(new Vector3(-0.35, 0.85, 0.4).normalize().multiplyScalar(distance));
    const shadowCamera = sun.shadow.camera;
    shadowCamera.left = -radius;
    shadowCamera.right = radius;
    shadowCamera.top = radius;
    shadowCamera.bottom = -radius;
    shadowCamera.near = distance * 0.2;
    shadowCamera.far = distance * 2;
    shadowCamera.updateProjectionMatrix();
  }

  // Fades and wobbles play on time rather than on the scroll, so while one
  // runs the scene redraws every frame from the last state.
  function keepAnimating() {
    if (animationId || (fades.size === 0 && wobbles.size === 0)) return;
    animationId = window.requestAnimationFrame(() => {
      animationId = 0;
      if (lastState) draw(lastState);
    });
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

  function readTilt(id: string, now: number): { x: number; z: number } {
    const motion = wobbles.get(id);
    if (!motion) return { x: 0, z: 0 };
    const tilt = measureWobble(motion.value, now - motion.startedAt);
    if (!tilt) wobbles.delete(id);
    return tilt ?? { x: 0, z: 0 };
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

  function draw(state: SceneState) {
    const isViewChanged = lastState?.layout.board !== state.layout.board;
    lastState = state;
    if (isViewChanged) {
      placeBoardCamera(camera, state.layout.board, viewport.height);
      fitShadow(state);
    }
    if (state.heroId !== heroId) startHeroFades(state.heroId);
    const now = performance.now();
    const scale = (state.layout.iconSize * SPAN_PER_ICON) / MODEL_FOOTPRINT;
    for (const piece of pieces) {
      const center = measureSlotCenter(piece.slot, state.frame, state.layout);
      const offset = state.offsets.get(piece.slot.id) ?? { x: 0, y: 0 };
      const point = toTablePoint({ x: center.x + offset.x, y: center.y + offset.y }, state.layout.board);
      const { visibility, focus } = measureEmphasis(piece.slot, state.frame);
      const fade = readFade(piece.slot.id, now);
      const opacity = visibility * fade;
      piece.root.visible = opacity >= MIN_OPACITY;
      if (!piece.root.visible) continue;
      setOpacity(piece, opacity);
      const tilt = readTilt(piece.slot.id, now);
      piece.root.position.set(point.x, FOCUSED_LIFT * focus * scale, point.z);
      piece.root.rotation.set(tilt.x, 0, tilt.z);
      // A fading hero piece shrinks a little as it gives way to its icon.
      piece.root.scale.setScalar(scale * (1 + FOCUSED_SCALE_GAIN * focus) * (0.92 + 0.08 * fade));
      const strength = DIMMED + (1 - DIMMED) * focus;
      for (const { material } of piece.materials) {
        const base = material.userData.base;
        if (base instanceof Color) material.color.copy(tableColor).lerp(base, strength);
      }
      // Tipped right when on and left when off, across the camera's view, so
      // both positions read at a glance.
      if (piece.lever) piece.lever.rotation.z = state.isSoundOn ? -LEVER_ANGLE : LEVER_ANGLE;
    }
    renderer.render(scene, camera);
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
