import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [localUser, setLocalUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 同步用户到本地数据库
  const syncUserToLocal = async (supabaseUser) => {
    if (!supabaseUser) {
      setLocalUser(null)
      return null
    }

    try {
      const response = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: supabaseUser.id,
          email: supabaseUser.email,
          name: supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name,
          avatar: supabaseUser.user_metadata?.avatar_url
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setLocalUser(result.data)
          return result.data
        }
      }
    } catch (error) {
      console.error('Error syncing user to local database:', error)
    }
    
    return null
  }

  useEffect(() => {
    // 获取初始会话
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const supabaseUser = session?.user ?? null
      setUser(supabaseUser)
      
      if (supabaseUser) {
        await syncUserToLocal(supabaseUser)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const supabaseUser = session?.user ?? null
        setUser(supabaseUser)
        
        if (supabaseUser) {
          await syncUserToLocal(supabaseUser)
        } else {
          setLocalUser(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  }

  const updateProfile = async (updates) => {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    })
    return { data, error }
  }

  const value = {
    user, // Supabase Auth用户
    localUser, // 本地数据库用户
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    syncUserToLocal
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