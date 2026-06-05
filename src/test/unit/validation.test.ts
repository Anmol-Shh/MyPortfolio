/**
 * Unit tests for validation.ts
 * Validates: Requirements 8.4, 8.5
 */
import { describe, it, expect } from 'vitest'
import { validateContact } from '../../lib/validation'

describe('validateContact', () => {
  describe('valid submissions', () => {
    it('passes with all valid fields', () => {
      const { isValid, errors } = validateContact({
        name: 'Anmol Sharma',
        email: 'anmol@example.com',
        message: 'Hello, I would like to connect.',
      })
      expect(isValid).toBe(true)
      expect(errors).toEqual({})
    })

    it('passes with minimal valid fields', () => {
      const { isValid, errors } = validateContact({
        name: 'A',
        email: 'a@b.co',
        message: 'Hi',
      })
      expect(isValid).toBe(true)
      expect(errors).toEqual({})
    })
  })

  describe('empty field failures', () => {
    it('fails when name is empty', () => {
      const { isValid, errors } = validateContact({
        name: '',
        email: 'test@example.com',
        message: 'Hello',
      })
      expect(isValid).toBe(false)
      expect(errors.name).toBe('Name is required')
    })

    it('fails when email is empty', () => {
      const { isValid, errors } = validateContact({
        name: 'Anmol',
        email: '',
        message: 'Hello',
      })
      expect(isValid).toBe(false)
      expect(errors.email).toBe('Email is required')
    })

    it('fails when message is empty', () => {
      const { isValid, errors } = validateContact({
        name: 'Anmol',
        email: 'test@example.com',
        message: '',
      })
      expect(isValid).toBe(false)
      expect(errors.message).toBe('Message is required')
    })

    it('fails when all fields are empty', () => {
      const { isValid, errors } = validateContact({
        name: '',
        email: '',
        message: '',
      })
      expect(isValid).toBe(false)
      expect(errors.name).toBeDefined()
      expect(errors.email).toBeDefined()
      expect(errors.message).toBeDefined()
    })

    it('fails when fields are missing entirely', () => {
      const { isValid, errors } = validateContact({})
      expect(isValid).toBe(false)
      expect(Object.keys(errors).length).toBeGreaterThan(0)
    })
  })

  describe('invalid email format failures', () => {
    const invalidEmails = [
      'notanemail',
      '@nodomain.com',
      'missing@',
      'two@@signs.com',
      'no-at-sign',
      'spaces in@email.com',
      'missing.tld@domain',
    ]

    for (const email of invalidEmails) {
      it(`fails for invalid email: "${email}"`, () => {
        const { isValid, errors } = validateContact({
          name: 'Anmol',
          email,
          message: 'Hello',
        })
        expect(isValid).toBe(false)
        expect(errors.email).toBe('Invalid email format')
      })
    }
  })

  describe('edge cases', () => {
    it('fails when input is null', () => {
      const { isValid } = validateContact(null)
      expect(isValid).toBe(false)
    })

    it('fails when input is a string', () => {
      const { isValid } = validateContact('not an object')
      expect(isValid).toBe(false)
    })

    it('fails when input is undefined', () => {
      const { isValid } = validateContact(undefined)
      expect(isValid).toBe(false)
    })
  })
})
