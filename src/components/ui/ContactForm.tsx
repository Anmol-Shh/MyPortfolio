import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { contactSchema } from '../../lib/validation'
import { sendContactEmail, EmailDeliveryError } from '../../lib/emailjs'
import { portfolioData } from '../../data/portfolio'
import type { ContactFormState, ContactFormStatus } from '../../types'

/**
 * Controlled contact form using React Hook Form + Zod.
 * Inline validation errors on blur and submit.
 * Submits via EmailJS with success/error feedback.
 * Requirements: 8.2–8.5, 8.7
 */
export function ContactForm() {
  const [status, setStatus] = useState<ContactFormStatus>({ type: 'idle' })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormState>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: ContactFormState) => {
    setStatus({ type: 'submitting' })
    try {
      await sendContactEmail(data)
      setStatus({ type: 'success', message: "Message sent! I'll get back to you soon." })
      reset()
    } catch (err) {
      const isTimeout = err instanceof EmailDeliveryError && err.name === 'EmailTimeoutError'
      setStatus({
        type: 'error',
        message: isTimeout
          ? 'Request timed out. Please try emailing directly.'
          : 'Something went wrong. Please try emailing directly.',
      })
    }
  }

  const inputBase =
    'w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-100 focus:ring-2 focus:ring-violet-500 dark:bg-slate-800/60 dark:text-white dark:placeholder-slate-500'
  const inputNormal = 'border-slate-300 dark:border-slate-700/50'
  const inputError = 'border-red-400 dark:border-red-500/60'

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Contact form"
      className="space-y-5"
    >
      {/* Name field */}
      <div>
        <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Name <span aria-hidden="true" className="text-red-400">*</span>
        </label>
        <motion.div
          animate={errors.name ? { x: [0, -4, 4, -4, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            placeholder="Your name"
            className={`${inputBase} ${errors.name ? inputError : inputNormal}`}
            {...register('name')}
          />
        </motion.div>
        {errors.name && (
          <p id="contact-name-error" role="alert" className="mt-1.5 text-xs text-red-400">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email field */}
      <div>
        <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Email <span aria-hidden="true" className="text-red-400">*</span>
        </label>
        <motion.div
          animate={errors.email ? { x: [0, -4, 4, -4, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            placeholder="your@email.com"
            className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
            {...register('email')}
          />
        </motion.div>
        {errors.email && (
          <p id="contact-email-error" role="alert" className="mt-1.5 text-xs text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Message field */}
      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-slate-300">
          Message <span aria-hidden="true" className="text-red-400">*</span>
        </label>
        <motion.div
          animate={errors.message ? { x: [0, -4, 4, -4, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          <textarea
            id="contact-message"
            rows={5}
            aria-required="true"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
            placeholder="Your message..."
            className={`${inputBase} resize-none ${errors.message ? inputError : inputNormal}`}
            {...register('message')}
          />
        </motion.div>
        {errors.message && (
          <p id="contact-message-error" role="alert" className="mt-1.5 text-xs text-red-400">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting || status.type === 'submitting'}
        aria-busy={isSubmitting || status.type === 'submitting'}
        className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-150 hover:bg-violet-500 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
      >
        {isSubmitting || status.type === 'submitting' ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending…
          </span>
        ) : (
          'Send Message'
        )}
      </button>

      {/* Status messages */}
      {status.type === 'success' && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
        >
          ✓ {status.message}
        </div>
      )}

      {status.type === 'error' && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {status.message}{' '}
          <a
            href={`mailto:${portfolioData.contact.email}`}
            className="underline hover:text-red-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
          >
            {portfolioData.contact.email}
          </a>
        </div>
      )}
    </form>
  )
}
