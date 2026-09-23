# Project Instructions

This repository is a static site: `index.html` and `style.css` at the repository root, and nothing else the browser loads. There is no package manager, build step, framework, JavaScript, test suite, linter, or CI. Vercel serves the repository root with the "Other" framework preset, and a merge to `main` deploys it.

## Site Constraints

- **One HTML file and one stylesheet.** Content goes into `index.html`, styling into `style.css`. Adding a second page, a script, an image, a web font, or a third-party embed is a design change the user decides, never a side effect of another task.
- **White background, text only.** The page is black text on white. Keep colors as custom properties on `:root` in `style.css`.
- **Everything at the repository root is public.** Vercel serves the whole root, so never commit a secret, a private address, or a note meant only for the owner.

## Knowledge Currency

Your training data goes stale. Before stating a specific version, flag, configuration key, or how an external tool behaves (Vercel included), check the current official documentation, and say "not verified" where you could not.

## Verification

With no build or linter, verification is by hand. Before reporting a change done:

- Confirm `index.html` closes every element it opens.
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
