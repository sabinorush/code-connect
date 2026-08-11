# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This is an early-stage pnpm monorepo currently holding two unmodified framework scaffolds (NestJS API, Vite/TS web) plus a set of design asset folders at the repo root (`Imagens Cards/`, `Imagens Gerais/`, `Logo/`, `Ícones/`) that aren't wired into either app yet. There is no shared application code between `api` and `web` yet.

## Repository structure

- `apps/api` — NestJS backend (TypeScript, Express platform).
- `apps/web` — React 19 + TypeScript + Vite frontend, with `react-router` handling navigation.
- Root `package.json` only holds pnpm-workspace passthrough scripts (`web:*`, `api:*`); there is no root build/test/lint aggregator.
- Workspace is defined in `pnpm-workspace.yaml` (`apps/*`). Use pnpm for all installs — do not use npm/yarn, and run installs from the repo root so hoisting stays correct.

## Commands

Run from the repo root using the `pnpm --filter` scripts defined in the root `package.json`:

```bash
pnpm install          # install all workspace deps (run from root)

pnpm web:dev           # start Vite dev server for apps/web
pnpm web:build         # tsc typecheck + vite build
pnpm web:preview       # preview the web production build

pnpm api:dev           # start Nest in watch mode
pnpm api:build         # nest build
pnpm api:start         # run built api from dist (production mode)
pnpm api:lint          # eslint --fix over api src/apps/libs/test
pnpm api:test          # jest unit tests for api
```

For commands not exposed at the root (e2e tests, coverage, single-test runs), `cd apps/api` and use the underlying scripts directly:

```bash
pnpm test:e2e                    # jest e2e suite (test/jest-e2e.json config)
pnpm test:cov                    # jest with coverage
pnpm test -- app.controller      # run a single spec by name pattern
pnpm test:watch                  # jest watch mode
```

The `web` app's test setup (Vitest + Testing Library) is in place — see Conventions below for where specs live.

## Architecture notes

- **apps/api**: standard NestJS module structure — `AppModule` wires `AppController`/`AppService` in `src/app.module.ts`. Jest config lives inline in `apps/api/package.json` (`rootDir: src`, specs matched via `*.spec.ts` next to the source they test). E2E specs live separately under `apps/api/test` with their own `jest-e2e.json` config. ESLint (`apps/api/eslint.config.mjs`) runs typescript-eslint's `recommendedTypeChecked` plus `eslint-plugin-prettier`; `no-explicit-any` is disabled, and `no-floating-promises`/`no-unsafe-argument` are downgraded to warnings.
- **apps/web**: React 19 + TypeScript + Vite, with `react-router` for navigation. `src/main.tsx` is the entry point — it mounts a `createBrowserRouter`/`RouterProvider` tree (routes for `/`, `/login`, and a catch-all `NotFound`) into `#app` via `createRoot`. Components are React functional components composed via JSX, organized per the atomic-design convention below. `apps/web/tsconfig.json` uses bundler module resolution with `verbatimModuleSyntax`, `noUnusedLocals`, and `noUnusedParameters` enabled, so unused imports/locals will fail `tsc` (and thus `web:build`). Vitest + `@testing-library/react`/`@testing-library/jest-dom` is configured in `apps/web/vite.config.ts` (jsdom environment, setup file at `src/test/setup.ts`); tests live as `ComponentName.spec.tsx` beside each component.

## Conventions

### Frontend (apps/web)

- **Atomic design**: organize components as atoms → molecules → organisms → templates → pages (e.g. `src/components/{atoms,molecules,organisms,templates}`). Keep components small and composed from the layer below; don't let a molecule reach past its atoms into organism-level concerns.
- **Tailwind**: use Tailwind utility classes for styling; avoid introducing a second styling approach (raw CSS files, CSS-in-JS) once Tailwind is in place. `apps/web/src/style.css` predates this convention — fold it into Tailwind rather than extending it with more plain CSS.
- **Every component needs a test** covering its essential usage (renders correctly, core interaction/behavior works). Add a component and its test in the same change — don't land one without the other.

### Backend (apps/api)

- Follow REST principles strictly: resource-oriented URLs (nouns, not verbs), correct HTTP methods (GET/POST/PUT/PATCH/DELETE) mapped to their semantics, proper status codes (2xx/3xx/4xx/5xx used precisely, not just 200/500), statelessness, and consistent, predictable resource representations in request/response bodies.

### Git (both projects)

- Use **Conventional Commits** for every commit in this repo (`feat:`, `fix:`, `refactor:`, `test:`, `chore:`, `docs:`, etc.), including commits scoped to only `apps/api` or only `apps/web`. Prefer a scope when it adds clarity, e.g. `feat(web): ...` / `fix(api): ...`.
