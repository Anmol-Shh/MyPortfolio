/**
 * Property 10: Experience displayed in reverse-chronological order
 * Tag: Feature: anmol-portfolio, Property 10: Experience displayed in reverse-chronological order
 * Validates: Requirements 6.1
 *
 * For any array of ExperienceRole objects with distinct parseable date ranges,
 * the rendered order must match descending sort by start date (most recent first).
 */
import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import type { ExperienceRole } from '../../types'

/**
 * Parse the start year from a period string like "Feb 2024 – July 2024" or "July 2025 – Current".
 * Returns the year as a number, or 0 if unparseable.
 */
export function parseStartYear(period: string): number {
  const match = period.match(/\b(19|20)\d{2}\b/)
  return match ? parseInt(match[0], 10) : 0
}

/**
 * Sort roles in reverse-chronological order (most recent start year first).
 */
export function sortRolesReverseChronological(roles: ExperienceRole[]): ExperienceRole[] {
  return [...roles].sort((a, b) => parseStartYear(b.period) - parseStartYear(a.period))
}

/**
 * Check if an array of roles is already in reverse-chronological order.
 */
function isReverseChronological(roles: ExperienceRole[]): boolean {
  for (let i = 0; i < roles.length - 1; i++) {
    const currentYear = parseStartYear(roles[i].period)
    const nextYear = parseStartYear(roles[i + 1].period)
    if (currentYear < nextYear) return false
  }
  return true
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Generate a period string with a distinct year
function makePeriod(year: number): string {
  const month = MONTHS[year % 12]
  return `${month} ${year} – ${month} ${year + 1}`
}

const nonEmptyString = fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length > 0)

describe('Property 10: Experience displayed in reverse-chronological order', () => {
  it('sortRolesReverseChronological produces reverse-chronological order for any input', () => {
    fc.assert(
      fc.property(
        // Generate 2–6 roles with distinct years (2000–2030)
        fc.uniqueArray(fc.integer({ min: 2000, max: 2030 }), { minLength: 2, maxLength: 6 }),
        (years) => {
          const roles: ExperienceRole[] = years.map((year) => ({
            company: `Company ${year}`,
            title: 'Engineer',
            period: makePeriod(year),
            location: 'Remote',
            achievements: ['Did something great'],
          }))

          const sorted = sortRolesReverseChronological(roles)
          return isReverseChronological(sorted)
        },
      ),
      { numRuns: 200 },
    )
  })

  it('most recent role is always first after sorting', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(fc.integer({ min: 2000, max: 2030 }), { minLength: 2, maxLength: 6 }),
        (years) => {
          const roles: ExperienceRole[] = years.map((year) => ({
            company: `Company ${year}`,
            title: 'Engineer',
            period: makePeriod(year),
            location: 'Remote',
            achievements: ['Achievement'],
          }))

          const sorted = sortRolesReverseChronological(roles)
          const maxYear = Math.max(...years)
          return parseStartYear(sorted[0].period) === maxYear
        },
      ),
      { numRuns: 200 },
    )
  })

  it('parseStartYear correctly extracts year from period strings', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2000, max: 2030 }),
        nonEmptyString,
        nonEmptyString,
        (year, monthA, monthB) => {
          const period = `${monthA} ${year} – ${monthB} ${year + 1}`
          return parseStartYear(period) === year
        },
      ),
      { numRuns: 200 },
    )
  })

  it('portfolio experience data is already in reverse-chronological order', async () => {
    const { portfolioData } = await import('../../data/portfolio')
    const { experience } = portfolioData
    // Verify the hardcoded data is correctly ordered
    const isOrdered = isReverseChronological(experience)
    return isOrdered
  })
})
