# Colombia Mods 3D

[Versión en español](./README.md)

Official website of **Colombia Mods 3D**, a Colombian studio that builds mods and 3D models for *American Truck Simulator*. It shows the mod catalog (fetched live from an API), the official launcher and a contact form backed by its own service.

> This is a real, in-production project: [colombiamods3d.com](https://colombiamods3d.com).

## What this project demonstrates

| Area | Details |
| --- | --- |
| **Frontend** | React 19, React Router 7, Tailwind CSS 4 and Vite 8. Route-level code splitting, no third-party UI kit. |
| **In-browser 3D** | three.js: an animated truck in the hero and an interactive viewer. The model went from 20.3 MB to 1.9 MB through a reproducible script (`scripts/optimize-glb.mjs`). |
| **Performance** | Critical CSS inlined, three.js kept out of the initial bundle, responsive images, and `ResizeObserver` instead of layout reads inside animation loops. See [docs/PERFORMANCE.md](./docs/PERFORMANCE.md). |
| **SEO** | A Vite plugin pre-renders each route's `<head>` (title, description, canonical, Open Graph) and generates `sitemap.xml` and `robots.txt`. |
| **Accessibility** | Skip link, managed focus on route change, heading hierarchy, `prefers-reduced-motion`. Lighthouse: 98. |
| **Security** | Strict CSP with no `unsafe-inline` for scripts, Trusted Types, HSTS, COOP and the usual headers. See [docs/SECURITY.md](./docs/SECURITY.md). |
| **Backend** | Node/Express API for the form: validation, allow-list CORS, rate limiting, HTML email over SMTP, with tests. |
| **Quality** | ESLint, tests on Node's built-in runner, GitHub Actions CI and Dependabot. |
| **AI agents** | `llms.txt` and an `/.well-known/ai-catalog.json` manifest so models and agents can understand the site. |

## Stack

React 19 · React Router 7 · Vite 8 · Tailwind CSS 4 · three.js · Node.js 22 · Express 5 · Nodemailer · GitHub Actions

## Quick start

Requires Node.js ≥ 20.19 (the version in `.nvmrc` is recommended).

```sh
npm install
cp .env.example .env     # adjust the variables (see "Configuration")
npm run dev              # http://localhost:5173
```

To try the contact form you also need the backend: see [backend/README.md](./backend/README.md) (in Spanish).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build into `dist/` (per-route HTML, sitemap and robots included) |
| `npm run preview` | Serve `dist/` locally |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (`node --test`) |
| `npm run check` | Lint + tests + build, the same as CI |
| `npm run optimize:model -- in.glb out.glb` | Compress a GLB model for the web |

## Configuration

Frontend variables (`.env`, public: **never put secrets here**):

| Variable | Description |
| --- | --- |
| `VITE_SITE_URL` | Public origin, no trailing slash. Must match the backend's `SITE_URL`. |
| `VITE_BACKEND_URL` | Public URL of the catalog API, no trailing slash. |
| `VITE_CONTACT_ENDPOINT` | URL of `POST /api/contact`. Locally: `http://localhost:3001/api/contact`. |

Content is editable without touching components: `src/config.js` (links, socials, emails, launcher screenshots, legal data) and `src/seo.js` (per-page title and description). SMTP credentials live only in `backend/.env`.

## Structure

```
src/
  pages/              one screen per route (lazy-loaded except Home)
  components/
    layout/           Header, Footer, PageHero, ErrorBoundary
    ui/               buttons, icons, links, Reveal, OnView, LauncherWindow
    catalog/          ModCard, ModDetail, ModImage, promos and countdowns
    scene3d/          HeroScene, HeroTruck and Model3D (three.js)
  context/            Catalog (single fetch + detail modal) and Toast
  lib/                pure logic: catalog, formatting, SVG scenery, three.js helpers
  hooks/              useFlip (FLIP animation for the catalog)
  config.js · seo.js  editable content and per-page metadata
backend/              contact API (Express + Nodemailer) and its tests
deploy/               nginx example
docs/                 architecture, performance, deployment and security
scripts/              asset build tools
public/               favicons, manifest, GLB model, llms.txt, .well-known, .htaccess
```

## Documentation

Architecture, performance, deployment and security notes live in [`docs/`](./docs) (written in Spanish). The change history is in [CHANGELOG.md](./CHANGELOG.md).

## License

Copyright © 2026 Colombia Mods 3D. **All rights reserved.** The code is published for viewing and evaluation only; see [LICENSE](./LICENSE).
