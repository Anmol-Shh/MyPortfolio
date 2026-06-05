/**
 * Unit tests for ContactForm component
 * Validates: Requirements 8.3, 8.4, 8.5
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from '../../components/ui/ContactForm'

// Mock EmailJS
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

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('form rendering', () => {
    it('renders name, email, and message fields', () => {
      render(<ContactForm />)
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    })

    it('renders a submit button', () => {
      render(<ContactForm />)
      expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
    })
  })

  describe('validation errors on invalid submit', () => {
    it('shows inline errors when submitting empty form', async () => {
      render(<ContactForm />)
      fireEvent.click(screen.getByRole('button', { name: /send message/i }))

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument()
        expect(screen.getByText('Email is required')).toBeInTheDocument()
        expect(screen.getByText('Message is required')).toBeInTheDocument()
      })
    })

    it('shows invalid email error for malformed email', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)

      await user.type(screen.getByLabelText(/name/i), 'Anmol')
      await user.type(screen.getByLabelText(/email/i), 'notanemail')
      await user.type(screen.getByLabelText(/message/i), 'Hello')
      fireEvent.click(screen.getByRole('button', { name: /send message/i }))

      await waitFor(() => {
        expect(screen.getByText('Invalid email format')).toBeInTheDocument()
      })
    })

    it('does not call sendContactEmail when form is invalid', async () => {
      render(<ContactForm />)
      fireEvent.click(screen.getByRole('button', { name: /send message/i }))

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument()
      })

      expect(sendContactEmail).not.toHaveBeenCalled()
    })
  })

  describe('successful submission', () => {
    it('calls sendContactEmail with correct payload on valid submit', async () => {
      vi.mocked(sendContactEmail).mockResolvedValueOnce(undefined)
      const user = userEvent.setup()
      render(<ContactForm />)

      await user.type(screen.getByLabelText(/name/i), 'Anmol Sharma')
      await user.type(screen.getByLabelText(/email/i), 'anmol@example.com')
      await user.type(screen.getByLabelText(/message/i), 'Hello there!')
      fireEvent.click(screen.getByRole('button', { name: /send message/i }))

      await waitFor(() => {
        expect(sendContactEmail).toHaveBeenCalledWith({
          name: 'Anmol Sharma',
          email: 'anmol@example.com',
          message: 'Hello there!',
        })
      })
    })

    it('shows success message after valid submission', async () => {
      vi.mocked(sendContactEmail).mockResolvedValueOnce(undefined)
      const user = userEvent.setup()
      render(<ContactForm />)

      await user.type(screen.getByLabelText(/name/i), 'Anmol Sharma')
      await user.type(screen.getByLabelText(/email/i), 'anmol@example.com')
      await user.type(screen.getByLabelText(/message/i), 'Hello there!')
      fireEvent.click(screen.getByRole('button', { name: /send message/i }))

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument()
        expect(screen.getByText(/message sent/i)).toBeInTheDocument()
      })
    })
  })

  describe('error handling', () => {
    it('shows error message when sendContactEmail throws', async () => {
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
      })
    })
  })
})
