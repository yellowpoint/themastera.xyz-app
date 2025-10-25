import { useState, useEffect, createContext, useContext } from 'react'
import { createAuthClient } from "better-auth/react"

const AuthContext = createContext({})

// Better Auth client configuration
const auth = createAuthClient()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const session = await auth.getSession()
        setUser(session?.data?.user || null)
      } catch (error) {
        console.error('Error getting initial session:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // // Listen for authentication state changes
    // const unsubscribe = auth.onSessionChange((session) => {
    //   setUser(session?.user || null)
    //   setLoading(false)
    // })

    // return () => {
    //   if (unsubscribe) unsubscribe()
    // }
  }, [])

  const signUp = async (email, password, additionalData = {}) => {
    try {
      const result = await auth.signUp.email({
        email,
        password,
        name: additionalData.name,
        image: additionalData.image, // Support avatar URL
        callbackURL: additionalData.callbackURL, // Support callback URL
        ...additionalData
      })

      if (result.error) {
        return { error: result.error }
      }

      // If there is a session after successful registration, update the user status immediately
      if (result.data?.session) {
        try {
          const session = await auth.getSession()
          setUser(session?.data?.user || null)
        } catch (sessionError) {
          console.error('Error getting session after signup:', sessionError)
        }
      }

      return { data: result.data }
    } catch (error) {
      return { error: { message: error.message } }
    }
  }

  const signIn = async (email, password, options = {}) => {
    try {
      const result = await auth.signIn.email({
        email,
        password,
        callbackURL: options.callbackURL,
        rememberMe: options.rememberMe !== false, // Defaults to true
      })

      if (result.error) {
        return { error: result.error }
      }

      // Immediately fetch the latest session information after successful login
      if (result.data) {
        try {
          const session = await auth.getSession()
          setUser(session?.data?.user || null)
        } catch (sessionError) {
          console.error('Error getting session after login:', sessionError)
        }
      }

      return { data: result.data?.user }
    } catch (error) {
      return { error: { message: error.message } }
    }
  }

  const signOut = async (options = {}) => {
    try {
      await auth.signOut({
        fetchOptions: {
          onSuccess: () => {
            // Clean up local state
            setUser(null)
            setLoading(false)
            // If a success callback is provided, execute it
            if (options.onSuccess) {
              options.onSuccess()
            }
          },
        },
      })
      return { error: null }
    } catch (error) {
      return { error: { message: error.message } }
    }
  }

  const resetPassword = async (email) => {
    try {
      const result = await auth.forgetPassword({
        email,
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (result.error) {
        return { error: result.error }
      }

      return { data: result.data }
    } catch (error) {
      return { error: { message: error.message } }
    }
  }

  const updateProfile = async (updates) => {
    try {
      const result = await auth.updateUser(updates)

      if (result.error) {
        return { error: result.error }
      }

      return { data: result.data }
    } catch (error) {
      return { error: { message: error.message } }
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}