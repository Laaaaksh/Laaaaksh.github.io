# laaaaksh.github.io

My personal site, served by GitHub Pages from `master`.

`index.html` + `styles.css` are the whole site: one static page, no build step,
no framework, and no external requests (the webfont is self-hosted in
`assets/fonts/`).

Two other pages live here at fixed public paths:

- `hello/` — a self-contained page linked from my GitHub profile README.
- `reddit-autoscroller/privacy.html` — the privacy policy for a browser extension.

## Running it locally

```
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Licence

MIT.
