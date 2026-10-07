# Slopera House

An opera-inspired brand website for Leonardo Modena, an AI tenor singing about small everyday problems.

## Run & Operate

- `pnpm --filter @workspace/slopera-house run dev` — run the website through its managed workflow
- `pnpm --filter @workspace/api-server run dev` — run the API server through its managed workflow
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Form delivery uses the API server and the Resend connector, with a verified sender for slopera.nyc. No database is required.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

- The supplied ZIP was a static prototype. Never claim a message or signup was received unless the email provider accepted it.

## Product

- Responsive single-page website with Leonardo's introduction, Instagram content, merchandise previews, and social links.
- Without a Behold feed ID, display the account's verified public post using Instagram's official embed instead of empty tiles.
- The custom eight-post Instagram grid requires a Behold JSON feed ID. The free Behold plan only supports six.
- Merchandise cards have inline email waitlist forms. There is no checkout or ordering.
- Waitlist signups and tragedy submissions are emailed to leo@slopera.nyc, not stored in a database. Delivery requires the connected Resend service and a verified sender.

## User preferences

- The website should use a white background with black text.
- Preserve the existing typography, colors, photo treatments, section layout, and spacing during copy and integration updates.
- Never use em dashes in visible website text.

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
