import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

          const decodedToken = JSON.parse(atob(token.split('.')[1]))
          setCurrentUser({
            id: decodedToken.id,
            email: decodedToken.email,
            role: decodedToken.role,
          })
        } catch (error) {
          console.error('Error fetching user:', error)
          localStorage.removeItem('token')
          setToken(null)
          setCurrentUser(null)
        }
      }
      setLoading(false)
    }

    fetchUser()
  }, [token])

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password })

      setToken(res.data.token)
      setCurrentUser(res.data.user)
      localStorage.setItem('token', res.data.token)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      }
    }
  }

  const register = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData)

      setToken(res.data.token)
      setCurrentUser(res.data.user)
      localStorage.setItem('token', res.data.token)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setCurrentUser(null)
    delete axios.defaults.headers.common['Authorization']
  }

  const isAdmin = () => {
    return currentUser && currentUser.role === 'admin'
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        register,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
