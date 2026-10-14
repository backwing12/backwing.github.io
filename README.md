# backwing.dev

Personal portfolio site with a few small web apps and school projects, live at [backwing.dev](https://backwing.dev).

## Features

- **Projects** (`/`): landing page with cards for personal and school projects. Each school project has its own detail page at `/school/:slug`.
- **Movie Tinder** (`/movies`): shows a random movie from TMDB, filtered by language, decade, genres, minimum votes and minimum rating. When logged in as admin, saying yes adds it to the watched list.
- **Catalogue** (`/catalogue`): the watched list from Supabase, enriched with TMDB data, 20 movies per page. Entries can be deleted.
- **Minesweeper** (`/minesweeper`): three difficulties, flagging, chording, safe first click, timer and flag counter.
- **Admin login** (`/admin`): password login that unlocks adding and deleting movies.

## Tech stack

- React 19 and Vite, with react-router-dom
- Vercel for hosting and serverless functions (`api/`)
- Supabase (Postgres) for the watched list
- TMDB API for movie data

## How it works

The frontend never talks to TMDB directly. It calls `/api/movie`, a Vercel serverless function that forwards the request to TMDB and adds the API key on the server, so the key never reaches the browser. Reading the watched list happens directly from the browser with Supabase's public anon key. Writes (add, update, delete) go through `/api/watched`, which uses the Supabase service key on the server and only accepts requests with a valid admin token. The token comes from `/api/auth` after a correct password, is signed with HMAC-SHA256, expires after 7 days, and is sent in the `x-admin-token` header.

## Project structure

```
api/      Serverless functions: TMDB proxy, admin login, token verification and Supabase writes
src/      React app: pages, navbar, auth hook, Supabase client and school project data
public/   Static files: favicon and project screenshots
```

## Running locally

Create a `.env.local` file with these variables:

```
TMDB_API_KEY
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY
ADMIN_PASSWORD
ADMIN_TOKEN_SECRET
```

Then install and start the dev server with the Vercel CLI:

```
npm install
vercel dev
```

Use `vercel dev`, not `npm run dev`. The functions in `api/` only run under the Vercel CLI, so Movie Tinder, Catalogue and login will not work with plain Vite. The site runs on `http://localhost:3000`.

## Known limitations and next steps

- TMDB responses are not cached. The Catalogue fetches details for every movie on the page in parallel, which can hit TMDB's rate limit.
- The plan is a separate backend in Kotlin that caches TMDB data in a database, so each movie is only fetched from TMDB once.
