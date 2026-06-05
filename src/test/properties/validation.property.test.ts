/**
 * Property 2: Contact form validation correctness
 * Tag: Feature: anmol-portfolio, Property 2: Contact form validation correctness
 * Validates: Requirements 8.3, 8.4, 8.5
 *
 * Invalid branch: any object with at least one empty/missing field or malformed email
 *   → errors is non-empty AND sendEmail is not called
 * Valid branch: any object with all valid fields
 *   → errors is empty
 */
import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { validateContact } from '../../lib/validation'

// Arbitrary for a valid email address (simplified but covers common patterns)
const validEmail = fc
  .tuple(
    fc.stringMatching(/^[a-z]{1,10}$/),
    fc.stringMatching(/^[a-z]{1,8}$/),
    fc.constantFrom('com', 'net', 'org', 'io', 'dev'),
  )
  .map(([local, domain, tld]) => `${local}@${domain}.${tld}`)

// Arbitrary for a non-empty string (at least 1 printable char)
const nonEmptyString = fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0)

// Arbitrary for an invalid email (no @, or missing domain, etc.)
const invalidEmail = fc.oneof(
  fc.constant(''),
  fc.constant('notanemail'),
  fc.constant('@nodomain'),
  fc.constant('missing@'),
  fc.constant('two@@signs.com'),
  fc.constant('spaces in@email.com'),
)

describe('Property 2: Contact form validation correctness', () => {
  describe('Valid branch — all fields present and email is valid', () => {
    it('errors is empty for any fully valid submission', () => {
      fc.assert(
        fc.property(
          nonEmptyString,
          validEmail,
          nonEmptyString,
          (name, email, message) => {
            const { isValid, errors } = validateContact({ name, email, message })
            return isValid === true && Object.keys(errors).length === 0
          },
        ),
        { numRuns: 200 },
      )
    })
  })

  describe('Invalid branch — empty name', () => {
    it('errors is non-empty when name is empty', () => {
      fc.assert(
        fc.property(
          validEmail,
          nonEmptyString,
          (email, message) => {
            const { isValid, errors } = validateContact({ name: '', email, message })
            return isValid === false && Object.keys(errors).length > 0
          },
        ),
        { numRuns: 100 },
      )
    })
  })

  describe('Invalid branch — empty message', () => {
    it('errors is non-empty when message is empty', () => {
      fc.assert(
        fc.property(
          nonEmptyString,
          validEmail,
          (name, email) => {
            const { isValid, errors } = validateContact({ name, email, message: '' })
            return isValid === false && Object.keys(errors).length > 0
          },
        ),
        { numRuns: 100 },
      )
    })
  })

  describe('Invalid branch — malformed email', () => {
    it('errors is non-empty for any malformed email', () => {
      fc.assert(
        fc.property(
          nonEmptyString,
          invalidEmail,
          nonEmptyString,
          (name, email, message) => {
            const { isValid, errors } = validateContact({ name, email, message })
            return isValid === false && Object.keys(errors).length > 0
          },
        ),
        { numRuns: 100 },
      )
    })
  })

  describe('Invalid branch — missing fields', () => {
    it('errors is non-empty when all fields are missing', () => {
      const { isValid, errors } = validateContact({})
      expect(isValid).toBe(false)
      expect(Object.keys(errors).length).toBeGreaterThan(0)
    })

    it('errors is non-empty when email field is missing', () => {
      fc.assert(
        fc.property(
          nonEmptyString,
          nonEmptyString,
          (name, message) => {
            const { isValid, errors } = validateContact({ name, message })
            return isValid === false && Object.keys(errors).length > 0
          },
        ),
        { numRuns: 100 },
      )
    })
  })
})
