# ADO Control Room — UI Prototype

A Next.js (App Router, TypeScript) frontend for the ADO Control Room, built
against the spec suite in `ADO/CONTROL_ROOM_*.md` (P-01 through P-11). This
app is a **UI prototype**: every screen renders from in-memory mock data,
not the real Spring/Django API. No backend integration exists yet.

## Requirements

- Node.js **>= 20.9** (Next.js 16 requirement). Check with `node --version`.
- npm (this app is self-contained; there is no root-level `package.json` —
  always run npm from inside `apps/control`).

## Setup

```bash
cd apps/control
npm install
npm run lint
npm run build
npm run dev
```

`npm run dev` starts the app at http://localhost:3000.

## Scope and boundaries

- **No real API calls.** Every page is a Server Component that reads from
  `src/lib/data/*` (see below), which is currently backed entirely by
  in-memory mock stores under `src/lib/mock/*`. The two routes under
  `src/app/api/mock/*` are also mock-only handlers used by the P-01/P-02
  client-side filter UI — they are not a real backend and should not be
  extended to behave like one.
- **All state-changing commands are permanently disabled.** Buttons like
  승인/재시도/취소/PR 요청/복구 요청 render with their real label and an
  explanatory reason (`disabled` + `title`), never as a working action.
  There is no backend to accept them yet.
- **No merge/deploy affordance anywhere.** Per spec, ADO never renders a
  Git merge, GitHub review approval, or deployment control.

## Data source layer (`src/lib/data`)

Pages and API route handlers must import data-reading functions from
`@/lib/data`, never from `@/lib/mock/*` directly. `src/lib/data` is a set of
thin per-domain re-export files (`projects.ts`, `roadmaps.ts`,
`component-work.ts`, …) plus an `index.ts` barrel — see the comment at the
top of `src/lib/data/index.ts` for the full contract.

This exists so that swapping mock data for a real backend later is a
change confined to `src/lib/data/*`: replace each re-export with a call
into the generated OpenAPI client (once `packages/contracts` exists),
keeping the same function names and the same return types already defined
in `src/lib/contracts/*`. No page or feature component should need to
change for that swap.

```
src/lib/contracts/   TypeScript types mirroring the future OpenAPI schema
src/lib/mock/         in-memory mock stores (implementation detail — do not import directly)
src/lib/data/          <- pages import from here; the seam for a future API client swap
```

## Date/time formatting

All date/time display must go through `src/lib/format.ts`:

- `formatAbsoluteTime(iso, timeZone?)` — defaults to `Asia/Seoul`
  (`DEFAULT_DISPLAY_TIME_ZONE`), Korean locale, `medium` date / `short` time.
- `formatRelativeTime(iso, now?)` — Korean relative time ("3시간 전"), timezone-agnostic since it's a diff between two instants.

Never call `toLocaleString`/`Intl.DateTimeFormat`/etc. inline in a
component — extend `src/lib/format.ts` instead if a new display shape is
needed.

## Project structure

```
src/app/(control)/...          route segments (thin: fetch via @/lib/data, render a feature route component)
src/app/api/mock/...           mock-only API routes backing the P-01/P-02 client-side filter UI
src/features/<feature>/...     page-level composition components, one folder per feature area
src/components/...             shared UI primitives (Panel, StatusBadge, Button, EventTimeline, StateViews, ...)
src/lib/contracts/...          hand-maintained response types mirroring the future OpenAPI schema
src/lib/mock/...                in-memory mock data stores (do not import outside src/lib/data)
src/lib/data/...                 data source layer — the seam for a future real-API swap
src/styles/tokens.css           design tokens (colors, spacing, typography) — no literal values elsewhere
```

## Verification commands

```bash
npx tsc --noEmit   # typecheck
npm run lint        # eslint
npm run build        # production build (also runs typecheck)
```

Note: if your default `node` resolves to a version below 20.9 (check with
`node --version`), `next build`/`next dev` will refuse to start. Point your
shell at a Node 20+ install (e.g. via `nvm use 20`) before running these
commands.
