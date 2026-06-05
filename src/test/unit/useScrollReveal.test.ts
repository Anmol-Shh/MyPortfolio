import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

describe('useScrollReveal', () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
      unobserve: vi.fn(),
      takeRecords: vi.fn(),
      root: null,
      rootMargin: '',
      thresholds: [],
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return a ref and initial visibility state', () => {
    const { result } = renderHook(() => useScrollReveal())
    
    expect(result.current.ref).toBeDefined()
    expect(result.current.ref.current).toBeNull()
    expect(result.current.isVisible).toBe(false)
  })

  it('should handle missing IntersectionObserver gracefully', () => {
    // @ts-expect-error - Testing undefined IntersectionObserver
    globalThis.IntersectionObserver = undefined

    const { result } = renderHook(() => useScrollReveal())
    
    // When IntersectionObserver is missing and ref is null, it returns early
    // The hook will set isVisible to true once a ref is attached
    expect(result.current.ref).toBeDefined()
    expect(result.current.isVisible).toBe(false)
  })

  it('should accept custom options', () => {
    const { result } = renderHook(() =>
      useScrollReveal({
        threshold: 0.5,
        rootMargin: '100px',
        once: false,
      })
    )
    
    expect(result.current.ref).toBeDefined()
    expect(result.current.isVisible).toBe(false)
  })

  it('should support multiple threshold values', () => {
    const { result } = renderHook(() =>
      useScrollReveal({
        threshold: [0, 0.25, 0.5, 0.75, 1],
      })
    )
    
    expect(result.current.ref).toBeDefined()
  })

  it('should return consistent ref object across renders', () => {
    const { result, rerender } = renderHook(() => useScrollReveal())
    
    const firstRef = result.current.ref
    rerender()
    const secondRef = result.current.ref
    
    expect(firstRef).toBe(secondRef)
  })
})
