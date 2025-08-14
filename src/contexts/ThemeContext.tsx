import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark'

// Theme color definitions
const lightTheme = {
  '--bg-primary': '#ffffff',
  '--bg-secondary': '#f8fafc',
  '--bg-tertiary': '#f1f5f9',
  '--text-primary': '#1e293b',
  '--text-secondary': '#475569',
  '--text-tertiary': '#64748b',
  '--border-primary': '#e2e8f0',
  '--border-secondary': '#cbd5e1',
  '--card-bg': '#ffffff',
  '--card-border': '#e2e8f0',
  '--primary-500': '#3b82f6',
  '--primary-600': '#2563eb',
  '--accent-500': '#8b5cf6',
  '--accent-600': '#7c3aed',
  '--success-500': '#10b981',
  '--error-500': '#ef4444',
  '--warning-500': '#f59e0b',
}

const darkTheme = {
  '--bg-primary': '#0f172a',
  '--bg-secondary': '#1e293b',
  '--bg-tertiary': '#334155',
  '--text-primary': '#f8fafc',
  '--text-secondary': '#e2e8f0',
  '--text-tertiary': '#cbd5e1',
  '--border-primary': '#334155',
  '--border-secondary': '#475569',
  '--card-bg': 'rgba(255, 255, 255, 0.05)',
  '--card-border': 'rgba(255, 255, 255, 0.1)',
  '--primary-500': '#3b82f6',
  '--primary-600': '#2563eb',
  '--accent-500': '#8b5cf6',
  '--accent-600': '#7c3aed',
  '--success-500': '#10b981',
  '--error-500': '#ef4444',
  '--warning-500': '#f59e0b',
}

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>('dark')

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('memeMint_theme') as Theme
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setThemeState(savedTheme)
    } else {
      // Default to user's system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setThemeState(prefersDark ? 'dark' : 'light')
    }
  }, [])

  // Apply theme to document
  useEffect(() => {
    console.log('ThemeContext: Applying theme:', theme)
    const root = document.documentElement
    
    if (theme === 'light') {
      root.classList.remove('dark')
      root.classList.add('light')
      console.log('ThemeContext: Added light class, removed dark class')
    } else {
      root.classList.remove('light')
      root.classList.add('dark')
      console.log('ThemeContext: Added dark class, removed light class')
    }
    
    // Update CSS custom properties for theme
    const themeColors = theme === 'light' ? lightTheme : darkTheme
    console.log('ThemeContext: Applying theme colors:', themeColors)
    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
    console.log('ThemeContext: Theme applied successfully')
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('memeMint_theme', newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    console.log('ThemeContext: Toggling from', theme, 'to', newTheme)
    setTheme(newTheme)
  }

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
