# Project agent memory

This file is the project's committed home for project-intrinsic agent knowledge: build, test, release, architecture, and sharp-edge notes that should travel with the code.

- Add durable project-specific notes here as they are discovered through real work.
- `index.html` + `styles.css` are the real personal site (minimal, static, no build step, no external requests). `game-portfolio.html` is a separate standalone entry point for the old canvas adventure-game portfolio; it and `game.js` use `game-styles.css`, not `styles.css`. Don't let edits to one stylesheet bleed into the other.
- No JS framework, bundler, or dependency is intended for the site pages — GitHub Pages serves the repo root directly from `master`.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
