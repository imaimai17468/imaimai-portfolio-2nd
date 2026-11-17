import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
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
import { measureEmphasis, measureSlotCenter, projectToTable, toNdc, type ScreenPoint, type SlotOrigin } from "./placement";
import { chooseQualityLevel, QUALITY_LEVELS } from "./quality";
import { readTokenColor } from "./tokens";

export interface SceneLayout {
  readonly row: number;
  readonly subWidth: number;
  readonly iconSize: number;
}

export interface SceneState {
  readonly frame: MenuFrame;
  readonly layout: SceneLayout;
  readonly band: { readonly top: number; readonly height: number };
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
  dispose(): void;
}

interface Piece {
  readonly slot: SlotOrigin;
  readonly root: Object3D;
  readonly lever: Object3D | null;
  readonly materials: readonly { readonly material: MeshStandardMaterial; readonly token: string }[];
}

// Matches the DOM: an item away from the band shows at 45%, and the focused
// one grows by 20% (`DIMMED_OPACITY`, `FOCUSED_SCALE_GAIN` in menu-paint.ts).
const DIMMED = 0.45;
const FOCUSED_SCALE_GAIN = 0.2;
const FOCUSED_LIFT = 0.12;
// A model's footprint is at most 0.7 units; on screen at the band it spans
// this many times the 2D icon it replaces.
const MODEL_FOOTPRINT = 0.7;
const SCREEN_SPAN_PER_ICON = 0.95;
const LEVER_ANGLE = (25 * Math.PI) / 180;
const SWITCH_MODEL = "/models/sound--switch.glb";

function placeCamera(camera: PerspectiveCamera): void {
  // Above and slightly to the front right of the table, looking down about
  // 50 degrees. A wider swing to the side, or a wider lens, tips the pieces at
  // the screen's edges outward, so the lens is long and the camera far.
  camera.position.set(3.3, 26.5, 21.5);
  camera.lookAt(0, 0, 0);
}

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
): Promise<TabletopScene | null> {
  const renderer = new WebGPURenderer({ canvas, antialias: true, alpha: false });
  try {
    await renderer.init();
  } catch {
    return null;
  }
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
        // A model that fails to load leaves its slot empty.
      }
    }),
  );

  const scene = new Scene();
  const camera = new PerspectiveCamera(18, 1, 0.1, 400);
  placeCamera(camera);

  const hemisphere = new HemisphereLight(0xffffff, 0xffffff, 1.6);
  const sun = new DirectionalLight(0xffffff, 2.2);
  sun.castShadow = true;
  sun.shadow.radius = 6;
  sun.shadow.bias = -0.0005;
  scene.add(hemisphere, sun, sun.target);

  // The table is the background colour itself; this plane only receives the
  // pieces' shadows, so the table matches the CSS token exactly.
  const shadowCatcher = new Mesh(new PlaneGeometry(400, 400), new ShadowMaterial({ opacity: 0.16 }));
  shadowCatcher.rotation.x = -Math.PI / 2;
  shadowCatcher.position.y = 0.002;
  shadowCatcher.receiveShadow = true;
  const bandGeometry = new BufferGeometry();
  bandGeometry.setAttribute("position", new BufferAttribute(new Float32Array(12), 3));
  bandGeometry.setIndex([0, 2, 1, 1, 2, 3]);
  const bandMaterial = new MeshBasicMaterial();
  const band = new Mesh(bandGeometry, bandMaterial);
  band.frustumCulled = false;
  scene.add(shadowCatcher, band);

  let pieces: Piece[] = [];
  let viewport = { width: 1, height: 1 };
  let devicePixelRatio = 1;
  let qualityLevel = 0;
  let frameTimes: number[] = [];
  let lastState: SceneState | null = null;
  const tableColor = new Color();

  function readColor(token: string, fallback: number): number {
    return readTokenColor(readToken, token) ?? fallback;
  }

  function applyColors() {
    tableColor.setHex(readColor("--table", 0xeeeeec));
    scene.background = tableColor.clone();
    bandMaterial.color.setHex(readColor("--table-band", 0xdcdcda));
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

  // The world size of one screen pixel on the table at the band's centre, so a
  // piece there spans `SCREEN_SPAN_PER_ICON` icons. Pieces further back come out
  // smaller and nearer ones larger, which is the perspective.
  function measurePieceScale(state: SceneState): number {
    const y = state.band.top + state.band.height / 2;
    const a = tablePointAt({ x: viewport.width / 2, y });
    const b = tablePointAt({ x: viewport.width / 2 + 100, y });
    if (!a || !b) return 1;
    const worldPerPx = a.distanceTo(b) / 100;
    return (state.layout.iconSize * SCREEN_SPAN_PER_ICON * worldPerPx) / MODEL_FOOTPRINT;
  }

  function placeBand(state: SceneState) {
    const corners = [
      { x: -viewport.width, y: state.band.top },
      { x: viewport.width * 2, y: state.band.top },
      { x: -viewport.width, y: state.band.top + state.band.height },
      { x: viewport.width * 2, y: state.band.top + state.band.height },
    ].map(tablePointAt);
    const position = bandGeometry.getAttribute("position");
    band.visible = corners.every(Boolean);
    corners.forEach((corner, index) => {
      if (corner) position.setXYZ(index, corner.x, 0.001, corner.z);
    });
    position.needsUpdate = true;
  }

  // The sun's shadow box covers the table the screen shows.
  function fitShadow() {
    const corners = [
      { x: 0, y: 0 },
      { x: viewport.width, y: 0 },
      { x: 0, y: viewport.height },
      { x: viewport.width, y: viewport.height },
    ]
      .map(tablePointAt)
      .filter((point): point is Vector3 => point !== null);
    if (corners.length === 0) return;
    const center = corners.reduce((sum, point) => sum.add(point), new Vector3()).divideScalar(corners.length);
    const radius = Math.max(...corners.map((point) => point.distanceTo(center))) + 2;
    sun.target.position.copy(center);
    sun.position.copy(center).add(new Vector3(-8, 20, 10));
    const shadowCamera = sun.shadow.camera;
    shadowCamera.left = -radius;
    shadowCamera.right = radius;
    shadowCamera.top = radius;
    shadowCamera.bottom = -radius;
    shadowCamera.near = 1;
    shadowCamera.far = 60;
    shadowCamera.updateProjectionMatrix();
  }

  function draw(state: SceneState) {
    lastState = state;
    placeBand(state);
    const scale = measurePieceScale(state);
    for (const piece of pieces) {
      const center = measureSlotCenter(piece.slot, state.frame, state.layout);
      const offset = state.offsets.get(piece.slot.id) ?? { x: 0, y: 0 };
      const point = tablePointAt({ x: center.x + offset.x, y: center.y + offset.y });
      const { visibility, focus } = measureEmphasis(piece.slot, state.frame);
      piece.root.visible = point !== null && visibility > 0 && piece.slot.id !== state.heroId;
      if (!piece.root.visible || !point) continue;
      piece.root.position.set(point.x, FOCUSED_LIFT * focus * scale, point.z);
      piece.root.scale.setScalar(scale * (1 + FOCUSED_SCALE_GAIN * focus));
      const strength = visibility * (DIMMED + (1 - DIMMED) * focus);
      for (const { material } of piece.materials) {
        const base = material.userData.base;
        if (base instanceof Color) material.color.copy(tableColor).lerp(base, strength);
      }
      // Tipped right when on and left when off, across the camera's view, so
      // both positions read at a glance.
      if (piece.lever) piece.lever.rotation.z = state.isSoundOn ? -LEVER_ANGLE : LEVER_ANGLE;
    }
    renderer.render(scene, camera);
  }

  return {
    setSlots(slots) {
      for (const piece of pieces) scene.remove(piece.root);
      pieces = slots.flatMap((slot) => {
        const model = models.get(slot.modelUrl);
        if (!model) return [];
        const root = model.clone(true);
        const materials = collectMaterials(root);
        scene.add(root);
        return [{ slot, root, materials, lever: slot.modelUrl === SWITCH_MODEL ? (root.getObjectByName("lever") ?? null) : null }];
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
      fitShadow();
      if (lastState) draw(lastState);
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
    dispose() {
      renderer.dispose();
      bandGeometry.dispose();
    },
  };
}
