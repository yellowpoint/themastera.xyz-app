"use client"

import { useState, useEffect, createContext, useContext, type FC, type ReactNode } from 'react'
import { createAuthClient } from 'better-auth/react'

export interface AuthUser {
  id: string
  name: string
  email: string
  image?: string | null
  level?: string
  points?: number
  earnings?: number
}

export interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  signUp: (params: any) => Promise<any>
  signIn: (params: any) => Promise<any>
  signOut: (options?: any) => Promise<any>
  resetPassword: (email: string) => Promise<any>
  updateProfile: (updates: any) => Promise<any>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// Better Auth client configuration
const auth = createAuthClient()

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const session: any = await auth.getSession()
        setUser(session?.data?.user || null)
      } catch (error) {
        console.error('Error getting initial session:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    getInitialSession()
  }, [])

  const signUp = async (params: any) => {
    try {
      const result: any = await auth.signUp.email(params)
      if (result.error) {
        return { error: result.error }
      }
      if (result.data?.session) {
        try {
          const session: any = await auth.getSession()
          setUser(session?.data?.user || null)
        } catch (sessionError) {
          console.error('Error getting session after signup:', sessionError)
        }
      }
      return { data: result.data }
    } catch (error: any) {
      return { error: { message: error.message } }
    }
  }

  const signIn = async (params: any) => {
    try {
      const result: any = await auth.signIn.email(params)
      if (result.error) {
        return { error: result.error }
      }
      if (result.data) {
        try {
          const session: any = await auth.getSession()
          setUser(session?.data?.user || null)
        } catch (sessionError) {
          console.error('Error getting session after login:', sessionError)
        }
      }
      return { data: result.data?.user }
    } catch (error: any) {
      return { error: { message: error.message } }
    }
  }

  const signOut = async (options: any = {}) => {
    try {
      await auth.signOut({
        fetchOptions: {
          onSuccess: () => {
            setUser(null)
            setLoading(false)
            if (options.onSuccess) {
              options.onSuccess()
            }
          },
        },
      })
      return { error: null }
    } catch (error: any) {
      return { error: { message: error.message } }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const result: any = await auth.forgetPassword({
        email,
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (result.error) {
        return { error: result.error }
      }
      return { data: result.data }
    } catch (error: any) {
      return { error: { message: error.message } }
    }
  }

  const updateProfile = async (updates: any) => {
    try {
      const result: any = await auth.updateUser(updates)
      if (result.error) {
        return { error: result.error }
      }
      return { data: result.data }
    } catch (error: any) {
      return { error: { message: error.message } }
    }
  }

  const value: AuthContextValue = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  }

  if (loading) {
    return null
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}