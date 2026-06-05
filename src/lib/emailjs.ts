import emailjs from '@emailjs/browser'
import type { ContactFormState } from '../types'

// These values should be set as environment variables in production.
// For local dev, create a .env file with these keys.
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string

const TIMEOUT_MS = 10_000

export class EmailDeliveryError extends Error {
  readonly cause?: unknown

  constructor(
    message: string,
    cause?: unknown,
  ) {
    super(message)
    this.name = 'EmailDeliveryError'
    this.cause = cause
  }
}

export class EmailTimeoutError extends EmailDeliveryError {
  constructor() {
    super('Email delivery timed out after 10 seconds.')
    this.name = 'EmailTimeoutError'
  }
}

/**
 * Sends a contact form message via EmailJS.
 * Applies a 10-second timeout; throws a typed error on failure or timeout.
 */
export async function sendContactEmail(data: ContactFormState): Promise<void> {
  const templateParams = {
    from_name: data.name,
    from_email: data.email,
    message: data.message,
  }

  const sendPromise = emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
    publicKey: PUBLIC_KEY,
  })

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new EmailTimeoutError()), TIMEOUT_MS)
  })

  try {
    await Promise.race([sendPromise, timeoutPromise])
  } catch (err) {
    if (err instanceof EmailDeliveryError) throw err
    throw new EmailDeliveryError('Failed to send email.', err)
  }
}
