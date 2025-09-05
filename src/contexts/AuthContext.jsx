import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, signUp as supabaseSignUp, signIn as supabaseSignIn, signOut as supabaseSignOut, updateUserProfile } from '../lib/supabase.js'

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
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password) => {
    const { user } = await supabaseSignUp(email, password)
    return user
  }

  const signIn = async (email, password) => {
    const { user } = await supabaseSignIn(email, password)
    return user
  }

  const signOut = async () => {
    await supabaseSignOut()
    setUser(null)
  }

  const updateProfile = async (updates) => {
    const { user: updatedUser } = await updateUserProfile(updates)
    setUser(updatedUser)
    return updatedUser
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
