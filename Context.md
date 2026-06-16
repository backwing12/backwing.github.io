# backwing.dev — Project Context

## Stack
- **Frontend:** React + Vite
- **Hosting:** Vercel (auto-deploys on push to main)
- **Repo:** github.com/backwing12/backwing.github.io
- **Domain:** backwing.dev
- **Database (planned):** Supabase
- **Dev server:** `vercel dev` (not `npm run dev`) — needed for serverless functions, runs on localhost:3000

## Design
- Dark background (#0f0f0f), light text (#f0f0f0)
- Accent color: #7F77DD (purple)
- Minimal, clean, modern aesthetic
- Using Tabler Icons (@tabler/icons-react) throughout
- All text capitalized normally (not all lowercase)
- CSS variables defined in src/index.css

## Project Structure
```
src/
  assets/
  components/
    Navbar.jsx
  pages/
    Home.jsx
    Movies.jsx
    Minesweeper.jsx
  App.jsx
  App.css
  index.css
  main.jsx
public/
  favicon.svg  (custom nested triangles, purple)
```

## Completed
- Full dev environment (Node.js, React, Vite, GitHub, Vercel)
- Routing with react-router-dom
- Navbar with active link highlighting
- Home page with project cards (hover effect, links to pages)
- Minesweeper — fully working
  - 3 preset difficulties (Beginner 9x9/10, Intermediate 16x16/40, Expert 16x30/99)
  - Left click reveal, right click flag, middle click chord
  - First click guaranteed safe + opens area
  - Pixel face reset button (happy / dead / sunglasses)
  - Timer and flag counter with Tabler icons
  - Fixed 32px cell size, board centered, header locked to Expert width
- Custom favicon (nested triangles, light-to-dark purple)
- Supabase setup
  - watched_movies table (id, created_at, tmdb_id, rating, review)
  - RLS enabled with public read policy
  - Writes handled via Vercel serverless functions using service key
- Vercel serverless functions
  - api/auth.js — login, returns signed token
  - api/movie.js — TMDB proxy, handles all filter params
  - api/watched.js — Supabase writes (POST, PATCH, DELETE), token protected
  - api/_verify.js — token verification helper
- Environment variables set up in .env and Vercel dashboard
- Movie Tinder (/movies)
  - Random movie from TMDB with poster, title, year, overview
  - Yes/No buttons — Yes saves to Supabase (requires auth token)
  - Filters: language, decade, genres, min votes, min rating
  - Collapsible sidebar, open by default, auto-updates on filter change
  - Duplicate prevention via watchedIdsRef
  - No button session exclusions (resets on filter change)
  - Two-step fetch to avoid empty page results
  - "Not logged in" banner when unauthenticated
- Catalogue (/catalogue)
  - Fetches all watched movies from Supabase, enriches with TMDB data
  - Compact list with small thumbnail, title, year, genres, runtime, rating, date
  - Paginated at 20 per page
  - Delete with confirmation (token protected)
- Admin page (/admin)
  - Password login/logout
  - Token stored in localStorage with 7 day expiry

## In Progress
- General aesthetic overhaul — site feels retro, want more modern look

## Up Next
- Fix slow load times (image lazy loading / preloading)
- Add rating and review editing per movie entry in Catalogue
- Search / sort functionality in Catalogue (by title, genre, year, rating)
- Search functionality for adding specific movies (Movie Tinder = casual discovery, 
- Catalogue = intentional logging)
  - Additional lists ("Want to watch", "Need to rewatch", etc.)
- CSS art gallery page (/art)
- Portfolio navigation overhaul — clean solution for navigating between all pages
- Add unique constraint on tmdb_id in Supabase to prevent duplicates at database level
- Expand admin page (analytics, stats dashboard)

## Decisions Made
- Version control via terminal (git add, commit, push) — GitHub Desktop used for initial clone
- Public repo
- No auth — single user personal site, service key used server-side for writes
- Movie data fetched from TMDB on demand, only tmdb_id/rating/review stored in Supabase
- Vercel serverless functions used for all API calls to hide keys
- Use `vercel dev` instead of `npm run dev` to test serverless functions locally
- Cell size fixed at 32px for Minesweeper
- Movie Tinder: No button is session-only exclusion (resets on refresh/filter change)
- Catalogue: paginated at 20 movies per page with small thumbnails (w92)
- /admin route not linked in navbar — accessible by URL only