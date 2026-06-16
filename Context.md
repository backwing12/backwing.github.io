# backwing.dev — Project Context

## Stack
- **Frontend:** React + Vite
- **Hosting:** Vercel (auto-deploys on push to main)
- **Repo:** github.com/backwing12/backwing.github.io
- **Domain:** backwing.dev
- **Database (planned):** Supabase

## Design
- Dark background (#0f0f0f), light text (#f0f0f0)
- Accent color: #7F77DD (purple)
- Minimal, clean, modern aesthetic
- No emojis — will replace with Tabler icons eventually
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
  - Timer and flag counter
  - Fixed 32px cell size, board centered, header locked to Expert width
- Custom favicon (nested triangles, light-to-dark purple)
- Supabase setup
  - watched_movies table (id, created_at, tmdb_id, rating, review)
  - RLS enabled with public read policy
  - Writes handled via Vercel serverless functions using service key
- Vercel serverless functions
  - api/movie.js — TMDB proxy, handles all filter params
  - api/watched.js — Supabase writes (POST, PATCH, DELETE)
- Environment variables set up in .env and Vercel dashboard
- Movie Tinder (/movies)
  - Random movie from TMDB with poster, title, year, overview
  - Yes/No buttons — Yes saves to Supabase - No button session exclusions, excludes no movies until page refresh or filter change
  - Filters: language, decade, genres, min votes, min rating
  - Collapsible sidebar, open by default
  - Duplicate prevention via watchedIds set
  - Two-step fetch to avoid empty page results
  - Filter auto updates (fixed issue of 2 movies loading on page load)
- Catalogue (/catalogue)
  - Fetches all watched movies from Supabase, enriches with TMDB data
  - Compact list with small thumbnail, title, year, genres, runtime, rating, date
  - Paginated at 20 per page
  - Delete with confirmation

## In Progress
- Admin / Auth system
  - /admin route with login page
  - Password stored in .env / Vercel env vars
  - Token stored in localStorage with expiry
  - Reusable useAuth hook
  - Serverless functions check token in request headers
  - Foundation for future: user management, analytics, access control

## Up Next
- Fix slow load times (image lazy loading / preloading)
- Add rating and review editing per movie entry in Catalogue
- Search / sort functionality in Catalogue (by title, genre, year, rating)
- Search functionality for adding specific movies (Movie Tinder = casual discovery, Catalogue = intentional logging)
- Additional lists ("Want to watch", "Need to rewatch", etc.)
- CSS art gallery page (/art)
- Start using proper icons instead of emojis
- Portfolio navigation overhaul — clean solution for navigating between all pages

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