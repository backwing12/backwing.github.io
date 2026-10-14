# backwing.dev — Project Context

Personal portfolio site for Christopher Vosgraff (IT bachelor, USN 2025). Used in job applications, so it should look clean and work reliably.

## How we work
- Christopher directs, asks questions and makes decisions. Claude writes most of the code.
- Explain what you change and why, briefly. Ask before larger refactors or new dependencies.
- Christopher reviews and commits/pushes himself (terminal or GitHub Desktop). Do not push without asking.

## Stack
- **Frontend:** React 19 + Vite 8, react-router-dom
- **Hosting:** Vercel (auto-deploys on push to `main`)
- **Repo:** github.com/backwing12/backwing.github.io (public)
- **Domain:** backwing.dev
- **Database:** Supabase (`watched_movies` table)
- **Icons:** Tabler Icons (`@tabler/icons-react`)
- **Styling:** inline styles + CSS variables in `src/index.css`

## Running locally (Windows)
- Use `vercel dev`, NOT `npm run dev`. Serverless functions in `api/` only run under `vercel dev`. Runs on localhost:3000.
- `vercel.json` has a rewrite that excludes Vite internals (`src`, `node_modules`, `@vite`, `@react-refresh`, `api`). It fixes a Windows-specific Vite 8 + Vercel CLI bug. Do not remove it.
- The rewrite also catches files in `public/` under `vercel dev` (prod is fine). New top-level files or folders in `public/` must be added to its exclusion list (currently `projects`, `favicon.svg`, `icons.svg`).
- Harmless terminal assertion errors from Vercel CLI on Windows can be ignored.
- If `vercel dev` says the token is invalid: run `vercel login`.
- Vercel CLI auto-upgrade fails on Windows (`spawn npm ENOENT`). Upgrade manually with `npm i -g vercel@latest`.
- **File name casing:** Windows ignores case in imports, but Vercel builds on Linux and does not. Always match the exact file name casing in imports.

## Project structure
```
api/
  _verify.js     token verification helper
  auth.js        login, returns signed token
  movie.js       TMDB proxy (all filter params)
  watched.js     Supabase writes (POST, PATCH, DELETE), token protected
src/
  components/Navbar.jsx
  data/SchoolProjectsData.js   data for school project pages
  hooks/useAuth.js
  lib/supabase.js
  pages/
    Home.jsx           landing page, personal + school project cards
    Movies.jsx         Movie Tinder (/movies)
    Catalogue.jsx      watched movies list (/catalogue)
    Minesweeper.jsx    (/minesweeper)
    Admin.jsx          login (/admin, not linked in navbar)
    SchoolProject.jsx  detail page (/school/:slug)
  App.jsx, main.jsx, index.css
public/
  favicon.svg, icons.svg
```
Environment variables live in `.env` / `.env.local` and the Vercel dashboard. Never print or commit their contents.

## Design (current)
- Dark background (#0f0f0f), surface #1a1a1a, border #333, text #f0f0f0, muted #888
- Accent: #7F77DD (purple)
- Font: DM Sans
- Minimal, clean. Normal capitalization.

## Done
- Routing, navbar with active link highlighting
- Home page with project cards (personal + school sections)
- Minesweeper: 3 difficulties, reveal/flag/chord, safe first click, face reset, timer, flag counter
- Movie Tinder: random TMDB movie, filters (language, decade, genres, min votes, min rating), Yes saves to Supabase (token required), duplicate prevention
- Catalogue: watched movies from Supabase enriched with TMDB data, 20 per page, delete with confirmation (token protected)
- Admin: password login/logout, HMAC-signed token in localStorage, 7-day expiry
- Unique constraint on `watched_movies.tmdb_id` (API returns 409 on duplicate)
- School projects: data file, detail page and cards on Home (see below)

## In progress: school projects
Three projects in `src/data/SchoolProjectsData.js`, shown on Home and at `/school/:slug`. Live versions are hosted on a classmate's site (sayver.net). We chose static screenshots over iframes in case that site changes.
- WEB1100 (Semester 1, 2022): Kennel Terra Polar, modernized an existing dog kennel site
- PRO1000 (Semester 2, 2023): Snatch Media AS, fictional computer retailer, made with a local web dev company
- APP2000 (Semester 3–4, 2023–2024): Sørflaten Auto AS, real car dealership, dynamic pages, database, admin panel

Remaining:
- [x] Fix import casing in `SchoolProject.jsx` (`../data/SchoolProjectsData`)
- [x] Fill in `tech` and `groupSize` (all groups of 5). Old repos (`ShadXn/APP2000`, `Endreoh/PRO1000-G7`) are private, so no GitHub links
- [x] Wayback Machine snapshots in `links.archive` (not shown on the page, fallback if sayver.net goes down). Screenshot box hides itself if the image is missing
- [x] Screenshots in `public/projects/` (`*.webp`, 1440x900, captured with headless Chrome)
- Bachelor thesis (group of five, ML model detecting high-voltage infrastructure in LIDAR data): dropped for now, private repo and no demo. Can be shown on GitHub if an employer asks
- [ ] Remove the em-dashes in the descriptions if rewriting them

## Known issues
- TMDB rate limiting when Catalogue loads (many simultaneous calls). Planned fix: a Kotlin backend that caches TMDB data.
- Slow load times (images)

## Up next
- **Aesthetic overhaul + mobile (next session).** Decided 2026-10-08:
  - Palette: amber. bg `#141210`, surface `#1d1a17`, border `#2e2925`, text `#f2ede6`, muted `#9a9088`, accent `#e8a54b`. Font stays DM Sans.
  - Approach: a few shared CSS classes (button, card, eyebrow label, layouts) + media queries in `index.css`. Inline styles stay for one-offs.
  - Mobile priority: Catalogue and Movie Tinder look worst. Minesweeper only light polish (hard to play on mobile anyway). School project pages already look good.
  - Move hardcoded colors (`#E24B4A` ×18, `#ccc`, `#fff`) to CSS variables as part of this.
- Small cleanups, offered but not yet approved: lint errors (unused vars in Minesweeper/Movies, Node globals for `api/` in eslint config), unused `src/App.css` and `public/icons.svg` (also remove from the `vercel.json` exclusion)
- Rating/review editing and search/sort in Catalogue
- Portfolio navigation overhaul

## Other folders in ../GitHub (not this site)
- `Backwing-nettside` (empty repo) and `Backwing/backwing-nettside` (early plain HTML attempt) are old and unused.
