import { Link } from 'react-router-dom'

const projects = [
  {
    label: 'Movies',
    path: '/movies',
    icon: '🎬',
    desc: 'track, rate & discover films',
  },
  {
    label: 'Minesweeper',
    path: '/minesweeper',
    icon: '💣',
    desc: 'the classic grid game',
  },
]

function Home() {
  return (
    <main style={{ maxWidth: '680px', margin: '0 auto', padding: '4rem 2rem' }}>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
        Personal projects
      </p>
      <h1 style={{ fontSize: '28px', fontWeight: 500, lineHeight: 1.2, marginBottom: '1rem' }}>
        Things built by <span style={{ color: 'var(--accent)' }}>backwing</span>
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '420px' }}>
        A small collection of projects — a movie catalogue, and a minesweeper game.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {projects.map(({ label, path, icon, desc }) => (
          <Link
            key={path}
            to={path}
            style={{
              background: 'var(--bg-surface)',
              border: '0.5px solid var(--bg-border)',
              borderRadius: '8px',
              padding: '1rem',
              display: 'block',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--bg-border)'}
          >
            <div style={{ fontSize: '20px', marginBottom: '0.5rem' }}>{icon}</div>
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '0.25rem' }}>{label}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{desc}</div>
          </Link>
        ))}
      </div>
    </main>
  )
}

export default Home