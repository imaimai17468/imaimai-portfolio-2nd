# 3D tabletop menu

## Intent

The top page menu becomes a set of play pieces standing on a tabletop, seen from above at an angle. The owner always meant the current 2D menu to be this: scrolling through the menu passes one piece after another in front of the viewer, each step clicking into place with a sound, and that rhythm is what the owner wants to feel. The 2D menu was the version that could be built first.

The look borrows the mechanism of a game menu (pieces on a board, a fixed camera, a sound per step). It is an original design for this site and takes no shape, artwork, colour scheme or layout from any existing game.

## Goals

- Every menu item is a 3D piece on a flat tabletop, viewed by a fixed camera above and to the side.
- The structure stays as it is today: the main menu runs vertically on screen (rows receding into the table), and the selected row shows its sub items horizontally.
- Scrolling, dragging, the wheel and the arrow keys move through the pieces with the same feel as today: the same springs, detents, rubber banding and one `select` sound per step.
- High visual quality without textures: a clean white studio room, soft light, soft contact shadows, matte solid-coloured pieces.
- Rendering uses WebGPU where the browser has it and falls back to WebGL where it does not.

## Non-goals

- Textures, physics, or pieces that the visitor can knock over or move freely.
- Changing the menu content in `pages/_components/menu-content.ts`.
- Rebuilding the detail view. It keeps its current layout and contents.

## Anti-goals

These would make the work a failure even if it renders:

- Scrolling feels slower or heavier than the 2D menu does now, or a step drops frames on a phone.
- A label cannot be read, or a menu item cannot be reached by keyboard or a screen reader.
- The page is blank or jumps while the 3D scene loads, or shows nothing where WebGPU and WebGL are both unavailable.
- The result reads as a copy of a specific game's menu.

## Constraints

- Void renders pages on the server inside a Worker, which has no `window`, WebGL or WebGPU. All 3D code runs in the browser only, as `.claude/rules/react.md` (Browser-only Code) says.
- Type is LINE Seed JP 700 and 800 alone (`AGENTS.md`). Text stays in the DOM so it uses this font and stays selectable and accessible.
- Colours reach the scene through the CSS tokens in `src/styles.css`, read with `getComputedStyle` (`.claude/rules/design.md`), so light and dark mode both reach the scene.
- Motion values follow the `motion-craft` skill, including reduced motion.
- Static assets go in `public/` and are public. Cloudflare allows 25 MiB per static asset file and 64 MiB of uncompressed Worker bundle on both Free and Paid, with no compressed limit (developers.cloudflare.com/workers/platform/limits/, updated 2026-11-13, read 2026-11-18). The models and the library sit far below both.
- `WebGPURenderer` in three 0.187.0 falls back to its WebGL 2 backend on its own when WebGPU is unavailable, and `forceWebGL: true` forces that backend (`node_modules/three/src/renderers/webgpu/WebGPURenderer.js`, constructor, read 2026-11-18).

## Approaches

| Approach | Rendering | Pieces | Result |
|---|---|---|---|
| **A: Three.js WebGPU renderer, Blender models** | `three/webgpu` (`WebGPURenderer`, which falls back to WebGL 2) | Modelled in Blender through the Blender MCP, exported as glTF binary (`.glb`) | **Chosen by the owner.** WebGPU where available, a fallback where not, and curved piece shapes. |
| B: Three.js, pieces built in code | Same as A | Primitives (cylinders, boxes) combined in code | Lost: piece shapes are limited to what primitives can make. |
| C: WebGPU written directly | Hand-written WebGPU | Blender models | Lost: lighting and shadows must be written by hand, several times the work, and nothing shows without WebGPU. |

The WebGL 2 fallback is verified in Constraints.

## Design

### What the visitor sees

```
        camera: fixed, above and to the side
   ┌──────────────────────────────────────┐
   │   ○   ○   ◎   ○   ○    sub row (selected main row only)
   │   ▣                    main pieces, one per main item,
   │   ▢                    receding into the table
   │   ▢
   └──────────────────────────────────────┘
              white tabletop in a white room
```

The owner approved a Blender mock-up of this layout on 2026-11-17: the main column runs from the back of the table toward the camera on the left, the selected row runs to the right along a slightly darker band drawn on the table, the camera looks down from the front right with a perspective lens, and the pieces are matte with muted colours.

- The room and the tabletop are one light, near-white surface tone taken from the tokens, lit by a soft key light and an ambient fill, with soft contact shadows under each piece. In dark mode the room takes the dark token values.
- The selected piece stands in a fixed place on screen, as the selection band does today, and the pieces slide past it. The selected piece is raised a little and lit more brightly. Pieces further from the selection dim, as `paintRow` dims them today.
- The owner revised the layout on 2026-11-18: the menu is laid out in 3D on the table, with the labels printed on the tabletop. The DOM menu itself lies on the table: `.menu` holds a CSS `perspective` and `.menu-board` turns the rows by `rotateX(--board-tilt) rotateZ(--board-twist)`, so rows recede and shrink toward the top and the grid runs at an angle. The scene's camera is computed from the same perspective, tilt and screen size (`placeBoardCamera`), and each piece stands at its icon's point in the board's own layout carried onto the table (`toTablePoint`), so pieces, printed labels and the printed band agree exactly.
- The canvas lies over the DOM with a transparent background and no pointer events, so a piece in front hides the print behind it; the table colour (`--table`) and the band (`--table-band`) are the DOM under it. The buttons that carry the labels stay the hit targets for pointer, keyboard and screen reader.
- The owner revised the text on 2026-11-18: the row titles are not printed on the table, while the item labels stay printed under their pieces. A sub piece rattles like a chess piece set down crooked as a sub step brings it onto the band: it tips onto the rim of its base in a random direction, knocks back flat and hops lower a few times (about 340ms), and the opened piece crosses with its 2D icon over 250ms instead of swapping at once.
- The board is flat until the scene is ready, and stands up flat while an item is open, so the open-item flight is measured and flown on a flat board.
- The 2D lucide icons are hidden once the 3D scene has drawn its first frame.

### Pieces

The owner revised this on 2026-11-18, after the mock-up: every menu item gets its own object, shaped after what the item is, in the same matte, untextured style as the mock-up. The mock-up's chess pieces and dice are replaced.

- 36 objects: one per main item (7) and one per sub item (29). Each takes the meaning of its current lucide icon and label, drawn as a small desk-toy object. Brand marks and logos (GitHub, X, Zenn, Qiita, note, LAPRAS, the companies) are never modelled; those items take the generic object their lucide icon already stands for.

| Item | Object | Item | Object |
|---|---|---|---|
| sound | speaker | sound / switch | toggle switch |
| profile | peg doll | intro | name card on a stand |
| | | likes | heart |
| career | briefcase | kosen | school building with a clock |
| | | nagaoka | graduation cap |
| | | yumemi | low office building |
| | | accenture | tall office tower |
| products | parcel box | hypersig | three stacked layers |
| | | template | `</>` code block |
| | | osampo | folded map with a pin |
| | | tsuukin | train car |
| | | palette | paint palette |
| | | da-icons | cube, sphere and cone together |
| | | imaimai-ui | puzzle piece |
| | | credits | calculator |
| activities | microphone | recruiting-talks | megaphone |
| | | tech-talks | easel with a slide |
| | | judge | gavel on its block |
| articles | fountain pen | zenn | open book |
| | | sizu | spiral notebook |
| | | qiita | folded newspaper |
| | | note | sheet of paper with lines |
| links | chain link | licenses | balance scales |
| | | github | laptop |
| | | x | `@` block |
| | | speakerdeck | stack of slides |
| | | lapras | medal on a ribbon |
| | | sponsors | gift box with a heart |
| | | mail | envelope |

- Each object is a `.glb` under `public/models/`, named `<main id>.glb` for a main item and `<main id>--<sub id>.glb` for a sub item, all 36 together at most 1 MB, with flat colours and no textures.
- Colours come from a shared palette of tokens rather than one token per object: `--piece-white`, `--piece-grey`, `--piece-dark`, `--piece-blue`, `--piece-gold`, `--piece-red`, `--piece-green` and `--piece-wood`, each with a light and a dark value in `src/styles.css`. Every material in a model is named after the palette token that colours it, and the scene reads the token with `getComputedStyle`.
- The toggle switch's lever points one way when sound is on and the other way when it is off.

### How it is built

- `menu-motion.ts` and `menu-scroller.ts` are not changed. The scroller already calls `paint(frame)` once per animation frame with the main position, the sub position and the leftover shift. A new scene module receives the same `MenuFrame` and places the pieces from it, next to the existing DOM painting.
- The scene lives in its own directory beside the menu (`pages/_components/scene/`), holding the renderer setup, the piece loader and the per-frame placement, because these parts call each other (`.claude/rules/react.md`, A web of functions is one box).
- The placement is a pure function from `MenuFrame` and the item layout to each piece's position, scale and brightness, so each branch can be reached by passing values (`.claude/rules/functions.md`).
- Three.js and the models load with a dynamic import after the page has hydrated. The server render draws the current 2D menu at its final size, so nothing shifts when the canvas mounts.
- The scene renders only when a frame changes (on a scroller paint, a resize or a theme change), never in an idle loop.
- Where neither WebGPU nor WebGL can start, the canvas is not mounted and the 2D menu stays as it is today.
- Where the 3D scene starts but runs slowly, it lowers its own quality (pixel ratio, then shadow quality) rather than falling back to the 2D menu. There is no reference device; the builder measures on the phones at hand (designer's call).

### Opening an item

The detail view keeps its current layout. When an item opens, the opened item's 2D lucide icon is shown again at its piece's projected position for the moment of opening and flies to the heading as it does today, while the 3D piece under it fades (designer's call; carrying the 3D piece itself into the heading crosses from canvas to DOM and costs several times the work). The other pieces leave away from the opened one, farthest first, using the same ordering `findRowExit` and `findSubExit` give the DOM today, and the canvas fades under the expanding band. Closing reverses it.

## Left to the builder

- The exact camera angle, field of view, light positions and shadow technique, within "soft, white studio".
- How pieces dim with distance (brightness, opacity or both) and how much the selected piece rises.
- Pixel ratio caps and other performance settings needed to hold the frame rate on a phone.
- How the exit motion maps onto 3D (sliding along the table or sinking), as long as the ordering matches today's.
- The Blender modelling details for each piece, within the proposed set and the flat-colour style.
