import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePerformanceMonitor, meetsPerformanceRequirements } from '../../hooks/usePerformanceMonitor'
import { PERFORMANCE_BUDGET } from '../../lib/animations'

describe('usePerformanceMonitor', () => {
  beforeEach(() => {
    // Mock requestAnimationFrame
    globalThis.requestAnimationFrame = vi.fn((_callback) => {
      // Don't actually call the callback to avoid infinite loops in tests
      return 1
    })

    // Mock cancelAnimationFrame
    globalThis.cancelAnimationFrame = vi.fn()

    // Mock performance.now()
    vi.spyOn(performance, 'now').mockReturnValue(0)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return initial performance metrics', () => {
    const { result } = renderHook(() => usePerformanceMonitor())
    
    expect(result.current.fps).toBe(PERFORMANCE_BUDGET.targetFPS)
    expect(result.current.frameTime).toBe(PERFORMANCE_BUDGET.maxFrameTime)
    expect(result.current.animationCount).toBe(0)
    expect(result.current.isPerformant).toBe(true)
  })

  it('should start monitoring on mount', () => {
    renderHook(() => usePerformanceMonitor())
    
    expect(globalThis.requestAnimationFrame).toHaveBeenCalled()
  })

  it('should cancel animation frame on unmount', () => {
    const { unmount } = renderHook(() => usePerformanceMonitor())
    
    unmount()
    
    expect(globalThis.cancelAnimationFrame).toHaveBeenCalled()
  })

  it('should accept custom options', () => {
    const { result } = renderHook(() =>
      usePerformanceMonitor({ 
        updateInterval: 500,
        minAcceptableFPS: 45,
        logWarnings: true 
      })
    )
    
    expect(result.current).toBeDefined()
    expect(result.current.fps).toBe(PERFORMANCE_BUDGET.targetFPS)
  })
})

describe('meetsPerformanceRequirements', () => {
  beforeEach(() => {
    // Reset navigator mocks
    Object.defineProperty(navigator, 'deviceMemory', {
      writable: true,
      configurable: true,
      value: undefined,
    })
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      writable: true,
      configurable: true,
      value: undefined,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return true when device has 4GB+ memory', () => {
    Object.defineProperty(navigator, 'deviceMemory', {
      writable: true,
      configurable: true,
      value: 8,
    })

    expect(meetsPerformanceRequirements()).toBe(true)
  })

  it('should return false when device has less than 4GB memory', () => {
    Object.defineProperty(navigator, 'deviceMemory', {
      writable: true,
      configurable: true,
      value: 2,
    })

    expect(meetsPerformanceRequirements()).toBe(false)
  })

  it('should fallback to hardware concurrency when deviceMemory unavailable', () => {
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      writable: true,
      configurable: true,
      value: 8,
    })

    expect(meetsPerformanceRequirements()).toBe(true)
  })

  it('should return false when hardware concurrency is low', () => {
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      writable: true,
      configurable: true,
      value: 2,
    })

    expect(meetsPerformanceRequirements()).toBe(false)
  })

  it('should return true when no performance info available', () => {
    // Both deviceMemory and hardwareConcurrency undefined
    expect(meetsPerformanceRequirements()).toBe(true)
  })
})
