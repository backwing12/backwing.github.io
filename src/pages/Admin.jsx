import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

function Admin() {
  const { isAuthenticated, login, logout } = useAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const success = await login(password)
    if (!success) setError('Incorrect password')
    setLoading(false)
    setPassword('')
  }

  return (
    <main style={{ maxWidth: '400px', margin: '0 auto', padding: '4rem 2rem' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 500, marginBottom: '0.25rem' }}>Admin</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '2rem' }}>
        {isAuthenticated ? 'You are logged in.' : 'Log in to enable write access.'}
      </p>

      {!isAuthenticated ? (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              background: 'var(--bg-surface)', border: '0.5px solid var(--bg-border)',
              borderRadius: '6px', padding: '0.6rem 1rem', color: 'var(--text-primary)',
              fontSize: '14px', outline: 'none',
            }}
          />
          {error && <p style={{ color: '#E24B4A', fontSize: '13px' }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.6rem 1rem', fontSize: '14px', borderRadius: '6px',
              background: 'var(--accent)', border: 'none', color: '#fff', cursor: 'pointer',
            }}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      ) : (
        <button
          onClick={logout}
          style={{
            padding: '0.6rem 1rem', fontSize: '14px', borderRadius: '6px',
            background: 'transparent', border: '0.5px solid var(--bg-border)',
            color: 'var(--text-muted)', cursor: 'pointer',
          }}
        >
          Log out
        </button>
      )}
    </main>
  )
}

export default Admin