/**
 * Property 8: Skills grouped by category
 * Tag: Feature: anmol-portfolio, Property 8: Skills grouped by category
 * Validates: Requirements 5.1
 *
 * For any array of Skill objects with valid categories:
 * - filterByCategory returns only skills with matching category
 * - union of all four category groups equals the original array (no duplicates, no omissions)
 */
import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { filterByCategory } from '../../components/ui/SkillBadge'
import type { SkillCategory } from '../../types'

const CATEGORIES: SkillCategory[] = ['languages', 'backend', 'tools', 'core-cs']

const skillArbitrary = fc.record({
  name: fc.string({ minLength: 1, maxLength: 30 }),
  icon: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
  category: fc.constantFrom<SkillCategory>(...CATEGORIES),
})

describe('Property 8: Skills grouped by category', () => {
  it('filterByCategory returns only skills matching the requested category', () => {
    fc.assert(
      fc.property(
        fc.array(skillArbitrary, { minLength: 0, maxLength: 30 }),
        fc.constantFrom<SkillCategory>(...CATEGORIES),
        (skills, category) => {
          const filtered = filterByCategory(skills, category)
          return filtered.every((s) => s.category === category)
        },
      ),
      { numRuns: 200 },
    )
  })

  it('union of all category groups equals the original array with no duplicates', () => {
    fc.assert(
      fc.property(
        fc.array(skillArbitrary, { minLength: 0, maxLength: 30 }),
        (skills) => {
          const groups = CATEGORIES.map((cat) => filterByCategory(skills, cat))
          const union = groups.flat()

          // Same length — no duplicates, no omissions
          if (union.length !== skills.length) return false

          // Every skill in the original array appears exactly once in the union
          for (const skill of skills) {
            const count = union.filter((s) => s === skill).length
            if (count !== 1) return false
          }

          return true
        },
      ),
      { numRuns: 200 },
    )
  })

  it('filterByCategory returns empty array when no skills match', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<SkillCategory>(...CATEGORIES),
        (category) => {
          const otherCategories = CATEGORIES.filter((c) => c !== category)
          const skills = otherCategories.map((cat, i) => ({
            name: `Skill ${i}`,
            category: cat,
          }))
          const filtered = filterByCategory(skills, category)
          return filtered.length === 0
        },
      ),
      { numRuns: 100 },
    )
  })

  it('filterByCategory is idempotent — filtering twice gives same result', () => {
    fc.assert(
      fc.property(
        fc.array(skillArbitrary, { minLength: 0, maxLength: 20 }),
        fc.constantFrom<SkillCategory>(...CATEGORIES),
        (skills, category) => {
          const once = filterByCategory(skills, category)
          const twice = filterByCategory(once, category)
          return once.length === twice.length &&
            once.every((s, i) => s === twice[i])
        },
      ),
      { numRuns: 100 },
    )
  })
})
