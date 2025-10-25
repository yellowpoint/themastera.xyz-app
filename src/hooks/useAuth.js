import { useState, useEffect, createContext, useContext } from 'react'
import { createAuthClient } from "better-auth/react"

const AuthContext = createContext({})

// Better Auth 客户端配置
const auth = createAuthClient({
  // baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 获取初始会话
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

    // 监听认证状态变化
    const unsubscribe = auth.onSessionChange((session) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const signUp = async (email, password, additionalData = {}) => {
    try {
      const result = await auth.signUp.email({
        email,
        password,
        name: additionalData.name,
        image: additionalData.image, // 支持头像URL
        callbackURL: additionalData.callbackURL, // 支持回调URL
        ...additionalData
      })

      if (result.error) {
        return { error: result.error }
      }

      // 注册成功后如果有会话，立即更新用户状态
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
        rememberMe: options.rememberMe !== false, // 默认为 true
      })

      if (result.error) {
        return { error: result.error }
      }

      // 登录成功后立即获取最新的会话信息
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
            // 清理本地状态
            setUser(null)
            setLoading(false)
            // 如果提供了成功回调，执行它
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