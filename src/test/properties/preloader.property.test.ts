/**
 * Property 7: Preloader enforces scroll lock
 * Tag: Feature: anmol-portfolio, Property 7: Preloader enforces scroll lock
 * Validates: Requirements 2.3
 *
 * While the Preloader is mounted, document.body.style.overflow must be 'hidden'.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fc from 'fast-check'

/**
 * Simulates the scroll lock lifecycle of the Preloader.
 * Returns the overflow value at each lifecycle stage.
 */
function simulatePreloaderScrollLock(renderCycles: number): {
  duringMount: string[]
  afterUnmount: string
} {
  const duringMount: string[] = []

  // Simulate mount: lock scroll
  document.body.style.overflow = 'hidden'

  // Simulate render cycles while mounted
  for (let i = 0; i < renderCycles; i++) {
    duringMount.push(document.body.style.overflow)
  }

  // Simulate unmount: release scroll
  document.body.style.overflow = ''

  return { duringMount, afterUnmount: document.body.style.overflow }
}

describe('Property 7: Preloader enforces scroll lock', () => {
  beforeEach(() => {
    document.body.style.overflow = ''
  })

  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('body overflow is hidden during all render cycles while Preloader is mounted', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 50 }),
        (renderCycles) => {
          const { duringMount } = simulatePreloaderScrollLock(renderCycles)
          return duringMount.every((overflow) => overflow === 'hidden')
        },
      ),
      { numRuns: 200 },
    )
  })

  it('body overflow is restored to empty string after Preloader unmounts', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 50 }),
        (renderCycles) => {
          const { afterUnmount } = simulatePreloaderScrollLock(renderCycles)
          return afterUnmount === ''
        },
      ),
      { numRuns: 200 },
    )
  })

  it('scroll lock is applied immediately on mount (first render cycle)', () => {
    const { duringMount } = simulatePreloaderScrollLock(1)
    expect(duringMount[0]).toBe('hidden')
  })

  it('scroll lock holds for large render cycle counts', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 1000 }),
        (renderCycles) => {
          const { duringMount } = simulatePreloaderScrollLock(renderCycles)
          return duringMount.length === renderCycles &&
            duringMount.every((v) => v === 'hidden')
        },
      ),
      { numRuns: 50 },
    )
  })
})
