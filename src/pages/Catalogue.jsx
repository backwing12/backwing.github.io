import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const PAGE_SIZE = 20

function Catalogue() {
  const { isAuthenticated, getToken } = useAuth()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [notice, setNotice] = useState(null) // { message: string }

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true)

      const { data, error, count } = await supabase
        .from('watched_movies')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

      if (error) { console.error(error); setLoading(false); return }

      setTotal(count)

      const movieDetails = await Promise.all(
        data.map(async (entry) => {
          const res = await fetch(`/api/movie?endpoint=movie/${entry.tmdb_id}&language=en-US`)
          const details = await res.json()
          return { ...details, dbId: entry.id, tmdb_id: entry.tmdb_id, rating: entry.rating, review: entry.review, created_at: entry.created_at }
        })
      )

      setMovies(movieDetails)
      setLoading(false)
    }

    fetchMovies()
  }, [page])

  const handleDelete = async (dbId) => {
    if (!window.confirm('Remove this movie from your watched list?')) return

    if (!isAuthenticated) {
      setNotice({ message: "You're not logged in. Nothing was deleted." })
      return
    }

    try {
      const res = await fetch('/api/watched', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': getToken(),
        },
        body: JSON.stringify({ id: dbId }),
      })

      if (res.status === 401) {
        setNotice({ message: "You're not logged in. Nothing was deleted." })
        return
      }

      if (!res.ok) {
        setNotice({ message: 'Something went wrong. The movie was not deleted.' })
        return
      }

      setMovies(movies.filter(m => m.dbId !== dbId))
      setTotal(t => t - 1)
    } catch (err) {
      console.error(err)
      setNotice({ message: 'Network error. The movie was not deleted.' })
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 500, marginBottom: '0.25rem' }}>Catalogue</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '2rem' }}>
        {total} movies watched.
      </p>

      {notice && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--bg-surface)',
            border: '0.5px solid #E24B4A',
            color: '#E24B4A',
            padding: '0.75rem 1.25rem',
            borderRadius: '8px',
            fontSize: '13px',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          {notice.message}
          <button
            onClick={() => setNotice(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#E24B4A',
              cursor: 'pointer',
              marginLeft: '1rem',
              fontSize: '13px',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {loading && <p style={{ color: 'var(--text-muted)' }}>Loading...</p>}

      {!loading && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {movies.map(movie => (
              <div key={movie.id} style={{
                display: 'flex', alignItems: 'center',
                padding: '0.75rem 1.25rem',
                background: 'var(--bg-surface)',
                border: '0.5px solid var(--bg-border)',
                borderRadius: '8px',
                gap: '1rem',
              }}>
                <img
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.title}
                  style={{ width: '36px', height: '54px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>{movie.title}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '0.75rem' }}>
                    {movie.release_date?.slice(0, 4)}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {movie.genres?.map(g => g.name).join(', ')}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {movie.runtime ? `${movie.runtime}m` : '—'}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {movie.rating ? `${movie.rating}/10` : '—'}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {new Date(movie.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <button
                    onClick={() => handleDelete(movie.dbId)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      padding: '0',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#E24B4A'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 0}
                style={{
                  padding: '0.4rem 1rem', fontSize: '13px', borderRadius: '6px', cursor: page === 0 ? 'default' : 'pointer',
                  background: 'transparent', border: '0.5px solid var(--bg-border)',
                  color: page === 0 ? 'var(--bg-border)' : 'var(--text-muted)',
                }}
              >
                Previous
              </button>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page === totalPages - 1}
                style={{
                  padding: '0.4rem 1rem', fontSize: '13px', borderRadius: '6px', cursor: page === totalPages - 1 ? 'default' : 'pointer',
                  background: 'transparent', border: '0.5px solid var(--bg-border)',
                  color: page === totalPages - 1 ? 'var(--bg-border)' : 'var(--text-muted)',
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}

export default Catalogue