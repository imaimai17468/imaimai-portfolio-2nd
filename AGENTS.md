# Project Instructions

This repository is the portfolio site, a React app built with [Void](https://void.cloud), the Vite-based framework and deploy CLI for Cloudflare Workers. Pages are files under `pages/` that render on the server first and hydrate in the browser, shared code lives in `src/`, and files in `public/` are served as they are. `vite.config.ts` loads `voidPlugin()` and `voidReact()`, and `void.config.ts` holds the Void settings. Void's APIs postdate your training data, so before working with Void read the relevant Markdown docs in `node_modules/void/docs/`, starting with `guide/pages-routing/overview.md` for pages and `reference/cli.md` for commands.

`mise.toml` pins Node and pnpm. Void needs Node 24.22+ or 26.12+, so run commands through `mise exec --` where the shell's Node is older. Install with `pnpm install`, which runs `void prepare` to generate `.void/`.

## Site Constraints

- **The top page is a menu prototype.** `pages/_components/MenuScreen.tsx` draws a vertical main menu whose selection band stays fixed while the list scrolls, and a horizontal row of sub items to its right; tapping a sub item opens its content in place: its icon and label spring to the heading while everything else leaves away from it, farthest first, and the band opens to fill the screen, with the timing in `pages/_components/menu.css`. The menu text lives in `pages/_components/menu-content.ts`, partly carried over from the previous site and partly placeholder. `public/frog.svg` is the frog drawn one row above the first menu item, and `public/avatar.png`, `public/icon.png` and `public/og.png` are the profile image, the favicon and the 1200×630 share image, all carried over from the previous site.
- **Type is LINE Seed JP in Bold (700) and ExtraBold (800) alone.** `src/styles.css`, which `pages/layout.tsx` loads on every page, imports the two weights from `@fontsource/line-seed-jp` and sets `--font-sans`, `--font-weight-body` (700) and `--font-weight-heading` (800). Vite copies the font files into the build, so they are served from this site. Adding another weight or family is a design change the owner decides.
- **UI sounds are the SND piano kit (SND02).** `src/lib/piano/player.ts` exports `piano`, whose `play(sound, volume)` plays one sound from the kit's audio sprite and returns a handle with `stop()`. The audio and its sprite map come from the `snd-lib` package and are bundled, rather than loaded from the jsDelivr URL `snd-lib` uses itself. Call `play` from a user gesture, because a browser keeps an AudioContext created outside one suspended. The SND terms allow free use and forbid redistributing the unprocessed audio on its own, so the audio stays in `node_modules` and the build output and never goes into `public/`.
- **The BGM is one loop generated for this site.** `public/bgm.m4a` is a 59.8-second AAC loop made with Stable Audio 3 (the local audio-studio tool), and `src/lib/bgm/player.ts` exports `bgm`, which fades it in and loops it. The sound switch in the menu starts off and turns the BGM and the UI sounds on and off together, so nothing plays until the visitor turns it on, because a browser blocks audio before a user gesture.
- **The menu is drawn as 3D objects on a tabletop.** `pages/_components/scene/` renders it with Three.js `WebGPURenderer` (WebGL 2 where WebGPU is missing): one object per menu item from `public/models/<main id>.glb` and `<main id>--<sub id>.glb`, each standing on the table where its 2D icon sits on the DOM menu, which CSS lays on the table (`.menu-board`); the buttons, labels, focus and transitions stay as they are, and only the row titles are hidden. The 2D icons stay in the layout, hidden once the scene is ready, and the 2D menu stays untouched where the renderer cannot start. The objects are modelled in Blender, take their colours from the `--piece-*` and `--table*` tokens in `src/styles.css` through their material names, and are exported with meshopt compression. `docs/superpowers/specs/2026-11-17-3d-tabletop-menu-design.md` holds the design. Code that needs `window`, a WebGL or WebGPU context or `requestAnimationFrame` runs only in the browser, as `.claude/rules/react.md` (Browser-only Code) says, because the server render runs in a Worker that has none of them. Cloudflare allows 25 MiB per static asset file and 64 MiB of uncompressed Worker bundle (checked 2026-11-18).
- **Tests run with `pnpm test`** (Vitest through Vite+); test files import from `vite-plus/test`.
- **Deploys go to the owner's Cloudflare account.** `void deploy` builds, provisions and publishes, so the owner runs it, never an agent. The previous site was served by Vercel from the repository root, and that project no longer has a page to serve once this layout is on `main`.
- **Everything in `public/` and in the built output is public.** Never commit a secret, a private address, or a note meant only for the owner. Void reads local values from `.env` alone and refuses to start while `.env.local` exists.

## Knowledge Currency

Your training data goes stale. Before stating a specific version, flag, configuration key, or how an external tool behaves (Void and Cloudflare included), check the current official documentation or `node_modules/void/docs/`, and say "not verified" where you could not.

## Verification

Before reporting a change done:

- Run `pnpm test` and confirm the tests pass.
- Run `pnpm exec tsc --noEmit` and confirm the type check passes.
- Run `pnpm run build` and confirm it finishes without an error.
- Run `pnpm run dev`, open the URL it prints, and look at the page in a browser at desktop and at phone width.
- Report any step you could not run as "not run", never as "passed".

## Rules

- `.claude/rules/prose.md`: writing standards for comments, docs, and commit messages. Always applies.
- `.claude/rules/replies.md`: the shape of replies to the user. Always applies, and `.claude/hooks/reply-open-gate.sh` enforces its opening line.
- `.claude/rules/react.md`: effects, hooks, component props and splitting, module placement under `pages/` and `src/`, and browser-only code. Read it before editing a `.ts` or `.tsx` file.
- `.claude/rules/functions.md`: the shape a function takes so each branch can be reached. Read it before writing a function.
- `.claude/rules/design.md`: the design system. Read it before deciding a UI question or editing a stylesheet or a component.
- The `motion-craft` skill holds the duration, easing and reduced-motion defaults. Use it for any animation or transition.
- `.claude/skills/` also holds Emil Kowalski's design and animation skills (`animate`, `choreograph`, `gestures`, `review-animations` and others), copied from github.com/emilkowalski/skills under the MIT license in `.claude/skills/LICENSE.emilkowalski-skills`. Where one of them disagrees with `motion-craft` on a value this repository already settled, `motion-craft` wins.

## Commits

- **One commit = one purpose.** If two changes could be reverted independently, split them, and a drive-by fix is always a separate commit. Never `git add -A`/`git add .`. Stage explicit paths, and use `git add -p` to split hunks within a file.
- First line states **what improves**, not what you did. Prefixes: `feat` / `fix` / `refactor` / `test` / `docs` / `chore` (intent-based). Body in Japanese, and `fix`/`refactor` include a *why* line. End with a `Co-Authored-By:` trailer crediting the current model.
- Do not commit without explicit user confirmation.

## Agents

Write all agent-facing docs (`.claude/`, AGENTS.md, CLAUDE.md) in English.
