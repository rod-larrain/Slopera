# Slopera House source export

This folder contains the current Slopera House website source, its local images and fonts, the Express API server, and the shared workspace packages.

## Open with Claude Code

1. Unzip `slopera-house-source.zip`.
2. Open the extracted `slopera-house` folder in your editor or terminal.
3. Start Claude Code in that folder with `claude`.
4. Ask Claude to read this file and `replit.md` before making changes.

For Claude's chat interface, upload the ZIP if your interface supports ZIP attachments. Otherwise, extract it and attach the relevant source files. Claude Code can work directly with the extracted folder.

## Setup

Use Node.js 24 and pnpm 10.

```sh
pnpm install --frozen-lockfile
```

Preview the website from the project root:

```sh
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/slopera-house run dev
```

Open `http://localhost:5173`.

Type-check the website:

```sh
pnpm --filter @workspace/slopera-house run typecheck
```

Build the website:

```sh
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/slopera-house run build
```

Start the API in a second terminal:

```sh
PORT=3001 pnpm --filter @workspace/api-server run dev
```

The API health endpoint is `http://localhost:3001/api/healthz`. Replit normally routes `/api` to this server. For local form testing, configure the website's Vite `server.proxy` to forward `/api` to `http://localhost:3001`; this export preserves the original configuration instead of modifying the running project.

## Important dependencies

- Email submission uses the Replit-managed Resend connector. Its credentials are not exported. Outside Replit, Claude must adapt that integration to the destination environment before email delivery will work.
- Instagram uses a public Behold JSON feed. New posts depend on Behold's refresh schedule and account limits; the free plan updates daily.
- No database contents are included. The current form handlers send email without persisting submissions in a database.
- Replit-specific Vite development plugins remain in the source. The cartographer and development banner are conditional on running in Replit.

## Preserve the current website

- Preserve the white background, black text, typography, photo treatments, and overall layout.
- Never add em dashes to visible website text.
- La Bottega has six locally served product images, product titles, and static `Sold out` labels. Do not restore prices, descriptions, or waitlist buttons without asking.
- La Bottega shows three columns on mobile at 700px and below, two columns from 701px through 900px, and three columns above 900px.
- The submission section includes the Fonografo image beside the heading and form on desktop and above them on mobile.

## Folder map

- `artifacts/slopera-house/`: website source, CSS, local images and fonts.
- `artifacts/api-server/`: Express server and email form routes.
- `lib/api-spec/`: OpenAPI contract and code generation configuration.
- `lib/api-client-react/`: generated API client and React hooks.
- `lib/api-zod/`: generated validation schemas.
- `lib/db/`: existing database package and schemas, not database contents.
- `attached_assets/`: only the two original images still directly imported by the website.
- `scripts/`: workspace helper source.

Excluded: credentials, environment files, private agent files, Git history, unrelated mockup sandbox, installed dependencies, caches, generated build output, and unrelated uploaded assets.
