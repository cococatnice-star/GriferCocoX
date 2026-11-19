# CocoX

A CocoX-branded web storefront and signing utility, backed by an Express API.

## Run & Operate

- `pnpm --filter @workspace/roblox-shop run dev` — run the web storefront
- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/mockup-sandbox run dev` — run the component preview server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

The web app is the root preview. The API is available at `/api`. Replit's artifact workflows provide the `PORT` and `BASE_PATH` values needed by the development servers.

The API uses the workspace PostgreSQL database (`DATABASE_URL`). `SESSION_SECRET` is configured as a Replit secret. The API starts without a Discord bot token, but Discord bot features remain disabled until `DISCORD_BOT_TOKEN` is configured. IPA install/upload routes also require App Storage setup and the `PRIVATE_OBJECT_DIR` / `PUBLIC_OBJECT_SEARCH_PATHS` environment variables.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/roblox-shop` — React/Vite storefront and client-side CocoX signer.
- `artifacts/api-server` — Express API, auth, install routes, and Discord bot.
- `lib/db` — Drizzle schema and PostgreSQL client.
- `lib/api-spec` — OpenAPI source and generated API types.
- `artifacts/mockup-sandbox` — isolated UI component previews.

## Architecture decisions

- Keep the existing pnpm workspace and registered Replit artifacts; their manifests provide preview routing and environment configuration.

## Product

The storefront offers CocoX downloads and signing, with API-backed installation, authentication, and related services.

## User preferences

No additional user preferences recorded.

## Gotchas

- API features that upload or serve IPA files require App Storage and its object-directory environment variables.
- The Discord bot is optional for local startup; without `DISCORD_BOT_TOKEN`, it is disabled.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- The CocoX IPA download link on the home page is set in `artifacts/roblox-shop/src/pages/Home.tsx`.
