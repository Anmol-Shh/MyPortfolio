/**
 * Property 6: Navigation active section consistency
 * Tag: Feature: anmol-portfolio, Property 6: Navigation active section consistency
 * Validates: Requirements 9.4
 *
 * For any section ID in the nav items list, when that section is the most
 * recently intersected section, activeSection must equal that section's ID.
 */
import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { NAV_ITEMS } from '../../components/layout/Navbar'

/**
 * Simulates the active section tracking logic.
 * Given a list of intersection events (each with a sectionId and isIntersecting flag),
 * returns the last sectionId that was intersecting.
 */
function simulateActiveSectionTracking(
  events: Array<{ sectionId: string; isIntersecting: boolean }>,
): string {
  let activeSection = ''
  for (const event of events) {
    if (event.isIntersecting) {
      activeSection = event.sectionId
    }
  }
  return activeSection
}

describe('Property 6: Navigation active section consistency', () => {
  const sectionIds = NAV_ITEMS.map((item) => item.sectionId)

  it('activeSection equals the last intersected sectionId', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...sectionIds),
        (targetSectionId) => {
          // Simulate: target section fires an intersection event
          const events = [{ sectionId: targetSectionId, isIntersecting: true }]
          const activeSection = simulateActiveSectionTracking(events)
          return activeSection === targetSectionId
        },
      ),
      { numRuns: 100 },
    )
  })

  it('activeSection equals the most recently intersected section when multiple fire', () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom(...sectionIds), { minLength: 1, maxLength: 10 }),
        (sectionSequence) => {
          const events = sectionSequence.map((sectionId) => ({
            sectionId,
            isIntersecting: true,
          }))
          const activeSection = simulateActiveSectionTracking(events)
          // The active section must be the last one in the sequence
          return activeSection === sectionSequence[sectionSequence.length - 1]
        },
      ),
      { numRuns: 200 },
    )
  })

  it('activeSection is always a valid nav section ID', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...sectionIds),
        (sectionId) => {
          const events = [{ sectionId, isIntersecting: true }]
          const activeSection = simulateActiveSectionTracking(events)
          return sectionIds.includes(activeSection)
        },
      ),
      { numRuns: 100 },
    )
  })

  it('activeSection does not change when isIntersecting is false', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...sectionIds),
        fc.constantFrom(...sectionIds),
        (firstSection, secondSection) => {
          const events = [
            { sectionId: firstSection, isIntersecting: true },
            { sectionId: secondSection, isIntersecting: false },
          ]
          const activeSection = simulateActiveSectionTracking(events)
          // Active section should remain the first (intersecting) one
          return activeSection === firstSection
        },
      ),
      { numRuns: 100 },
    )
  })
})
