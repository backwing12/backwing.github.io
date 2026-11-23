# Changelog

All notable changes to backwing.dev are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
The site has no versioned releases, so entries are grouped by date.

## [Unreleased]

## 2026-11-21
### Added
- Scheduled GitHub Actions workflow that keeps the Supabase project from pausing on the free plan, and takes a weekly encrypted backup of the database. Restore has been tested.

## 2026-10-20
### Changed
- School projects now link to archived demos, since the original live versions were made private.

### Fixed
- TMDB errors are shown to the user instead of failing silently.
- The Catalogue limits concurrent TMDB requests to avoid rate limiting.

## 2026-10-14
### Added
- Project README.

## 2026-10-08
### Added
- Pages for school projects (WEB1100, PRO1000, APP2000) at `/school/:slug`, with screenshot, description, semester, tech stack, group size and a link to the live version.
- Wayback Machine snapshots of each school project, kept as a fallback if the live versions go down.
- Home page split into personal projects and school projects.
- Error message in Movie Tinder when saving a movie fails, and a clear response when the movie is already in the watched list.

### Changed
- Load DM Sans from Google Fonts, so the font set in August is actually used.
- Deleting in the Catalogue now requires being logged in as admin.

### Fixed
- Catalogue requests to TMDB had a malformed query string (`?language` instead of `&language`).
- Expired or old admin tokens are cleared, so the site no longer shows you as logged in when you are not.
- Static files in `public/` (screenshots, icons) are no longer caught by the rewrite in `vercel.json`.
- A missing screenshot hides its frame instead of showing a broken image.

### Security
- Admin tokens are now HMAC-signed with an expiry date. Previously the token contained the server secret itself.
- Password and signature checks use a constant-time comparison.

## 2026-08-10
### Changed
- Switched the site font from Inter to DM Sans.
- Updated Vite to 8.1.

### Fixed
- Local development with `vercel dev` on Windows: the rewrites in `vercel.json` now skip Vite's internal paths and the API routes, and the Vite dev server runs on port 3000.

## 2026-06-16
### Added
- Admin authentication with token-protected writes.
- Tabler icons.

### Fixed
- Movie Tinder: duplicate movies, filters not updating, and movies rejected with "no" showing up again.
- Direct URLs to subpages no longer return 404.

## 2026-06-13
### Added
- Minesweeper.
- Movie Tinder with TMDB, backed by Supabase.
- Custom site icon.

## 2026-06-12
### Added
- Initial site with home page and navbar (React + Vite, hosted on Vercel).
