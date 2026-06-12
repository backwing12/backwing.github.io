import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 2rem',
      borderBottom: '0.5px solid var(--bg-border)',
      position: 'sticky',
      top: 0,
      backgroundColor: 'var(--bg-primary)',
      zIndex: 100,
    }}>
      <Link to="/" style={{ fontSize: '15px', fontWeight: 500, letterSpacing: '0.05em' }}>
        Backwing
      </Link>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {[
          { label: 'Movies', path: '/movies' },
          { label: 'Minesweeper', path: '/minesweeper' },
        ].map(({ label, path }) => (
          <Link
            key={path}
            to={path}
            style={{
              fontSize: '13px',
              color: location.pathname === path ? 'var(--text-primary)' : 'var(--text-muted)',
            }}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default Navbar