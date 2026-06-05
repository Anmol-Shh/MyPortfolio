/**
 * Unit tests for useTheme hook
 * Validates: Requirements 10.1, 10.4, 10.5
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme, readStoredTheme, storeTheme, initTheme } from '../../hooks/useTheme'

/** Helper to mock window.matchMedia with a given `matches` value. */
function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string): MediaQueryList => ({
      matches,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    // Default: no OS light preference
    mockMatchMedia(false)
  })

  afterEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    vi.restoreAllMocks()
  })

  describe('initTheme', () => {
    it('returns stored theme when available', () => {
      expect(initTheme('dark')).toBe('dark')
      expect(initTheme('light')).toBe('light')
    })

    it('returns dark when stored is null and no OS preference', () => {
      mockMatchMedia(false)
      expect(initTheme(null)).toBe('dark')
    })

    it('returns light when stored is null and OS prefers light', () => {
      mockMatchMedia(true)
      expect(initTheme(null)).toBe('light')
    })
  })

  describe('readStoredTheme / storeTheme', () => {
    it('returns null when nothing is stored', () => {
      expect(readStoredTheme()).toBeNull()
    })

    it('returns stored theme after storeTheme is called', () => {
      storeTheme('dark')
      expect(readStoredTheme()).toBe('dark')
      storeTheme('light')
      expect(readStoredTheme()).toBe('light')
    })

    it('returns null when localStorage throws SecurityError', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new DOMException('SecurityError')
      })
      expect(readStoredTheme()).toBeNull()
    })

    it('storeTheme silently ignores SecurityError', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('SecurityError')
      })
      expect(() => storeTheme('dark')).not.toThrow()
    })
  })

  describe('useTheme hook', () => {
    it('defaults to dark when no stored preference and no OS preference', () => {
      mockMatchMedia(false)
      const { result } = renderHook(() => useTheme())
      expect(result.current.theme).toBe('dark')
    })

    it('defaults to light when OS prefers light and no stored preference', () => {
      mockMatchMedia(true)
      const { result } = renderHook(() => useTheme())
      expect(result.current.theme).toBe('light')
    })

    it('restores stored theme from localStorage', () => {
      localStorage.setItem('portfolio-theme', 'light')
      const { result } = renderHook(() => useTheme())
      expect(result.current.theme).toBe('light')
    })

    it('toggles theme from dark to light', () => {
      localStorage.setItem('portfolio-theme', 'dark')
      const { result } = renderHook(() => useTheme())
      expect(result.current.theme).toBe('dark')

      act(() => {
        result.current.toggle()
      })

      expect(result.current.theme).toBe('light')
    })

    it('toggles theme from light to dark', () => {
      localStorage.setItem('portfolio-theme', 'light')
      const { result } = renderHook(() => useTheme())

      act(() => {
        result.current.toggle()
      })

      expect(result.current.theme).toBe('dark')
    })

    it('persists toggled theme to localStorage', () => {
      localStorage.setItem('portfolio-theme', 'dark')
      const { result } = renderHook(() => useTheme())

      act(() => {
        result.current.toggle()
      })

      expect(localStorage.getItem('portfolio-theme')).toBe('light')
    })

    it('applies dark class to <html> when theme is dark', () => {
      localStorage.setItem('portfolio-theme', 'dark')
      renderHook(() => useTheme())
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('removes dark class from <html> when theme is light', () => {
      document.documentElement.classList.add('dark')
      localStorage.setItem('portfolio-theme', 'light')
      renderHook(() => useTheme())
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('falls back gracefully when localStorage is unavailable', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new DOMException('SecurityError')
      })
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('SecurityError')
      })
      mockMatchMedia(false)

      const { result } = renderHook(() => useTheme())
      expect(result.current.theme).toBe('dark')

      // Toggle should still work even without persistence
      act(() => {
        result.current.toggle()
      })
      expect(result.current.theme).toBe('light')
    })
  })
})
