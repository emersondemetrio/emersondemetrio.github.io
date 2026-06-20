# Handoff: emerson.run — personal links site ("The Mixtape")

## Overview
A redesign of **emerson.run**, a personal links hub. The page's primary job is to present a
scannable list of links (the owner's accounts and channels) grouped by category, plus a small
"Experiments" section linking to JS demos. The visual concept is a **light "album" skin** —
links read as a tracklist, with subtle music flavor (wordmark, a small spinning record mark, a
warm palette). The album theme must stay subtle: **links are the product and must lead the page**.

The design ships in two layouts that share state: **Desktop** and **Mobile**.

## About the Design Files
The file in this bundle (`emerson.run mixtape.dc.html`) is a **design reference created in HTML** —
a prototype showing the intended look and behavior. It is **not production code to copy directly**.
It uses a small in-house template runtime (`<x-dc>`, `<sc-for>`, `{{ }}` holes) that is **not** part
of any real framework — ignore that machinery entirely.

Your task: **recreate this design in the target repo using its existing stack and conventions**
(React/Next, Vue, Astro, plain HTML — whatever emerson.run is built in). Reuse the repo's existing
component primitives, styling approach, routing, and link/data structures. If the repo has no UI
system yet, pick the most appropriate framework for a tiny static personal site (Astro or Next.js
static export are both good) and implement it there.

## Fidelity
**High-fidelity.** Colors, typography, spacing, and interactions below are final. Recreate the UI
faithfully, but express it through the repo's existing patterns (e.g. if the repo uses CSS Modules
or Tailwind, use that rather than inline styles).

## Layout overview
Single page, single column, centered. Two responsive breakpoints:
- **Desktop / tablet (≥ ~720px):** content column max-width **820px**, centered, generous padding.
- **Mobile (< ~720px):** full-width, ~20px horizontal padding, larger tap targets.

There is **no** giant hero image, **no** audio-player bar, **no** fake track durations or track
numbers. Those were intentionally cut — do not reintroduce them.

## Screens / Views

### 1. Main page — Desktop
- **Purpose:** visitor scans links, taps through to a destination; optionally browses experiments.
- **Layout (top → bottom), all within an 820px centered column:**
  1. **Header row** (flex, space-between, vertically centered):
     - Left: a **logo group** (flex, gap 13px) = a 30×30px circular "record" mark + wordmark.
       - Record mark: `border-radius:50%`, background is a layered radial gradient (see Record Mark
         token below), `animation: spin 6s linear infinite`.
       - Wordmark: text `EMERSON·RUN`, font **Archivo 900**, 20px, letter-spacing −0.02em. The `·`
         is colored with the accent.
     - Right: **theme toggle button** — pill, transparent bg, 1px border `--line`, text is
       `☾ Dark` in light mode / `☀ Light` in dark mode (glyph + label), 12px Hanken 700, uppercase,
       letter-spacing .08em, padding 8px 14px, border-radius 999px.
  2. **Intro block** (margin-top 34px):
     - `<h1>` **"Everywhere to find me."** — Archivo 800, 36px, letter-spacing −0.02em, line-height 1.02.
     - Sub-line — Spectral *italic* 17px, color `--muted`: *"a software engineer, currently
       recompiling for the AI era — Links, Vol. 2"*
  3. **Filter row** (margin-top 26px, flex gap 8px, bottom border `--line`, padding-bottom 18px):
     four pill buttons — **All / Social / Work / Arts**. See Filter Pill states below.
  4. **Link sections** — one per visible category. Each section:
     - **Section header**: small label (Archivo 800, 12px, uppercase, letter-spacing .12em,
       color `--muted`) followed by a 1px horizontal rule (`--line`) filling remaining width.
       Labels: **Social**, **Work**, **Arts**.
     - **Link rows** (each is an `<a>`): flex, align-center, gap 20px, padding 15px 12px,
       border-radius 9px, no underline, color `--ink`.
       - Label: fixed width **190px**, 20px, weight 700, letter-spacing −0.01em.
       - Handle: flex:1, 15px, color `--muted`.
       - Affordance: text **"Open ↗"** — 12px, weight 700, uppercase, letter-spacing .08em,
         color `--accent`, `white-space:nowrap`.
       - **Hover:** row background → `--hover`.
  5. **Experiments section** (margin-top 44px, top border `--line`, padding-top 30px):
     - Header: `<h2>` **"Experiments"** (Archivo 800, 18px) + inline Spectral italic 14px muted note
       *"a few small things I built for fun"*.
     - **Card grid**: 3 columns, gap 16px. Each card is an `<a>`: 1px border `--line`,
       border-radius 11px, padding 18px.
       - Title 16px/700; blurb 13px/`--muted`/line-height 1.5; footer **"Open ↗"** (12px, 700,
         uppercase, accent).
       - **Hover:** border-color → `--accent`, background → `--hover`.
  6. **Footer**: Spectral italic 14px muted — *"© 2026 emerson.run — thanks for stopping by,
     whoever you are."*

### 2. Main page — Mobile
Same content and order, restyled for a phone:
- **Header**: smaller record mark (24px) + wordmark (Archivo 900, 16px). Theme toggle is a compact
  pill showing **only the glyph** (`☾` / `☀`).
- **Intro**: h1 28px; sub-line Spectral italic 14px (*"a software engineer, recompiling — Vol. 2"*).
- **Filter**: horizontally scrollable chip row (`overflow-x:auto`), chips `white-space:nowrap`,
  padding 9px 16px, 12px text. Keep them ≥ 44px tall for tap targets.
- **Link rows**: label + handle **stacked** in a left block (label 18px/700, handle 13px/`--muted`),
  right side a single accent `↗` glyph (16px). Padding 15px vertical, 1px bottom border `--line`.
- **Experiments**: vertical stack (not a grid) of bordered cards (border-radius 12px, padding 14px),
  title 15px/700 + blurb 12.5px muted on the left, accent `↗` on the right.
- **Footer**: Spectral italic 13px muted.

> The mobile prototype is shown inside a phone-bezel frame purely for presentation. **Do not build a
> fake phone bezel or a fixed 390×844 device frame** in production — implement normal responsive CSS
> that collapses the desktop layout to the mobile layout at the breakpoint.

## Interactions & Behavior
- **Category filter:** clicking a pill (All / Social / Work / Arts) filters the visible link
  sections. `All` shows all three sections; a specific category shows only that one section. Pure
  client-side, instant, no animation required.
- **Theme toggle:** switches the whole page between light and dark by swapping the token values
  (see Design Tokens). Persist the choice (e.g. `localStorage`), and respect
  `prefers-color-scheme` on first visit.
- **Filter + theme are shared/global** for the page — there is only one of each; the desktop and
  mobile layouts are the same page at different widths, not two independent components.
- **Links:** standard navigation. External links should open appropriately (e.g. `target="_blank"
  rel="noopener"` per the repo's convention); `mailto:` for email.
- **Record mark:** continuous slow rotation, `spin 6s linear infinite`. Respect
  `prefers-reduced-motion: reduce` (disable the animation).
- **Hover states:** link rows and experiment cards as described above. No other motion.

## State Management
- `filter`: one of `"all" | "social" | "professional" | "arts"`. Default `"all"`.
- `theme`: `"light" | "dark"`. Default from `localStorage` → else `prefers-color-scheme` → else `"light"`.
- No data fetching — link and experiment data is static (see Content below). Keep it in a typed data
  file/array so it's easy to edit.

## Design Tokens

### Colors — Light theme
| Token | Hex | Use |
|---|---|---|
| `--bg` | `#f4f1ea` | page background |
| `--chrome` | `#e9e5db` | (browser-frame only; presentation — ignore in prod) |
| `--ink` | `#1f1d18` | primary text |
| `--muted` | `#857f72` | secondary text / handles / labels |
| `--line` | `#e0dacd` | borders, rules, dividers |
| `--accent` | `#c2562b` | accent (terracotta) — links affordance, active pill, record center, `·` |
| `--hover` | `#ece7db` | row/card hover background |
| `--vinyl` | `#2a2722` | record-mark groove color A |
| `--vinyl2` | `#16140f` | record-mark groove color B |

### Colors — Dark theme
| Token | Hex |
|---|---|
| `--bg` | `#141210` |
| `--chrome` | `#1c1a16` |
| `--ink` | `#efeae0` |
| `--muted` | `#948c7e` |
| `--line` | `#2b2820` |
| `--accent` | `#e09056` |
| `--hover` | `#1e1b16` |
| `--vinyl` | `#1a1815` |
| `--vinyl2` | `#070605` |

Active filter pills use `#fff` text on `--accent` fill in **both** themes.

### Record mark (the small spinning logo / experiment-thumб motif)
A circle filled with two stacked CSS gradients:
```
background:
  radial-gradient(circle at center, var(--accent) 0 24%, transparent 24.5%),
  repeating-radial-gradient(circle at center, var(--vinyl) 0 1.4px, var(--vinyl2) 1.4px 2.8px);
```
(The `24%` center disc + repeating grooves read as a tiny vinyl record. Scale the groove px values
down proportionally for smaller marks: ~1.2px/2.4px at 24px.)

### Typography
- **Display / wordmark / headings:** `Archivo`, weights 700/800/900.
- **Body / UI / handles:** `Hanken Grotesk`, weights 400–800.
- **Accent / italic asides:** `Spectral` (italic) — used for sub-lines, the experiments note, footer.
- Type scale used: h1 36px (desktop) / 28px (mobile); link label 20px (d) / 18px (m); h2 18px;
  body/handle 15px / 13px; labels 12px uppercase.
- All three families are Google Fonts. Swap to the repo's font-loading mechanism.

### Spacing / radius
- Content column max-width **820px**, centered.
- Section gaps: ~30–44px. Link-row padding 15px 12px. Card padding 18px (d) / 14px (m).
- Border radius: pills 999px; link rows 9px; experiment cards 11px (d) / 12px (m).
- Borders/dividers: 1px solid `--line`. Active pill border 1.5px `--accent`.
- Shadows: none required in production (the prototype's shadow is on the presentation frame only).

## Content (exact copy + data)
Group order: **Social → Work → Arts**. (Internally the third group's category key is `"arts"`,
the second is `"professional"` but labeled **"Work"** in the UI.)

**Social**
- Email — `emer.demetrio@gmail.com` — `mailto:emer.demetrio@gmail.com`
- WhatsApp — `@emersondemetrio` — _URL TBD (placeholder `#`)_
- Instagram — `@emersondemetrio` — `https://instagram.com/emersondemetrio`
- X / Twitter — `@emersondemetrio` — `https://x.com/emersondemetrio`

**Work**
- GitHub — `@emersondemetrio` — `https://github.com/emersondemetrio`
- LinkedIn — `@emersondemetrio` — `https://www.linkedin.com/in/emersondemetrio`
- Gist — `@emersondemetrio` — `https://gist.github.com/emersondemetrio`
- CodePen — `@emersondemetrio` — `https://codepen.io/emersondemetrio`

**Arts**
- YouTube — `@emersondemetrio` — `https://youtube.com/@emersondemetrio`
- Playlists — `curated on YouTube` — _URL TBD (placeholder `#`)_
- SoundCloud — `@emersondemetrio` — `https://soundcloud.com/emersondemetrio`
- Spotify — `@emersondemetrio` — _URL TBD (placeholder `#`)_
- Blog — `badcompiler.dev` — _URL TBD (placeholder `#`)_

**Experiments** (title — blurb — URL)
- Currency Tools — "A tiny FX converter that does one thing well." — TBD
- Remove Background — "Client-side image cutout — nothing leaves the tab." — TBD
- Canvas Game — "A small thing you can actually play." — TBD

> ⚠️ Replace the four `#` placeholder URLs and the three experiment URLs with the real ones from the
> existing site/repo before shipping.

## Assets
No raster/image assets. The only graphic is the CSS-gradient "record mark" (spec above) — no SVG or
image files needed. Icons used are plain Unicode glyphs: `↗`, `☾`, `☀`, `·`.

## Files
- `emerson.run mixtape.dc.html` — the design reference (open in a browser to see desktop + mobile
  side by side, and to interact with the live filter + theme toggle). Treat as a visual/behavioral
  spec only; do not copy its `<x-dc>` / `<sc-for>` markup into production.
