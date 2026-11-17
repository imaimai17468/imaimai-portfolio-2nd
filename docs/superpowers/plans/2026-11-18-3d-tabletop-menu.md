# 3D Tabletop Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Draw every menu item of the top page as a 3D play piece standing on a white tabletop under a fixed, angled camera, while the DOM menu keeps its layout, labels, input and open-item transition.

**Architecture:** A browser-only scene module (`pages/_components/scene/`) renders with Three.js `WebGPURenderer`. Each piece stands where the camera ray through its 2D icon's screen centre meets the table, so the scene follows the existing `MenuScroller` paint without changing the DOM layout. Pure functions (placement, colours, quality, translate parsing) carry every branch and are unit-tested; the renderer and the React wiring are checked in the browser.

**Tech Stack:** React 19, Void 1.8, Vite+ (`vp test` runs Vitest), Three.js 0.187.0 (`three/webgpu`, `GLTFLoader`), Blender 5.3 through the Blender MCP for the models.

**Spec:** `docs/superpowers/specs/2026-11-17-3d-tabletop-menu-design.md`

## Global Constraints

- All 3D code runs in the browser only, loaded with a dynamic `import()` from an effect; the server render never imports `three` (`.claude/rules/react.md`, Browser-only Code).
- Text stays DOM text in LINE Seed JP 700/800; nothing is drawn as text in the canvas.
- Every colour the scene uses comes from a CSS token in `src/styles.css`, with a light and a dark value (`.claude/rules/design.md`).
- No textures. Flat-colour materials only.
- The scene renders only on a scroller paint, a resize, a theme change, a sound switch change, or during the open/close transition window; never in an idle loop.
- Where `WebGPURenderer` cannot initialise at all, the canvas stays empty and the 2D menu stays exactly as it is today.
- Seven `.glb` files under `public/models/`, one per piece kind, all seven together at most 400 KB.
- Commits follow `AGENTS.md` (Commits): one purpose each, explicit paths, Japanese body, `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`, and **ask the owner before each commit**.
- Before reporting a task done: `mise exec -- pnpm exec tsc --noEmit` passes; tasks touching the page also pass `mise exec -- pnpm run build`.

## Review Focus

1. Dark mode switched while the page is open: the room, band and pieces take the dark token values without a reload. Pinned in Task 3 (`readTokenColor`) and checked in Task 7, Step 6.
2. The window resized or a phone rotated mid-scroll: pieces stay under their labels. Pinned in Task 4 (`measureSlotCenter` with a non-zero frame) and checked in Task 7, Step 6.
3. A screen point whose ray misses the table (a slot pushed above the horizon by an exit): the piece is hidden rather than placed at infinity. Pinned in Task 4 (`projectToTable` returns `null`).
4. Reduced motion: no exit motion in 3D, the canvas hides with the same 200 ms opacity change the rows use. Pinned in Task 6 (`readTranslate("none")`) and checked in Task 7, Step 6.
5. A slow phone: quality steps down instead of dropping frames. Pinned in Task 5 (`chooseQualityLevel`).

---

### Task 1: Test runner and Three.js

**Files:**
- Modify: `package.json` (add `three@0.187.0`, devDependency `@types/three` at the matching version, script `"test": "vp test run"`)
- Create: `pages/_components/scene/smoke.test.ts` (deleted again in Step 5)
- Modify: `docs/superpowers/specs/2026-11-17-3d-tabletop-menu-design.md` (record the two checks below)

**Interfaces:**
- Produces: `mise exec -- pnpm test <path>` runs Vitest on a file.

- [ ] **Step 1: Install** `mise exec -- pnpm add three@0.187.0 && mise exec -- pnpm add -D @types/three` and add the `test` script.
- [ ] **Step 2: Write a smoke test** that imports `PerspectiveCamera` from `three` and asserts `new PerspectiveCamera().isPerspectiveCamera === true`.
- [ ] **Step 3: Run** `mise exec -- pnpm test pages/_components/scene/smoke.test.ts`. Expected: 1 passed. If `vp test` needs a config to find the file, add the smallest one and note it.
- [ ] **Step 4: Check two facts and write them into the spec's Constraints section with their source:** (a) in `node_modules/three/src/renderers/webgpu/WebGPURenderer.js` (or its docs), whether the renderer falls back to WebGL 2 by itself and which option forces it; (b) Cloudflare's current per-file static asset limit and Worker bundle size limit from developers.cloudflare.com. Mark anything not found as "not verified".
- [ ] **Step 5: Delete the smoke test**, run `tsc --noEmit`, ask the owner, and commit `package.json`, `pnpm-lock.yaml` and the spec as `chore: 3D メニューのために Three.js とテストの実行環境を入れる`.

### Task 2: Piece models

**Files:**
- Create: `public/models/{bell,king,pawn,block,die,card,domino}.glb`

**Interfaces:**
- Produces: each `.glb` holds one root object named after its kind, origin at the centre of its base, standing on y = 0 (glTF Y-up), footprint at most 0.7 × 0.7 units, height at most 1.6 units. Every material is named after the token that colours it, without the leading `--`: `piece-<kind>` for the body, and `piece-pip`, `piece-pip-light`, `piece-mark` for details. No textures, no lights, no cameras.

- [ ] **Step 1: Rebuild the seven pieces** in the live Blender (the approved mock-up is still in the open scene; its proportions are the reference) with `execute_blender_code`, renaming materials to the token names above. Domino pips and line use `piece-pip-light`, die pips `piece-pip`, the die's one red pip and the card's mark `piece-mark`, the card stand `piece-domino`.
- [ ] **Step 2: Look** at all seven with `look` (`mode: "angles"`) and fix anything that reads wrong at small size (pips too small to see at 60 px tall is the likely one).
- [ ] **Step 3: Export** each root object alone with `bpy.ops.export_scene.gltf(filepath=..., use_selection=True, export_format="GLB", export_apply=True, export_yup=True)` into `public/models/<kind>.glb`. Read the operator's option names from `bpy.ops.export_scene.gltf.get_rna_type().properties` first rather than trusting these.
- [ ] **Step 4: Check size** `du -ch public/models/*.glb`. Expected: total ≤ 400 KB. Lower segment counts if not.
- [ ] **Step 5: Ask the owner and commit** `public/models/*.glb` as `feat: メニューの駒にする7種類の3Dモデルを用意する`.

### Task 3: Colour tokens and token reading

**Files:**
- Modify: `src/styles.css` (`:root` and the dark block)
- Create: `pages/_components/scene/tokens.ts`, `pages/_components/scene/tokens.test.ts`

**Interfaces:**
- Produces:
  - `type PieceKind = "bell" | "king" | "pawn" | "block" | "die" | "card" | "domino"`
  - `PIECE_BY_MAIN: Readonly<Record<string, PieceKind>>` keyed by `MENU[i].id`: sound→bell, profile→king, career→pawn, products→block, activities→die, articles→card, links→domino.
  - `readTokenColor(read: (name: string) => string, token: string): number | null` — `read` is `(name) => getComputedStyle(root).getPropertyValue(name)`; returns `0xRRGGBB` for a `#rrggbb` value after trimming, `null` otherwise.

- [ ] **Step 1: Write failing tests:** `readTokenColor(() => " #f2f2f0 ", "--piece-king") === 0xf2f2f0`; `readTokenColor(() => "", "--x") === null`; `readTokenColor(() => "red", "--x") === null`; and every `MENU` item's `id` has an entry in `PIECE_BY_MAIN`.
- [ ] **Step 2: Run** `mise exec -- pnpm test pages/_components/scene/tokens.test.ts`. Expected: FAIL, module not found.
- [ ] **Step 3: Implement** `tokens.ts`.
- [ ] **Step 4: Add tokens** as hex literals (so `getPropertyValue` returns hex): light `--table: #eeeeec`, `--table-band: #dcdcda`, `--piece-bell: #edc977`, `--piece-king: #f2f2f0`, `--piece-pawn: #5d6068`, `--piece-block: #9cc3ec`, `--piece-die: #f5f5f3`, `--piece-card: #f8f8f6`, `--piece-domino: #3a3b40`, `--piece-pip: #232326`, `--piece-pip-light: #f2f2f2`, `--piece-mark: #d46a64`. Dark values are the implementer's choice under one rule: `--table` and `--table-band` sit near `--black`, and every piece stays distinguishable from `--table-band` at a glance.
- [ ] **Step 5: Run the tests.** Expected: PASS. Ask the owner and commit as `feat: 3D の机と駒の色をトークンとして定義する`.

### Task 4: Placement

**Files:**
- Create: `pages/_components/scene/placement.ts`, `pages/_components/scene/placement.test.ts`

**Interfaces:**
- Consumes: `MenuFrame` from `../menu-scroller`, `measureRowShift` from `../menu-paint`, `measureFocus` from `../menu-motion`.
- Produces:
  - `interface SlotOrigin { readonly id: string; readonly kind: PieceKind; readonly row: number; readonly sub: number | null; readonly x: number; readonly y: number }` — the icon's screen centre in CSS px when `frame.main === 0` and the row's shift is 0; `sub === null` for a main piece.
  - `measureSlotCenter(origin: SlotOrigin, frame: MenuFrame, layout: { readonly row: number; readonly subWidth: number }): { x: number; y: number }` — `y = origin.y - frame.main * layout.row`, `x = origin.x - measureRowShift(origin.row, frame) * layout.subWidth` (main items shift with their row, as `paintRow` shifts them).
  - `measureEmphasis(origin: SlotOrigin, frame: MenuFrame): { visibility: number; focus: number }` — main piece: `visibility 1`, `focus = measureFocus(row - frame.main)`; sub piece: `visibility = measureFocus(row - frame.main)`, `focus = measureFocus(sub - measureRowShift(row, frame))`.
  - `toNdc(point: { x: number; y: number }, viewport: { width: number; height: number }): { x: number; y: number }`
  - `projectToTable(ndc: { x: number; y: number }, camera: Camera): Vector3 | null` — intersects the camera ray with the plane y = 0; `null` when the ray does not hit it in front of the camera.

- [ ] **Step 1: Write failing tests:** with `frame = { main: 3, sub: 1, subOwner: 3, leftover: null }` and `layout = { row: 80, subWidth: 120 }`, a main origin `{ row: 3, sub: null, x: 40, y: 400 }` lands at `{ x: -80, y: 160 }` and a main origin on row 1 with the same `x` and `y` lands at `{ x: 40, y: 160 }`; `measureEmphasis` gives `{ visibility: 1, focus: 0 }` for a main piece two rows away and `{ visibility: 1, focus: 1 }` for sub 1 on row 3 in that frame; `toNdc({ x: 0, y: 0 }, { width: 200, height: 100 })` is `{ x: -1, y: 1 }`; a `PerspectiveCamera` at `(0, 10, 0)` looking at the origin projects NDC `(0, 0)` to a point within 1e-6 of `(0, 0, 0)`; the same camera turned to look at `(0, 20, 10)` returns `null` for NDC `(0, 0)`.
- [ ] **Step 2: Run** `mise exec -- pnpm test pages/_components/scene/placement.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** `placement.ts` (`Raycaster.setFromCamera` and `ray.intersectPlane` with `new Plane(new Vector3(0, 1, 0), 0)`; call `camera.updateMatrixWorld()` first).
- [ ] **Step 4: Run the tests.** Expected: PASS. Ask the owner and commit as `feat: 2D の配置から駒を置く机の上の位置を求める`.

### Task 5: Quality steps

**Files:**
- Create: `pages/_components/scene/quality.ts`, `pages/_components/scene/quality.test.ts`

**Interfaces:**
- Produces:
  - `QUALITY_LEVELS: readonly { readonly maxPixelRatio: number; readonly shadowMapSize: number }[]` = `[{ 2, 2048 }, { 1.5, 1024 }, { 1, 512 }]`.
  - `chooseQualityLevel(frameTimesMs: readonly number[], level: number): number` — with fewer than 30 samples returns `level`; otherwise, when the median exceeds 20 ms, returns `Math.min(level + 1, QUALITY_LEVELS.length - 1)`, else `level`. It never steps back up.

- [ ] **Step 1: Write failing tests:** 29 samples of 40 → unchanged; 30 samples of 25 at level 0 → 1; 30 samples of 25 at level 2 → 2; 30 samples of 16 → unchanged; 15 samples of 10 and 15 of 30 (median exactly 20) → unchanged; 14 samples of 10 and 16 of 30 (median 30) → steps.
- [ ] **Step 2: Run** `mise exec -- pnpm test pages/_components/scene/quality.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** `quality.ts`.
- [ ] **Step 4: Run.** Expected: PASS. Fold into the Task 6 commit.

### Task 6: The scene

**Files:**
- Create: `pages/_components/scene/scene.ts`, `pages/_components/scene/translate.ts`, `pages/_components/scene/translate.test.ts`

**Interfaces:**
- Consumes: Task 3 (`PieceKind`, `readTokenColor`), Task 4 (all), Task 5 (all).
- Produces:
  - `readTranslate(value: string): { x: number; y: number }` — parses a computed `translate` value: `"none"` → `{0,0}`, `"12px"` → `{12,0}`, `"12px -40px"` → `{12,-40}`, `"12px -40px 0px"` → `{12,-40}`.
  - `interface SceneState { readonly frame: MenuFrame; readonly layout: { row: number; subWidth: number }; readonly band: { top: number; height: number }; readonly offsets: ReadonlyMap<string, { x: number; y: number }>; readonly heroId: string | null; readonly isSoundOn: boolean }`
  - `interface TabletopScene { setSlots(slots: readonly SlotOrigin[]): void; render(state: SceneState): void; resize(width: number, height: number): void; refreshColors(): void; recordFrameTime(ms: number): void; dispose(): void }`
  - `createTabletopScene(canvas: HTMLCanvasElement, readToken: (name: string) => string): Promise<TabletopScene | null>` — resolves `null` when `renderer.init()` throws.

- [ ] **Step 1: Write failing tests** for `readTranslate` with the four values above, run, expect FAIL, implement, expect PASS.
- [ ] **Step 2: Implement `createTabletopScene`:** `WebGPURenderer({ canvas, antialias: true, alpha: false })`, `await renderer.init()`; a `PerspectiveCamera` with a 30° vertical field of view, pitched about 50° down and yawed so it looks from the front right as in the mock-up (exact values are the builder's, as long as every screen point of the menu area hits the table); a `RoomEnvironment` (from `three/addons/environments/RoomEnvironment.js`) through `PMREMGenerator` for soft ambient light, one shadow-casting `DirectionalLight` from the front left, a large table plane coloured `--table`, a band plane coloured `--table-band` spanning the screen width between the table points under `band.top` and `band.top + band.height`; load the seven models with `GLTFLoader`, clone one per slot, colour each material from `--${material.name}`.
- [ ] **Step 3: Implement `render(state)`:** for each slot, screen point = `measureSlotCenter` + `offsets.get(id)`; table point = `projectToTable(toNdc(...))`; hide the piece when `null` or when `id === heroId`; set position, raise the piece by `0.12 × focus`, scale `1 + 0.2 × focus` (the DOM's `FOCUSED_SCALE_GAIN`), and drive visibility by `visibility` (fade material opacity, hide at 0). The bell lies on its side (rotation 90° about the camera-facing horizontal axis) when `isSoundOn` is false. Apply the quality level's pixel ratio and shadow map size. Render once.
- [ ] **Step 4: Run** `tsc --noEmit` and the scene tests. Ask the owner and commit tasks 5–6 as `feat: 机の上に駒を並べて描く 3D の場面を作る`.

### Task 7: Wire the scene into the menu

**Files:**
- Modify: `pages/_components/MenuScreen.tsx`, `pages/_components/menu.css`
- Create: `pages/_components/scene/slots.ts` (browser DOM reading, no unit test)
- Modify: `AGENTS.md` (Site Constraints: the top page bullet and the 3D bullet)

**Interfaces:**
- Consumes: Tasks 3, 4, 6.
- Produces: `readSlotOrigins(stage: HTMLElement, frame: MenuFrame, layout: { row: number; subWidth: number }): SlotOrigin[]` — for every `.menu-main-icon` and `.menu-sub-icon`, its rect centre with the current paint undone (`y + frame.main * row`, `x + measureRowShift(row, frame) * subWidth`); ids are `main-<row>` and `sub-<row>-<sub>`; kind from `PIECE_BY_MAIN[MENU[row].id]`.

- [ ] **Step 1: Mount the canvas.** Render `<canvas className="menu-scene" aria-hidden="true" />` as the first child of `.menu`, fixed to the viewport behind `.menu-rows`. In the scroller effect, after the scroller exists, `import("./scene/scene")` and `createTabletopScene`; on success call `setSlots(readSlotOrigins(...))`, `resize`, render once, then set `data-scene="ready"` on `.menu` through state. Dispose on cleanup. If the effect is cleaned up before the import resolves, dispose the scene when it arrives.
- [ ] **Step 2: Render on every paint.** In the scroller's `paint(frame)`, after `paintRow`, call `scene.render(...)` with the current `isSoundOn` and `heroId` read through refs (the paint callback is created once), and `recordFrameTime` with the time since the previous paint while frames arrive less than 100 ms apart. In `handleResize`, re-read slots, `resize`, render.
- [ ] **Step 3: Hide the 2D parts once ready** in `menu.css`: under `.menu[data-scene="ready"]`, `.menu-main-icon` and `.menu-sub-icon` get `opacity: 0`, except `.menu[data-detail="open"] [data-hero] .menu-sub-icon`; `.menu-band` gets a transparent background except under `[data-detail="open"]`, with `background-color` added to its transition; `.menu` drops its own background where the canvas draws.
- [ ] **Step 4: Follow the open/close transition.** On `openDetail` and `closeDetail`, run a `requestAnimationFrame` loop for 1600 ms that builds `offsets` from `readTranslate(getComputedStyle(el).translate)` summed over each slot's `.menu-row` and its `.menu-main-item` or `.menu-sub-item`, sets `heroId` to the opened sub's id while open, and renders. Fade the canvas under the expanding band: `.menu[data-detail="open"] .menu-scene { opacity: 0 }` with a 400 ms `var(--ease-in-out)` transition delayed by `var(--hero-grow-delay)`; under `prefers-reduced-motion: reduce`, a 200 ms `ease` opacity change with no delay, matching `.menu-rows`.
- [ ] **Step 5: Follow sound and theme.** Render when `isSoundOn` changes (an effect that synchronises the scene with `isSoundOn`), and on `matchMedia("(prefers-color-scheme: dark)")` change call `refreshColors` and render.
- [ ] **Step 6: Verify in the browser** (`mise exec -- pnpm run dev`) at desktop width and at 390 × 844: pieces sit under their labels while scrolling by wheel, drag and arrow keys; each step still plays one `select` sound; resizing mid-scroll keeps them aligned; opening and closing an item sends pieces out farthest first and back; the bell lies down when sound is off; switching the OS theme recolours without a reload; with reduced motion the canvas only fades; with `navigator.gpu` and WebGL both unavailable (Chrome `--disable-gpu --disable-software-rasterizer`, or the renderer forced to fail) the 2D menu shows unchanged. Report any check not run as "not run".
- [ ] **Step 7: Run** `tsc --noEmit`, all tests, and `pnpm run build`; note the client chunk size that holds `three`. Update `AGENTS.md`. Ask the owner and commit as `feat: トップのメニューを机の上に並ぶ 3D の駒で見せる`.
