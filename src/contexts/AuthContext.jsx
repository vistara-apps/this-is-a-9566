import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing user session
    const userData = localStorage.getItem('miraid_user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const signUp = async (email, password) => {
    // Mock sign up - in real app, use Supabase
    const newUser = {
      id: Date.now().toString(),
      email,
      subscriptionStatus: 'free',
      preferredLanguage: 'en',
      createdAt: new Date().toISOString()
    }
    setUser(newUser)
    localStorage.setItem('miraid_user', JSON.stringify(newUser))
    return newUser
  }

  const signIn = async (email, password) => {
    // Mock sign in - in real app, use Supabase
    const mockUser = {
      id: Date.now().toString(),
      email,
      subscriptionStatus: 'free',
      preferredLanguage: 'en',
      createdAt: new Date().toISOString()
    }
    setUser(mockUser)
    localStorage.setItem('miraid_user', JSON.stringify(mockUser))
    return mockUser
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('miraid_user')
  }

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('miraid_user', JSON.stringify(updatedUser))
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}