'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

// 获取初始主题的函数
function getInitialTheme() {
  if (typeof window === 'undefined') {
    return 'dark' // 服务端渲染时的默认值
  }
  
  // 从localStorage读取保存的主题设置
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
    return savedTheme
  }
  
  // 如果没有保存的主题，检查系统偏好
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return systemPrefersDark ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // 确保主题正确应用到DOM
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    
    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.add(systemPrefersDark ? 'dark' : 'light')
    } else {
      root.classList.add(theme)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    
    // 移除之前的主题类
    root.classList.remove('light', 'dark')
    
    // 添加新的主题类
    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.add(systemPrefersDark ? 'dark' : 'light')
    } else {
      root.classList.add(theme)
    }

    // 保存到localStorage
    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prevTheme => {
      switch (prevTheme) {
        case 'light':
          return 'dark'
        case 'dark':
          return 'system'
        case 'system':
          return 'light'
        default:
          return 'dark'
      }
    })
  }

  const setSpecificTheme = (newTheme) => {
    if (['light', 'dark', 'system'].includes(newTheme)) {
      setTheme(newTheme)
    }
  }

  const value = {
    theme,
    toggleTheme,
    setTheme: setSpecificTheme,
    mounted
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}