import { useState } from 'react'

const TOKEN_KEY = 'admin_token'

// Reads the expiry from the token payload. The server still verifies the signature;
// this only keeps the UI from showing "logged in" with an expired or old-format token.
function getValidToken() {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return null
  try {
    const payload = token.split('.')[0].replace(/-/g, '+').replace(/_/g, '/')
    const { exp } = JSON.parse(atob(payload))
    if (typeof exp === 'number' && Date.now() < exp) return token
  } catch {
    // malformed or old-format token, fall through
  }
  localStorage.removeItem(TOKEN_KEY)
  return null
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => getValidToken() !== null)

  const login = async (password) => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const data = await res.json()
    if (res.ok) {
      localStorage.setItem(TOKEN_KEY, data.token)
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setIsAuthenticated(false)
  }

  const getToken = () => getValidToken()

  return { isAuthenticated, login, logout, getToken }
}
