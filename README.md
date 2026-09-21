# Structural Engineering Suite

A cross-platform structural engineering calculator covering Steel Beams &
Columns, Concrete Footings, Retaining Walls, and Timber & Engineered Wood
Framing (NDS 2018 / ASCE 7 / IBC / AISC / ACI references).

Runs from a single shared codebase (`index.html`, `index.css`, `js/`) as:

- **Web / PWA** — any static host or browser, installable via `manifest.json` + `sw.js`
- **Desktop** — Electron wrapper (`main.js`)
- **Mobile** — Capacitor wrapper (`capacitor.config.json`) for iOS/Android

## Getting Started

```
npm install
npm start
```

`npm start` launches the Electron desktop shell pointed at the local
`index.html` / `js/` files — this is the fastest way to run and test the
app day-to-day, with no build/install step.

## Updating

To pick up the latest changes from `main`:

```
git pull origin main
npm install     # only needed if package.json changed
npm start
```

Any `git pull` is live the next time you run `npm start` — no rebuild
required for normal use.

### Building a distributable installer

Only needed occasionally (e.g. to hand the app to someone else, or to get
a Start Menu / desktop shortcut install):

```
npm run dist
```

Run this on the target OS natively (e.g. a real Windows machine for the
NSIS installer) — cross-building the Windows installer from Linux/macOS
requires Wine and is fragile. Output lands in `dist/`.

## Project Structure

- `index.html` / `index.css` — UI markup and styling
- `js/app.js` — application controller (UI wiring, project save/load, calc orchestration)
- `js/*_engine.js` — calculation engines per module (steel, timber, concrete, retaining)
- `main.js` — Electron entry point
- `manifest.json` / `sw.js` — PWA manifest and service worker
