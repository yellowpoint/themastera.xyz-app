'use client'

import { reportError } from '@/lib/error-reporting'
import { createAuthClient } from 'better-auth/react'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type FC,
  type ReactNode,
} from 'react'

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
  signInWithGoogle: (options?: { callbackURL?: string }) => Promise<any>
  signOut: (options?: any) => Promise<any>
  resetPassword: (email: string) => Promise<any>
  updateProfile: (updates: any) => Promise<any>
  refreshUser: () => Promise<void>
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
        reportError('getInitialSession', error)
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
        reportError('signUp', result.error, params)
        return { error: result.error }
      }
      if (result.data?.session) {
        try {
          const session: any = await auth.getSession()
          setUser(session?.data?.user || null)
        } catch (sessionError) {
          reportError('signUp_session', sessionError, params)
        }
      }
      return { data: result.data }
    } catch (error: any) {
      reportError('signUp_exception', error, params)
      return { error: { message: error.message } }
    }
  }

  const signIn = async (params: any) => {
    try {
      const result: any = await auth.signIn.email(params)
      if (result.error) {
        reportError('signIn', result.error, params)
        return { error: result.error }
      }
      if (result.data) {
        try {
          const session: any = await auth.getSession()
          setUser(session?.data?.user || null)
        } catch (sessionError) {
          reportError('signIn_session', sessionError, params)
        }
      }
      return { data: result.data?.user }
    } catch (error: any) {
      reportError('signIn_exception', error, params)
      return { error: { message: error.message } }
    }
  }

  const signInWithGoogle = async (options?: { callbackURL?: string }) => {
    try {
      const result: any = await auth.signIn.social({
        provider: 'google',
        callbackURL: options?.callbackURL ?? '/',
      })
      return { data: result?.data }
    } catch (error: any) {
      reportError('signInWithGoogle_exception', error, options)
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
      reportError('signOut_exception', error, options)
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
        reportError('resetPassword', result.error, { email })
        return { error: result.error }
      }
      return { data: result.data }
    } catch (error: any) {
      reportError('resetPassword_exception', error, { email })
      return { error: { message: error.message } }
    }
  }

  const updateProfile = async (updates: any) => {
    try {
      const result: any = await auth.updateUser(updates)
      if (result.error) {
        reportError('updateProfile', result.error, updates)
        return { error: result.error }
      }
      return { data: result.data }
    } catch (error: any) {
      reportError('updateProfile_exception', error, updates)
      return { error: { message: error.message } }
    }
  }

  const refreshUser = async () => {
    try {
      const session: any = await auth.getSession()
      setUser(session?.data?.user || null)
    } catch (error) {
      reportError('refreshUser', error)
    }
  }

  const value: AuthContextValue = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    refreshUser,
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
