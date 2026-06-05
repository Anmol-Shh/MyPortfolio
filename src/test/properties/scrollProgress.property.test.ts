/**
 * Property 3: Scroll progress is bounded
 * Tag: Feature: anmol-portfolio, Property 3: Scroll progress is bounded
 * Validates: Requirements 3.3
 *
 * For any scroll position in [0, maxScroll] and any valid page/viewport heights,
 * computeScrollProgress must return a value in [0, 1].
 */
import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { computeScrollProgress } from '../../hooks/useScrollProgress'

describe('Property 3: Scroll progress is bounded', () => {
  it('result is always in [0, 1] for valid inputs', () => {
    fc.assert(
      fc.property(
        // positive viewport height (1–2000px)
        fc.integer({ min: 1, max: 2000 }),
        // page height >= viewport height (viewport to viewport+10000)
        fc.integer({ min: 0, max: 10000 }),
        (innerHeight, extraHeight) => {
          const scrollHeight = innerHeight + extraHeight
          const maxScroll = Math.max(0, scrollHeight - innerHeight)
          // scroll position anywhere in [0, maxScroll]
          const scrollY = maxScroll === 0 ? 0 : Math.floor(Math.random() * (maxScroll + 1))
          const result = computeScrollProgress(scrollY, scrollHeight, innerHeight)
          return result >= 0 && result <= 1
        },
      ),
      { numRuns: 1000 },
    )
  })

  it('result is always in [0, 1] for arbitrary scroll positions including edge cases', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 2000 }),   // innerHeight
        fc.integer({ min: 1, max: 12000 }),  // scrollHeight
        fc.integer({ min: 0, max: 12000 }),  // scrollY (may exceed maxScroll — clamp handles it)
        (innerHeight, scrollHeight, scrollY) => {
          const result = computeScrollProgress(scrollY, scrollHeight, innerHeight)
          return result >= 0 && result <= 1
        },
      ),
      { numRuns: 1000 },
    )
  })

  it('returns 0 when scrollY is 0', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 2000 }),
        fc.integer({ min: 1, max: 12000 }),
        (innerHeight, scrollHeight) => {
          const result = computeScrollProgress(0, scrollHeight, innerHeight)
          return result === 0
        },
      ),
      { numRuns: 200 },
    )
  })

  it('returns 1 when scrollY equals maxScroll', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 1000 }),
        fc.integer({ min: 1, max: 1000 }),
        (innerHeight, extra) => {
          const scrollHeight = innerHeight + extra
          const maxScroll = scrollHeight - innerHeight
          const result = computeScrollProgress(maxScroll, scrollHeight, innerHeight)
          return result === 1
        },
      ),
      { numRuns: 200 },
    )
  })

  it('returns 0 when page is not scrollable (scrollHeight <= innerHeight)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 2000 }),
        (innerHeight) => {
          // scrollHeight === innerHeight → maxScroll === 0
          const result = computeScrollProgress(0, innerHeight, innerHeight)
          return result === 0
        },
      ),
      { numRuns: 200 },
    )
  })
})
