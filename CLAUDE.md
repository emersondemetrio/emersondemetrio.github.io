# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start Vite dev server
npm run build        # tsc + vite build (runs predeploy)
npm run lint         # ESLint (max-warnings 4, not 0)
npm run type:check   # TypeScript check without emitting
npm run generate:css # compile Tailwind once
npm run css:w        # compile Tailwind in watch mode
npm run format:fix   # deno fmt src (not prettier for src/)
npm run deploy       # build + gh-pages publish to dist/
npm run cli:new:page <name> [description]  # scaffold a new page
```

There are no tests in this project.

CSS must be compiled separately from Vite. When adding new Tailwind classes, run `generate:css` (or keep `css:w` running alongside `dev`).

## Architecture

**React SPA deployed to GitHub Pages at emerson.run.** Routing is hash-based (`HashRouter`) so all routes use `#/` prefix — this is intentional for static hosting.

**Path alias**: `@/` resolves to `./src/` (configured in `vite.config.ts`).

### Route → Page mapping (`src/App.tsx`)

| Route | Page |
|---|---|
| `/` | Home — terminal-style links + labs index |
| `/about`, `/resume` | Resume |
| `/blog` | Blog — paginated tweets from `src/store/t.json` |
| `/dev` | DevDaily |
| `/pasteable`, `/paste` | Pasteable |
| `/labs/background` | RemoveBackground (uses `@imgly/background-removal`) |
| `/labs/game` | CanvasGame |
| `/labs/timezones`, `/labs/weather` | WeatherApp |
| `/labs/code-pen` | CodePen |
| `/labs/countdown[/:id/:name?]` | Countdown |
| `/labs/camera` | Camera |
| `/labs/audio-fx` | AudioFx (Tone.js + FFmpeg) |
| `/labs/white-noise` | WhiteNoise |

Old routes redirect to `/labs/*` equivalents via `Navigate`.

### Key structural conventions

- **Pages** live in `src/pages/<page-name>/<page-name>.tsx`. Each page is a self-contained directory with its own hooks, utils, and sub-components. Scaffold new ones with `npm run cli:new:page`.
- **Shared components** live in `src/components/`. The `Terminal` component on the home page renders links, tools, and experiments from `src/constants.ts`.
- **Custom hooks** live in `src/hooks/`. `use-cache.ts` provides a localStorage cache with `DAILY`/`WEEKLY`/`MONTHLY` invalidation policies.
- **Global types** are in `src/types.ts`; **global constants** (all social links, experiments list, currency providers) are in `src/constants.ts`.
- **State management**: Zustand is used for the tweets store (`src/store/twitter.ts`).

### Adding a new lab/experiment

1. Scaffold: `npm run cli:new:page <name>`
2. Add a route in `src/App.tsx`
3. Add an entry to the `experiments` array in `src/constants.ts`

### FFmpeg / audio pages

`@ffmpeg/ffmpeg` and `@ffmpeg/util` are excluded from Vite's `optimizeDeps`. The dev server sets `Cross-Origin-Embedder-Policy: credentialless` and `Cross-Origin-Opener-Policy: same-origin` headers (required for `SharedArrayBuffer`). The `public/_headers` file applies the same headers in production (Cloudflare Pages / Netlify).

### Styling

Tailwind + DaisyUI with a custom dark theme named `emerson.run` (black base, blue primary `#0068ff`). Always use DaisyUI semantic class names (`btn`, `modal`, `badge`, etc.) before reaching for raw Tailwind. Dark mode uses the `selector` strategy.

### Deployment

Merging to `main` triggers the GitHub Actions workflow (`.github/workflows/`) which builds and publishes `dist/` to the `gh-pages` branch. The `VITE_WEATHER_API_KEY` secret must be set in the repo for the weather page to work.
