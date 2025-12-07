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

  /**
   * Helper for consistent error handling and reporting
   */
  const safeAuthCall = async <T = any,>(
    action: string,
    promise: Promise<any>,
    params?: any
  ): Promise<{ data?: T; error?: any }> => {
    try {
      const result = await promise
      if (result?.error) {
        reportError(action, result.error, params)
        return { error: result.error }
      }
      return { data: result?.data }
    } catch (error: any) {
      reportError(`${action}_exception`, error, params)
      return { error: { message: error.message || 'Unknown error' } }
    }
  }

  /**
   * Helper to refresh session state
   */
  const refreshSession = async (
    errorContext: string = 'refreshSession',
    params?: any
  ) => {
    try {
      const session: any = await auth.getSession()
      setUser(session?.data?.user || null)
    } catch (error) {
      reportError(errorContext, error, params)
    }
  }

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        await refreshSession('getInitialSession')
      } finally {
        setLoading(false)
      }
    }
    getInitialSession()
  }, [])

  const signUp = async (params: any) => {
    const { data, error } = await safeAuthCall(
      'signUp',
      auth.signUp.email(params),
      params
    )

    if (error) return { error }

    if (data?.session) {
      await refreshSession('signUp_session', params)
    }
    return { data }
  }

  const signIn = async (params: any) => {
    const { data, error } = await safeAuthCall(
      'signIn',
      auth.signIn.email(params),
      params
    )

    if (error) return { error }

    if (data) {
      await refreshSession('signIn_session', params)
    }
    return { data: data?.user }
  }

  const signInWithGoogle = async (options?: { callbackURL?: string }) => {
    return safeAuthCall(
      'signInWithGoogle',
      auth.signIn.social({
        provider: 'google',
        callbackURL: options?.callbackURL ?? '/',
      }),
      options
    )
  }

  const signOut = async (options: any = {}) => {
    const { error } = await safeAuthCall(
      'signOut',
      auth.signOut({
        fetchOptions: {
          onSuccess: () => {
            setUser(null)
            setLoading(false)
            if (options.onSuccess) {
              options.onSuccess()
            }
          },
        },
      }),
      options
    )
    return { error }
  }

  const resetPassword = async (email: string) => {
    return safeAuthCall(
      'resetPassword',
      auth.forgetPassword({
        email,
        redirectTo: `${window.location.origin}/auth/reset-password`,
      }),
      { email }
    )
  }

  const updateProfile = async (updates: any) => {
    return safeAuthCall('updateProfile', auth.updateUser(updates), updates)
  }

  const refreshUser = async () => {
    await refreshSession('refreshUser')
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
