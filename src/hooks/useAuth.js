import { useState, useEffect } from 'react'

const TOKEN_KEY = 'admin_token'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) setIsAuthenticated(true)
  }, [])

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

  const getToken = () => localStorage.getItem(TOKEN_KEY)

  return { isAuthenticated, login, logout, getToken }
}