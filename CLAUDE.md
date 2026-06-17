# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server with codegen watch
pnpm build        # Production build (includes codegen)
pnpm lint         # ESLint
pnpm codegen      # Regenerate GraphQL types + React Router types
pnpm preview      # Preview production build locally
```

There are no tests in this project.

## Architecture

**Snowboard Emporium** is a Shopify Hydrogen headless storefront — a React Router v7 app running on Shopify's Oxygen (Cloudflare Workers-compatible) runtime.

### Request lifecycle

`server.js` is the edge entry point. Each request flows through:

1. `createHydrogenRouterContext()` (`app/lib/context.js`) — opens the cache, initialises the cookie session, and creates Hydrogen's storefront/cart/customerAccount clients
2. `createRequestHandler()` — React Router handles routing and SSR, receiving the Hydrogen context as `loadContext`
3. On 404, `storefrontRedirect` checks Shopify for redirect rules before returning

### Routing

Routes live in `app/routes/` using React Router's flat-file convention (`@react-router/fs-routes`). `app/routes.js` wraps them with `hydrogenRoutes()` for Hydrogen-specific additions. Route types are auto-generated into `.react-router/types/app/`.

### Data fetching

Each route uses React Router `loader` / `action`. The Hydrogen context (storefront client, cart, customerAccount) is accessed via `args.context`. The pattern in `root.jsx` — separating `loadCriticalData` (awaited, blocks render) from `loadDeferredData` (streamed, non-blocking) — should be followed in routes too.

### GraphQL & codegen

Two projects in `.graphqlrc.js`:

- `default` — Storefront API (queries in `app/**`)
- `customer` — Customer Account API (queries in `app/graphql/customer-account/`)

Running codegen generates typed query results into `storefrontapi.generated.d.ts` and `customer-accountapi.generated.d.ts`. Always run codegen after adding or changing GraphQL queries.

Shared GraphQL fragments (cart, header/footer menus) live in `app/lib/fragments.js`.

### Styling

Tailwind v4 via the `@tailwindcss/vite` plugin. Global styles in `app/styles/` (imported as `?url` in `root.jsx` to avoid a Vite HMR bug).

## Critical import rule

**Never import from `react-router-dom` or any `@remix-run/*` package.** Use `react-router` for all routing hooks and components (`useLoaderData`, `Link`, `Form`, etc.).

| Instead of                  | Use            |
| --------------------------- | -------------- |
| `@remix-run/react`          | `react-router` |
| `@remix-run/server-runtime` | `react-router` |
| `react-router-dom`          | `react-router` |

## Project conventions (Snowboard Emporium)

### State architecture

- Zustand is for client-only UI state ONLY: wishlist + cart drawer open/close
- DO NOT reimplement the Shopify cart in Zustand — the cart client in context owns cart data
- The /wishlist route reads from the Zustand store, not a loader
- Zustand stores live in `app/stores/` — one file per concern:
  - `app/stores/wishlist.store.ts` — add/remove favorites, persisted to localStorage
  - `app/stores/ui.store.ts` — cart drawer open/close

### Scope (do not build unless explicitly asked)

- No auth / customer accounts
- No search
- No CMS or blog
- Payments go through Shopify hosted checkout — no custom payment handling

### Workflow rules

- One task at a time — produce a reviewable diff, then stop and wait
- Do not add npm packages without asking first
- Run `pnpm lint` before declaring any task done
- Run `pnpm codegen` every time a GraphQL query is added or changed
