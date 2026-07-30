# MyRishta

MyRishta is a closed-beta matchmaking platform organized as a pnpm and Turborepo
monorepo. It contains an Expo mobile client, a Next.js moderation console, a Hono
API, a standalone background worker, and shared TypeScript packages.

## Repository layout

- `apps/mobile` — Expo Router mobile and static web client
- `apps/admin` — Next.js staff moderation console
- `apps/api` — Hono REST API and OpenAPI document
- `apps/worker` — independently deployable background worker
- `packages/contracts` — runtime API schemas
- `packages/domain` — framework-independent domain rules
- `packages/db` — Drizzle schema, migrations, and PostgreSQL access
- `packages/config` — validated shared runtime configuration
- `packages/types` — shared TypeScript-only models

Deployable applications do not import one another. Shared behavior belongs in a
package so each application can be built, tested, scaled, and deployed independently.

## Requirements

- Node.js 24 (see `.node-version`)
- Corepack
- PostgreSQL 17 for database-backed development and migration verification

## Setup

```powershell
corepack enable
corepack pnpm install --frozen-lockfile
Copy-Item .env.example .env
```

Root scripts do not automatically load `.env`. Export the required variables in your
shell or use your deployment platform's environment injection. For example:

```powershell
$env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/myrishta"
corepack pnpm db:migrate
corepack pnpm api:dev
```

If the API runs behind a trusted reverse proxy, set `TRUST_PROXY=true` so the rate
limiter uses the proxy-provided client address. Leave it unset when clients can reach
the API directly.

## Verification

```powershell
corepack pnpm check
corepack pnpm lint
corepack pnpm format:check
corepack pnpm test
corepack pnpm db:check
corepack pnpm build
corepack pnpm api:generate
git diff --exit-code -- openapi.json
```

`db:check` and `db:migrate` require `DATABASE_URL`. CI starts PostgreSQL and provides
the variable automatically.

## Development commands

```powershell
corepack pnpm mobile:start
corepack pnpm admin:dev
corepack pnpm api:dev
corepack pnpm --filter @myrishta/worker dev
```

Product milestones and the definition of done are maintained in [PLAN.md](PLAN.md).
Database conventions are documented in
[docs/architecture/database-conventions.md](docs/architecture/database-conventions.md).

## Security and licensing

Never commit `.env` files, credentials, user data, or production exports. Report
security issues privately to the repository owners instead of opening a public issue.

This repository is proprietary. See [LICENSE](LICENSE).
