# What Can My Browser Do?

A single-page, zero-dependency browser capability inspector. Open the link → get an instant, categorized report of every feature your current browser supports — CSS, JS, Web APIs, hardware, network, permissions, and more.

**Live:** https://rithviknishad.github.io/what-can-my-browser-do/

- 100% client-side. Zero network requests at runtime. No tracking, no backend.
- Zero third-party dependencies. Fully auditable.
- ~130+ capability checks across 17 categories.
- Export results as JSON, share via URL hash.

## Features

17 categories:

1. CSS Layout · 2. CSS Visual / Effects · 3. CSS Animation · 4. CSS Responsive
5. CSS Typography · 6. JavaScript Language · 7. Storage · 8. Network
9. Graphics & Media · 10. Input & Interaction · 11. Device & Hardware
12. Performance · 13. Workers & Concurrency · 14. Security & Identity
15. Payments · 16. Browser Environment · 17. Progressive Web App

## Architecture

Registry-driven. Every feature is a declarative entry:

```js
{
  id: 'css-grid',
  label: 'CSS Grid',
  description: 'Two-dimensional layout via display: grid.',
  mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout',
  tags: ['css', 'layout'],
  detect: () => ({ supported: CSS.supports('display', 'grid') }),
}
```

Adding a check = one object literal in the relevant [`registry/`](registry/) file. The renderer, search, filter, and export logic never change.

### File layout

```
index.html           # app shell + styles
app/
  main.js            # bootstrap
  detect.js          # safeDetect wrapper + allSettled driver
  render.js          # generic row renderer
  state.js           # results Map + pub/sub
  search.js          # search / filter
  export.js          # JSON export + URL-hash share
registry/
  index.js           # barrel
  css-layout.js
  css-visual.js
  ...                # one file per category
```

## Run locally

No build step. Open `index.html` directly, or serve it for features that require a secure context:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Export & Share

- **Export JSON** — downloads a snapshot: `{ timestamp, ua, results: { [id]: SupportResult } }`.
- **Share URL** — encodes the snapshot into the URL hash. Open the link on another device to view what that browser reported.

## Privacy

All detection runs locally in your browser. Nothing is sent anywhere. View source — it's all there.

## Contributing

Add a check in three steps:

1. Pick the appropriate [`registry/*.js`](registry/) file.
2. Append an object to its `checks` array.
3. Open `index.html`. Your check appears.

`detect()` must never throw — it's wrapped by `safeDetect`, but returning clean results is preferred. It may be sync or async (`Promise<SupportResult>`).

```ts
type SupportResult = {
  supported: true | false | 'partial';
  value?: string;   // e.g. "8 GB", "en-IN"
  note?: string;    // e.g. "Behind a flag in Firefox"
};
```

## License

[MIT](LICENSE) © 2026 Rithvik Nishad
