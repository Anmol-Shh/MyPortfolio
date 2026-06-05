import { useState, useEffect, useCallback } from 'react'
import type { Theme, ThemeState } from '../types'

const STORAGE_KEY = 'portfolio-theme'

/** Read the stored theme from localStorage. Returns null if unavailable. */
export function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') return stored
    return null
  } catch {
    // SecurityError in private browsing
    return null
  }
}

/** Persist a theme value to localStorage. Silently ignores SecurityError. */
export function storeTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // SecurityError — ignore
  }
}

/** Initialise theme: stored preference → OS preference → dark fallback. */
export function initTheme(stored: Theme | null): Theme {
  if (stored !== null) return stored
  try {
    if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light'
  } catch {
    // matchMedia unavailable (e.g. SSR / test env without mock)
  }
  return 'dark'
}

/** Apply or remove the `dark` class on the <html> element. */
function applyTheme(theme: Theme): void {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function useTheme(): ThemeState {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = readStoredTheme()
    const resolved = initTheme(stored)
    applyTheme(resolved)
    return resolved
  })

  useEffect(() => {
    applyTheme(theme)
    storeTheme(theme)
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggle }
}
