# Slopera House

Static Vite + React + Tailwind site for slopera.nyc. Hosted on Netlify, deployed by pushing to `main` on GitHub (rod-larrain/Slopera). No Replit, no server, no database.

## Rules

- White background, black text. Keep the existing typography (Cormorant Garamond + DM Sans), colors, photo treatments, layout and spacing unless asked to change them.
- Never use em dashes in visible text.
- Never claim a message or signup was received unless Netlify accepted the POST.

## Commands

- `npm install`, `npm run dev`, `npm run build`, `npm run typecheck`

## Notes

- Forms use Netlify Forms. Field names in `src/components/EmailForms.tsx` must match the hidden forms in `index.html`.
- `package.json` pins rollup to 4.63.1 through `overrides`. 4.64.1 hangs the build on react-dom. Remove the override only after confirming a newer rollup builds.
- Tailwind scans `src` only (`@import 'tailwindcss' source('.')` in `src/index.css`).
