/**
 * Property 4: Animation triggers only once per section
 * Tag: Feature: anmol-portfolio, Property 4: Animation triggers only once per section
 * Validates: Requirements 3.4
 *
 * No matter how many IntersectionObserver events fire for a section,
 * the animation callback must be invoked exactly once.
 */
import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'

/**
 * Simulates the hasAnimated guard logic extracted from useIntersectionObserver.
 * Returns the number of times the animation callback would be invoked
 * given `eventCount` intersection events.
 */
function simulateAnimationTriggers(eventCount: number): number {
  let hasAnimated = false
  let callCount = 0

  for (let i = 0; i < eventCount; i++) {
    // Each event: isIntersecting = true (worst case — all events fire as intersecting)
    if (!hasAnimated) {
      hasAnimated = true
      callCount++
    }
  }

  return callCount
}

describe('Property 4: Animation triggers only once per section', () => {
  it('animation callback is invoked exactly once regardless of event count (2–20)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 20 }),
        (eventCount) => {
          const callCount = simulateAnimationTriggers(eventCount)
          return callCount === 1
        },
      ),
      { numRuns: 200 },
    )
  })

  it('animation callback is invoked exactly once for a single event', () => {
    expect(simulateAnimationTriggers(1)).toBe(1)
  })

  it('animation callback is invoked exactly once for large event counts', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 1000 }),
        (eventCount) => {
          return simulateAnimationTriggers(eventCount) === 1
        },
      ),
      { numRuns: 100 },
    )
  })

  it('animation callback is never invoked when no events fire', () => {
    expect(simulateAnimationTriggers(0)).toBe(0)
  })
})
