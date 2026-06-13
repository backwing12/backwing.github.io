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
- Supabase set up
  - watched_movies table (id, created_at, tmdb_id, rating, review)
  - RLS enabled with public read policy
  - Writes handled via Vercel serverless functions using service key
- Vercel serverless functions
  - api/movie.js — TMDB proxy (hides API key)
  - api/watched.js — Supabase writes (POST, PATCH, DELETE)
- Environment variables set up in .env and Vercel dashboard
- TMDB API connection tested and working

## In Progress / Up Next
- Movies page (/movies) — Movie Tinder
  - Show random movie card (poster, title, year, genres, overview)
  - Yes/No buttons to log as watched
  - Filters (language, genre, year range etc.)
  - Live sidebar showing recently watched
- Catalogue page (/catalogue) — structured watched list
  - All watched movies with ratings, reviews, useful info

## Decisions Made
- Version control via terminal (git add, commit, push) — GitHub Desktop used for initial clone
- Public repo
- No auth — single user personal site, service key used server-side for writes
- Movie data fetched from TMDB on demand, only tmdb_id/rating/review stored in Supabase
- Vercel serverless functions used for all API calls to hide keys
- Use `vercel dev` instead of `npm run dev` to test serverless functions locally
- Cell size fixed at 32px for Minesweeper