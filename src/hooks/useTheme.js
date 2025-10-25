'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

// Function to get initial theme
function getInitialTheme() {
  if (typeof window === 'undefined') {
    return 'dark' // Default value for server-side rendering
  }
  
  // Read theme setting from localStorage
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
    return savedTheme
  }
  
  // Default to dark mode, no longer checking system preference
  return 'dark'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Ensure theme is correctly applied to DOM
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
    
    // Remove previous theme class
    root.classList.remove('light', 'dark')
    
    // Add new theme class
    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.add(systemPrefersDark ? 'dark' : 'light')
    } else {
      root.classList.add(theme)
    }

    // Save to localStorage
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