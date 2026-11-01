import { zodResolver } from '@hookform/resolvers/zod'
import { useState, type ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import contactFormBackground from '@/assets/devices/device-lifestyle.jpg'
import { RepairexBrandMark } from '@/components/layout/RepairexBrandMark'
import { Container } from '@/components/shared/Container'
import { ContactTopicSelect } from '@/features/contact/components/ContactTopicSelect'
import { submitContactMessage } from '@/features/contact/api/submitContactMessage'
import {
  CONTACT_FORM_PLATFORM_TOPICS,
  contactFormSchema,
  type ContactFormValues,
} from '@/features/contact/lib/contact-form-schema'
import { Button } from '@/components/ui/button'
import { useAuthSession } from '@/hooks/useAuthSession'
import { getApiErrorMessage } from '@/lib/api-client'
import { getStartRepairRequestPath } from '@/lib/repair-entry'
import { SITE_CONTACT } from '@/lib/site-contact'
import { cn } from '@/lib/utils'

type FieldProps = {
  id: string
  label: string
  error?: string
  children: ReactNode
}

const defaultPlatformTopic = CONTACT_FORM_PLATFORM_TOPICS[0].value

/**
 * @description Accessible labeled field wrapper for the contact form card.
 */
function ContactFormField({ id, label, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-ui font-medium text-foreground">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-caption text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

const fieldClassName =
  'flex h-11 w-full rounded-xl border border-border/80 bg-background px-3.5 text-body text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20'

/**
 * @description Platform contact form; repair flows redirect to dashboard or login.
 */
export function ContactFormSection() {
  const { isAuthenticated } = useAuthSession()
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)
  const [submitVariant, setSubmitVariant] = useState<'success' | 'error' | null>(
    null,
  )

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      topic: defaultPlatformTopic,
      message: '',
    },
  })

  async function onSubmit(values: ContactFormValues) {
    setSubmitMessage(null)
    setSubmitVariant(null)

    try {
      const response = await submitContactMessage(values)
      setSubmitVariant('success')
      setSubmitMessage(response.message)
      reset({
        fullName: '',
        email: '',
        phone: '',
        topic: defaultPlatformTopic,
        message: '',
      })
    } catch (error) {
      setSubmitVariant('error')
      setSubmitMessage(getApiErrorMessage(error))
    }
  }

  const repairWorkspaceHref = getStartRepairRequestPath(isAuthenticated)

  return (
    <section
      id="contact-form"
      aria-label="Contact form"
      className="contact-form-split relative isolate overflow-hidden py-14 sm:py-16 lg:py-20"
    >
      <div className="absolute inset-0 z-0" aria-hidden>
        <img
          src={contactFormBackground}
          alt=""
          className="size-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[#3a342c]/72" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2a2520]/85 via-[#3a342c]/55 to-[#3a342c]/40" />
      </div>

      <Container className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12 xl:gap-14">
          <div className="max-w-lg text-white">
            <p className="font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight font-bold tracking-tight">
              Get in touch with
            </p>
            <div className="mt-3 flex items-center gap-3">
              <RepairexBrandMark className="size-11 ring-primary-foreground/20" />
              <span className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold italic tracking-tight">
                Repairex
              </span>
            </div>
            <p className="mt-5 max-w-md text-body leading-relaxed text-white/85">
              Use this form for platform and vendor questions. For device repairs, open
              your{' '}
              <Link
                to={repairWorkspaceHref}
                className="font-semibold text-white underline decoration-white/40 underline-offset-2 hover:decoration-white"
              >
                repair workspace
              </Link>
              .
            </p>
          </div>

          <div className="theme-marketing-card w-full max-w-none rounded-[1.75rem] bg-card p-6 shadow-xl sm:p-8 lg:p-9">
            <h2 className="font-display text-h2 font-bold tracking-tight text-foreground">
              Message the Repairex team
            </h2>
            <p className="mt-2 text-ui text-muted-foreground">
              Repairs and order status are handled in your dashboard — not this form.
            </p>

            <form
              className="mt-6 space-y-5"
              noValidate
              onSubmit={(event) => {
                void handleSubmit(onSubmit)(event)
              }}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <ContactFormField
                  id="contact-full-name"
                  label="Full name"
                  error={errors.fullName?.message}
                >
                  <input
                    id="contact-full-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    className={fieldClassName}
                    aria-invalid={Boolean(errors.fullName)}
                    {...register('fullName')}
                  />
                </ContactFormField>

                <ContactFormField
                  id="contact-email"
                  label="Email address"
                  error={errors.email?.message}
                >
                  <input
                    id="contact-email"
                    type="email"
                    autoComplete="email"
                    placeholder="Your email address"
                    className={fieldClassName}
                    aria-invalid={Boolean(errors.email)}
                    {...register('email')}
                  />
                </ContactFormField>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
              <ContactFormField
                id="contact-topic"
                label="Message topic"
                error={errors.topic?.message}
              >
                <Controller
                  name="topic"
                  control={control}
                  render={({ field }) => (
                    <ContactTopicSelect
                      id="contact-topic"
                      value={field.value}
                      invalid={Boolean(errors.topic)}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </ContactFormField>

                <ContactFormField
                  id="contact-phone"
                  label="Phone (optional)"
                  error={errors.phone?.message}
                >
                  <input
                    id="contact-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder={SITE_CONTACT.phoneDisplay}
                    className={fieldClassName}
                    {...register('phone')}
                  />
                </ContactFormField>
              </div>

              <ContactFormField
                id="contact-message"
                label="Message"
                error={errors.message?.message}
              >
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder="Platform or partnership details"
                  className={cn(
                    fieldClassName,
                    'h-auto min-h-[7.5rem] resize-y py-3 leading-relaxed',
                  )}
                  aria-invalid={Boolean(errors.message)}
                  {...register('message')}
                />
              </ContactFormField>

              {submitMessage ? (
                <p
                  role="status"
                  className={cn(
                    'rounded-xl border px-4 py-3 text-body',
                    submitVariant === 'success' &&
                      'border-primary/30 bg-primary/10 text-foreground',
                    submitVariant === 'error' &&
                      'border-destructive/40 bg-destructive/8 text-destructive',
                  )}
                >
                  {submitMessage}
                </p>
              ) : null}

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="h-12 w-full rounded-full bg-primary/20 text-foreground shadow-sm transition hover:bg-primary hover:text-primary-foreground disabled:opacity-60"
              >
                {isSubmitting ? 'Sending…' : 'Send message'}
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  )
}
