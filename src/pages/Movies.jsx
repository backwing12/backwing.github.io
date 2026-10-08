import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const GENRES = [
  { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' }, { id: 80, name: 'Crime' }, { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' }, { id: 10751, name: 'Family' }, { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' }, { id: 27, name: 'Horror' }, { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' }, { id: 10749, name: 'Romance' }, { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' }, { id: 10752, name: 'War' }, { id: 37, name: 'Western' },
]

const LANGUAGES = [
  { code: 'en', name: 'English' }, { code: 'fr', name: 'French' }, { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' }, { code: 'it', name: 'Italian' }, { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' }, { code: 'zh', name: 'Chinese' }, { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' }, { code: 'no', name: 'Norwegian' },
]

const DECADES = [
  { label: 'Any', from: '', to: '' },
  { label: 'Pre-1970', from: '1900-01-01', to: '1969-12-31' },
  { label: '1970s', from: '1970-01-01', to: '1979-12-31' },
  { label: '1980s', from: '1980-01-01', to: '1989-12-31' },
  { label: '1990s', from: '1990-01-01', to: '1999-12-31' },
  { label: '2000s', from: '2000-01-01', to: '2009-12-31' },
  { label: '2010s', from: '2010-01-01', to: '2019-12-31' },
  { label: '2020s', from: '2020-01-01', to: '2029-12-31' },
]

function Movies() {
  const { isAuthenticated, getToken } = useAuth()

  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [selectedGenres, setSelectedGenres] = useState([])
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [selectedDecade, setSelectedDecade] = useState(DECADES[0])
  const [minVotes, setMinVotes] = useState(100)
  const [minRating, setMinRating] = useState(0)

  const [watchedIds, setWatchedIds] = useState(new Set())
  const watchedIdsRef = useRef(new Set())
  const [watchedLoaded, setWatchedLoaded] = useState(false)
  const skippedIdsRef = useRef(new Set())
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    const fetchWatched = async () => {
      const { data } = await supabase.from('watched_movies').select('tmdb_id')
      if (data) {
        const ids = new Set(data.map(m => m.tmdb_id))
        setWatchedIds(ids)
        watchedIdsRef.current = ids
      }
      setWatchedLoaded(true)
    }
    fetchWatched()
  }, [])

  const buildQueryParams = (page = null) => {
    const params = new URLSearchParams()
    params.set('endpoint', 'discover/movie')
    params.set('language', 'en-US')
    params.set('sort_by', 'vote_count.desc')
    params.set('page', page ?? Math.floor(Math.random() * 300) + 1)
    params.set('vote_count.gte', minVotes)
    if (selectedLanguage) params.set('with_original_language', selectedLanguage)
    if (selectedGenres.length > 0) params.set('with_genres', selectedGenres.join(','))
    if (selectedDecade.from) {
      params.set('primary_release_date.gte', selectedDecade.from)
      params.set('primary_release_date.lte', selectedDecade.to)
    }
    if (minRating > 0) params.set('vote_average.gte', minRating)
    return params.toString()
  }

  const fetchRandomMovie = async () => {
    setLoading(true)
    setSaveError(null)
    
    // First fetch page 1 to get total pages
    const firstRes = await fetch(`/api/movie?${buildQueryParams(1)}`)
    const firstData = await firstRes.json()
    
    if (!firstData.results || firstData.results.length === 0) {
      setMovie(null)
      setLoading(false)
      return
    }

    const totalPages = Math.min(firstData.total_pages, 300)
    const randomPage = Math.floor(Math.random() * totalPages) + 1

    const res = await fetch(`/api/movie?${buildQueryParams(randomPage)}`)
    const data = await res.json()
    const results = data.results

    if (results && results.length > 0) {
      const unseen = results.filter(m => !watchedIdsRef.current.has(m.id) && !skippedIdsRef.current.has(m.id))
      if (unseen.length > 0) {
        setMovie(unseen[Math.floor(Math.random() * unseen.length)])
      } else {
        setMovie(null)
      }
    } else {
      setMovie(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!watchedLoaded) return
    skippedIdsRef.current = new Set()
    fetchRandomMovie()
  }, [selectedGenres, selectedLanguage, selectedDecade, minVotes, minRating, watchedLoaded])

  const toggleGenre = (id) => {
    setSelectedGenres(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>

      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '220px' : '0',
        minWidth: sidebarOpen ? '220px' : '0',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          <div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Language</p>
            <select
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value)}
              style={{ width: '100%', background: 'var(--bg-surface)', border: '0.5px solid var(--bg-border)', borderRadius: '6px', padding: '0.4rem 0.6rem', color: 'var(--text-primary)', fontSize: '13px' }}
            >
              <option value="">Any</option>
              {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
            </select>
          </div>

          <div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Decade</p>
            <select
              value={selectedDecade.label}
              onChange={e => setSelectedDecade(DECADES.find(d => d.label === e.target.value))}
              style={{ width: '100%', background: 'var(--bg-surface)', border: '0.5px solid var(--bg-border)', borderRadius: '6px', padding: '0.4rem 0.6rem', color: 'var(--text-primary)', fontSize: '13px' }}
            >
              {DECADES.map(d => <option key={d.label} value={d.label}>{d.label}</option>)}
            </select>
          </div>

          <div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Genres</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {GENRES.map(g => (
                <button
                  key={g.id}
                  onClick={() => toggleGenre(g.id)}
                  style={{
                    padding: '0.25rem 0.6rem', fontSize: '12px', borderRadius: '4px', cursor: 'pointer',
                    background: selectedGenres.includes(g.id) ? 'var(--accent)' : 'transparent',
                    border: `0.5px solid ${selectedGenres.includes(g.id) ? 'var(--accent)' : 'var(--bg-border)'}`,
                    color: selectedGenres.includes(g.id) ? '#fff' : 'var(--text-muted)',
                  }}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Min votes: {minVotes}</p>
            <input type="range" min={0} max={1000} step={50} value={minVotes}
              onChange={e => setMinVotes(Number(e.target.value))}
              style={{ width: '100%' }} />
          </div>

          <div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Min rating: {minRating > 0 ? minRating : 'Any'}</p>
            <input type="range" min={0} max={9} step={0.5} value={minRating}
              onChange={e => setMinRating(Number(e.target.value))}
              style={{ width: '100%' }} />
          </div>

        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 500 }}>Movie Tinder</h1>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{ background: 'transparent', border: '0.5px solid var(--bg-border)', borderRadius: '6px', padding: '0.25rem 0.6rem', fontSize: '12px', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            {sidebarOpen ? 'Hide filters' : 'Show filters'}
          </button>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '2rem' }}>Have you watched this movie?</p>

        {!isAuthenticated && (
          <div style={{
            padding: '0.6rem 1rem', marginBottom: '1rem', borderRadius: '6px',
            background: '#E24B4A20', border: '0.5px solid #E24B4A',
            color: '#E24B4A', fontSize: '13px'
          }}>
            Not logged in. Movies won't be saved.
          </div>
        )}

        {saveError && (
          <div style={{
            padding: '0.6rem 1rem', marginBottom: '1rem', borderRadius: '6px',
            background: '#E24B4A20', border: '0.5px solid #E24B4A',
            color: '#E24B4A', fontSize: '13px'
          }}>
            {saveError}
          </div>
        )}

        {loading && <p style={{ color: 'var(--text-muted)' }}>Loading...</p>}

        {!loading && !movie && <p style={{ color: 'var(--text-muted)' }}>No movies found with these filters. Try adjusting them.</p>}

        {!loading && movie && (
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            <img
              src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
              alt={movie.title}
              style={{ width: '200px', borderRadius: '8px', flexShrink: 0 }}
            />
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '0.25rem' }}>{movie.title}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '1rem' }}>
                {movie.release_date?.slice(0, 4)}
              </p>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#ccc', marginBottom: '2rem' }}>
                {movie.overview}
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                    onClick={() => {
                      skippedIdsRef.current.add(movie.id)
                      fetchRandomMovie()
                    }}
                    style={{
                      padding: '0.6rem 1.5rem', fontSize: '14px', borderRadius: '8px',
                      background: 'transparent', border: '0.5px solid var(--bg-border)',
                      color: 'var(--text-muted)', cursor: 'pointer'
                    }}
                >
                  No
                </button>
                <button
                  onClick={async () => {
                    if (isAuthenticated) {
                      try {
                        const res = await fetch('/api/watched', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'x-admin-token': getToken(),
                          },
                          body: JSON.stringify({ tmdb_id: movie.id }),
                        })
                        // 409 = already saved, treat as watched
                        if (!res.ok && res.status !== 409) {
                          setSaveError(res.status === 401
                            ? 'Your login has expired. Log in again to save movies.'
                            : `Could not save "${movie.title}". Try again.`)
                          return
                        }
                      } catch (err) {
                        console.error(err)
                        setSaveError(`Network error. "${movie.title}" was not saved.`)
                        return
                      }
                      setWatchedIds(prev => new Set([...prev, movie.id]))
                      watchedIdsRef.current.add(movie.id)
                    }
                    fetchRandomMovie()
                  }}
                  style={{
                    padding: '0.6rem 1.5rem', fontSize: '14px', borderRadius: '8px',
                    background: 'var(--accent)', border: 'none',
                    color: '#fff', cursor: 'pointer'
                  }}
                >
                  Yes, I watched it
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default Movies