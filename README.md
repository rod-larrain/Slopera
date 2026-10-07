# Slopera House

Website for Slopera House, starring Leonardo Modena. Opera for small problems.

Live at [slopera.nyc](https://slopera.nyc).

## Stack

- Vite + React + Tailwind, a single static site
- Hosted on Netlify, which builds from this repo on every push to `main`
- Forms (tragedy submissions and merch waitlist) handled by Netlify Forms

## Work on it locally

```sh
npm install
npm run dev
```

Open http://localhost:5173.

## Deploy

Push to `main`. Netlify builds with `npm run build` and publishes `dist/` (see `netlify.toml`).

## Where things are

- `src/App.tsx`: all page sections and copy, including the product list
- `src/index.css`: every style
- `src/components/EmailForms.tsx`: the tragedy and waitlist forms
- `src/components/InstagramFeed.tsx`: the Instagram grid (Behold feed ID lives here)
- `public/media/`: hero, product and section images
- `src/assets/`: logo and dog walk photo
- `index.html`: page title, social preview text, and the hidden form copies Netlify needs

## Form emails

Submissions appear in Netlify under Forms. To get them by email, add a notification in Netlify: Site configuration > Forms > Form notifications > Email notification, sent to leo@slopera.nyc.

If you add or rename a form field, update both `EmailForms.tsx` and the hidden form in `index.html`.
