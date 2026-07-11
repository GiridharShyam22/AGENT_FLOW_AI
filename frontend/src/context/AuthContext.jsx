import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('agentflow_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (res.ok) {
          const data = await res.json()
          setUser(data)
        } else {
          setToken(null)
          localStorage.removeItem('agentflow_token')
        }
      } catch (err) {
        console.error("Failed to fetch user", err)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [token])

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.detail || 'Invalid email or password.')
    }
    
    setToken(data.access_token)
    localStorage.setItem('agentflow_token', data.access_token)
    setUser(data.user)
    return data.user
  }

  const register = async (name, email, password) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.detail || 'An error occurred during registration.')
    }
    
    // Auto-login after registration
    return await login(email, password)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('agentflow_token')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
