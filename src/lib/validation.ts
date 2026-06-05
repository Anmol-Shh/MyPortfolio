import { z } from 'zod'
import type { ContactFormState } from '../types'

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  message: z.string().min(1, 'Message is required'),
})

export type ContactSchemaErrors = Partial<Record<keyof ContactFormState, string>>

export interface ValidationResult {
  isValid: boolean
  errors: ContactSchemaErrors
}

/**
 * Validates a contact form submission against the Zod schema.
 * Returns { isValid, errors } where errors is a map of field → message.
 */
export function validateContact(data: unknown): ValidationResult {
  const result = contactSchema.safeParse(data)

  if (result.success) {
    return { isValid: true, errors: {} }
  }

  const errors: ContactSchemaErrors = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof ContactFormState
    if (field && !errors[field]) {
      errors[field] = issue.message
    }
  }

  return { isValid: false, errors }
}
