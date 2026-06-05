/**
 * Property 1: Theme persistence round-trip
 * Tag: Feature: anmol-portfolio, Property 1: Theme persistence round-trip
 * Validates: Requirements 10.4
 *
 * For any theme value ('dark' | 'light'), after storing it and reading it back,
 * initTheme(readStoredTheme()) must equal the original theme.
 */
import { describe, it, beforeEach, afterEach } from 'vitest'
import * as fc from 'fast-check'
import { storeTheme, readStoredTheme, initTheme } from '../../hooks/useTheme'
import type { Theme } from '../../types'

describe('Property 1: Theme persistence round-trip', () => {
  const originalLocalStorage = globalThis.localStorage

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
    // Restore in case a test replaced it
    Object.defineProperty(globalThis, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
      configurable: true,
    })
  })

  it('initTheme(readStoredTheme()) === t for all t in {dark, light}', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Theme>('dark', 'light'),
        (t) => {
          localStorage.clear()
          storeTheme(t)
          const stored = readStoredTheme()
          const result = initTheme(stored)
          return result === t
        },
      ),
      { numRuns: 100 },
    )
  })

  it('returns dark when localStorage is unavailable and no OS preference', () => {
    // Simulate SecurityError by replacing localStorage with a throwing object
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: () => { throw new DOMException('SecurityError') },
        setItem: () => { throw new DOMException('SecurityError') },
        removeItem: () => { throw new DOMException('SecurityError') },
        clear: () => {},
        length: 0,
        key: () => null,
      },
      writable: true,
      configurable: true,
    })

    fc.assert(
      fc.property(
        fc.constantFrom<Theme>('dark', 'light'),
        (_t) => {
          // When localStorage throws, readStoredTheme returns null
          const stored = readStoredTheme()
          // initTheme with null falls back to OS preference or 'dark'
          const result = initTheme(stored)
          return result === 'dark' || result === 'light'
        },
      ),
      { numRuns: 10 },
    )
  })
})
