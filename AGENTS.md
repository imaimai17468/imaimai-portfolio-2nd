# Project Instructions

This repository is a static site whose pages are generated. `generator/` is a Rust program that builds them with [hypersig](https://github.com/imaimai17468/hypersig) and writes the top page `index.html`, the about page `about/index.html`, and the hypersig runtime `hypersig.js` to the repository root. `scripts/subset_fonts.py` writes `fonts/zen-kurenaido.woff2` from the font source and its OFL license in `fonts/src/`. The rest of the root holds the files the page loads (`frog.svg`, `pencil.svg`, `paper.svg` for the background texture, `avatar.png` for the profile on the about page, `icon.png` for the favicon) and `og.png`, the 1200×630 share image for OG and Twitter Card. The generated files are committed, and Vercel serves the repository root with the "Other" framework preset and no build command, so a merge to `main` deploys whatever was committed. `scripts/build.sh` runs both, and needs `cargo`, `uv`, and the network: the generator fetches the RSS feeds of Zenn and sizu (`generator/src/feed.rs`) and lists their articles newest first, so the list changes only when the build runs and its output is committed. There is no package manager for the browser side, test suite, linter, or CI.

## Site Constraints

- **Edit the generator, never the HTML.** Each page's content, the `<head>` and header they share (`layout`), and the styles live in `generator/src/main.rs`. Links between pages come from the routes in its `routes!` block. Styles are written with `hypersig::style` (hypersig_style) and go into `<style>` elements in `<head>`, so there is no stylesheet file. Run `scripts/build.sh` after each change and commit the regenerated `index.html`, `about/index.html`, `hypersig.js`, and `fonts/zen-kurenaido.woff2` with the source change that produced them. The font keeps only the kana and the characters in the pages' text, so a character added to a page shows in Yu Gothic until the build runs.
- **No outside resources.** Every text on the site, Latin and Japanese, headings included, is set in Zen Kurenaido, which has one weight, so a bold heading is drawn bolder by the browser. It is served from `fonts/`, so the page loads nothing from another origin. Its digits differ in width, so a column of dates takes a fixed width. Adding another page, a script beyond the hypersig runtime, another image, another font, or a third-party embed is a design change the user decides, never a side effect of another task.
- **Two colors.** The page uses `#f9fafb` and `#1d1d1d` (`WHITE` and `BLACK` in the `look` module of `generator/src/main.rs`). The `background` and `foreground` tokens hold them: dark text on light in light mode, swapped by the `Theme` under `prefers-color-scheme: dark`. Add a lighter shade by mixing those two with `Color::mix` instead of adding a third color.
- **Everything at the repository root is public.** Vercel serves the whole root, so never commit a secret, a private address, or a note meant only for the owner.

## Knowledge Currency

Your training data goes stale. Before stating a specific version, flag, configuration key, or how an external tool behaves (Vercel included), check the current official documentation, and say "not verified" where you could not.

## Verification

With no linter or test suite, verification is by hand. Before reporting a change done:

- Run `scripts/build.sh` and confirm it writes the pages and the font without a compile error or a panic.
- Serve the root with `python3 -m http.server` and look at the page in a browser, at desktop and at phone width.
- Report any step you could not run as "not run", never as "passed".

## Rules

- `.claude/rules/prose.md`: writing standards for comments, docs, and commit messages. Always applies.
- `.claude/rules/replies.md`: the shape of replies to the user. Always applies, and `.claude/hooks/reply-open-gate.sh` enforces its opening line.

## Commits

- **One commit = one purpose.** If two changes could be reverted independently, split them, and a drive-by fix is always a separate commit. Never `git add -A`/`git add .`. Stage explicit paths, and use `git add -p` to split hunks within a file.
- First line states **what improves**, not what you did. Prefixes: `feat` / `fix` / `refactor` / `test` / `docs` / `chore` (intent-based). Body in Japanese, and `fix`/`refactor` include a *why* line. End with a `Co-Authored-By:` trailer crediting the current model.
- Do not commit without explicit user confirmation.

## Agents

Write all agent-facing docs (`.claude/`, AGENTS.md, CLAUDE.md) in English.
