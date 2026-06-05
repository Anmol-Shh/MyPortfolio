/**
 * Integration test: Contact form end-to-end
 * Validates: Requirements 8.3
 *
 * Mocks EmailJS, submits a valid form, asserts success message appears.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from '../../components/ui/ContactForm'

vi.mock('../../lib/emailjs', () => ({
  sendContactEmail: vi.fn(),
  EmailDeliveryError: class EmailDeliveryError extends Error {
    constructor(message: string) {
      super(message)
      this.name = 'EmailDeliveryError'
    }
  },
  EmailTimeoutError: class EmailTimeoutError extends Error {
    constructor() {
      super('Timeout')
      this.name = 'EmailTimeoutError'
    }
  },
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

import { sendContactEmail } from '../../lib/emailjs'

describe('Contact form end-to-end integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows success message within 3 seconds after valid form submission', async () => {
    // Mock EmailJS to resolve immediately
    vi.mocked(sendContactEmail).mockResolvedValueOnce(undefined)

    const user = userEvent.setup()
    render(<ContactForm />)

    // Fill in all required fields
    await user.type(screen.getByLabelText(/name/i), 'Anmol Sharma')
    await user.type(screen.getByLabelText(/email/i), 'anmol@example.com')
    await user.type(screen.getByLabelText(/message/i), 'Hello, I would like to connect!')

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))

    // Success message should appear within 3 seconds
    await waitFor(
      () => {
        expect(screen.getByRole('status')).toBeInTheDocument()
        expect(screen.getByText(/message sent/i)).toBeInTheDocument()
      },
      { timeout: 3000 },
    )

    // sendContactEmail should have been called with correct data
    expect(sendContactEmail).toHaveBeenCalledWith({
      name: 'Anmol Sharma',
      email: 'anmol@example.com',
      message: 'Hello, I would like to connect!',
    })
  })

  it('does not submit and shows errors when form is empty', async () => {
    render(<ContactForm />)

    fireEvent.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
      expect(screen.getByText('Email is required')).toBeInTheDocument()
      expect(screen.getByText('Message is required')).toBeInTheDocument()
    })

    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  it('shows error message with mailto fallback when EmailJS fails', async () => {
    vi.mocked(sendContactEmail).mockRejectedValueOnce(new Error('Network error'))

    const user = userEvent.setup()
    render(<ContactForm />)

    await user.type(screen.getByLabelText(/name/i), 'Anmol')
    await user.type(screen.getByLabelText(/email/i), 'anmol@example.com')
    await user.type(screen.getByLabelText(/message/i), 'Hello')

    fireEvent.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      // Mailto fallback link should be present
      expect(screen.getByRole('link', { name: /anmolsharma6503@gmail\.com/i })).toBeInTheDocument()
    })
  })
})
