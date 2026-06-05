import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

describe('useReducedMotion', () => {
  let matchMediaMock: ReturnType<typeof vi.fn>
  let listeners: Array<(event: MediaQueryListEvent) => void> = []

  beforeEach(() => {
    listeners = []
    
    matchMediaMock = vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((event: string, handler: (event: MediaQueryListEvent) => void) => {
        if (event === 'change') {
          listeners.push(handler)
        }
      }),
      removeEventListener: vi.fn((event: string, handler: (event: MediaQueryListEvent) => void) => {
        if (event === 'change') {
          listeners = listeners.filter((l) => l !== handler)
        }
      }),
      dispatchEvent: vi.fn(),
    }))

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: matchMediaMock,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return false when reduced motion is not preferred', () => {
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })

  it('should return true when reduced motion is preferred', () => {
    matchMediaMock.mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })

    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(true)
  })

  it('should query the correct media query', () => {
    renderHook(() => useReducedMotion())
    expect(matchMediaMock).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
  })

  it('should update when media query changes', async () => {
    const { result } = renderHook(() => useReducedMotion())
    
    expect(result.current).toBe(false)

    // Simulate media query change
    const changeEvent = new Event('change') as MediaQueryListEvent
    Object.defineProperty(changeEvent, 'matches', { value: true })
    
    listeners.forEach((listener) => listener(changeEvent))

    await waitFor(() => {
      expect(result.current).toBe(true)
    })
  })

  it('should handle missing matchMedia gracefully', () => {
    // @ts-expect-error - Testing undefined matchMedia
    delete window.matchMedia

    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })

  it('should clean up event listener on unmount', () => {
    const removeEventListener = vi.fn()
    matchMediaMock.mockReturnValue({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener,
      dispatchEvent: vi.fn(),
    })

    const { unmount } = renderHook(() => useReducedMotion())
    unmount()

    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('should use fallback for older browsers without addEventListener', () => {
    const addListener = vi.fn()
    const removeListener = vi.fn()
    
    matchMediaMock.mockReturnValue({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener,
      removeListener,
      addEventListener: undefined,
      removeEventListener: undefined,
      dispatchEvent: vi.fn(),
    })

    const { unmount } = renderHook(() => useReducedMotion())
    
    expect(addListener).toHaveBeenCalledWith(expect.any(Function))
    
    unmount()
    
    expect(removeListener).toHaveBeenCalledWith(expect.any(Function))
  })
})
