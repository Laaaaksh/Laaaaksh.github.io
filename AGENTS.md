# Project agent memory

This file is the project's committed home for project-intrinsic agent knowledge: build, test, release, architecture, and sharp-edge notes that should travel with the code.

- Add durable project-specific notes here as they are discovered through real work.
- `index.html` + `styles.css` are the real personal site (minimal, static, no build step, no external requests). Layout and voice deliberately follow benjaminfspector.com: one left-aligned 540px column on cream, no text-indent, no dark mode. Delius is self-hosted at `assets/fonts/` rather than pulled from Google Fonts, which is what keeps the zero-external-requests rule true.
- `hello/index.html` is a fully self-contained page (inline CSS/JS, no shared stylesheet) at the fixed public path `https://laaaaksh.github.io/hello/` — linked from the profile README, so that path is a contract.
- No JS framework, bundler, or dependency is intended for the site pages — GitHub Pages serves the repo root directly from `master`.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
