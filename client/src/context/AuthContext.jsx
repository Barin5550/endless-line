import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.get(`${import.meta.env.VITE_API_URL}/auth/me`)
        .then(res => setUser(res.data))
        .catch(() => { logout() })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = (userData, tokenValue) => {
    localStorage.setItem('token', tokenValue)
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenValue}`
    setToken(tokenValue)
    setUser(userData)
  }

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
  }, [])

  const updateUser = (data) => {
    setUser(prev => ({ ...prev, ...data }))
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
