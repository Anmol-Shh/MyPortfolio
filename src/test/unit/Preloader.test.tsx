/**
 * Unit tests for Preloader component
 * Validates: Requirements 2.1, 2.2, 2.3, 2.4
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { Preloader } from '../../components/ui/Preloader'

// Top-level mock — hoisted before any test runs
vi.mock('../../lib/animations', () => ({
  createPreloaderTimeline: () => ({
    play: vi.fn(),
    kill: vi.fn(),
    progress: vi.fn(),
    eventCallback: vi.fn((event: string, cb: () => void) => {
      if (event === 'onComplete') {
        setTimeout(cb, 0)
      }
    }),
  }),
}))

describe('Preloader', () => {
  beforeEach(() => {
    document.body.style.overflow = ''
    vi.useFakeTimers()
  })

  afterEach(() => {
    document.body.style.overflow = ''
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('renders with accessible role and label', () => {
    render(<Preloader onComplete={vi.fn()} />)
    expect(screen.getByRole('status', { name: /loading portfolio/i })).toBeInTheDocument()
  })

  it('displays the SVG initials', () => {
    render(<Preloader onComplete={vi.fn()} />)
    // Ring preloader shows "AS" initials and an SVG ring
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('locks body scroll on mount', () => {
    render(<Preloader onComplete={vi.fn()} />)
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('releases body scroll on unmount', () => {
    const { unmount } = render(<Preloader onComplete={vi.fn()} />)
    expect(document.body.style.overflow).toBe('hidden')
    unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('calls onComplete after animation completes', async () => {
    const onComplete = vi.fn()
    render(<Preloader onComplete={onComplete} />)

    await act(async () => {
      vi.runAllTimers()
    })

    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('calls onComplete after maximum display time (5000ms)', async () => {
    const onComplete = vi.fn()
    render(<Preloader onComplete={onComplete} />)

    await act(async () => {
      vi.advanceTimersByTime(5000)
    })

    expect(onComplete).toHaveBeenCalled()
  })
})
