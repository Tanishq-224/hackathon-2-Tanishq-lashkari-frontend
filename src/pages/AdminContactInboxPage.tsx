import { useState } from 'react'
import { Loader2, Mail, Phone } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { CONTACT_FORM_PLATFORM_TOPICS } from '@/features/contact/lib/contact-form-schema'
import {
  adminContactMessagesQueryKeyWithFilters,
  fetchAdminContactMessages,
  updateAdminContactMessage,
  type AdminContactMessage,
  type ContactMessageStatus,
  type ContactTopic,
} from '@/features/admin/api/contactAdminApi'
import { useAppToast } from '@/components/shared/AppToastProvider'
import { getApiErrorMessage } from '@/lib/api-client'
import { cn } from '@/lib/utils'

const STATUS_OPTIONS: { value: ContactMessageStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'resolved', label: 'Resolved' },
]

const topicLabelMap = Object.fromEntries(
  CONTACT_FORM_PLATFORM_TOPICS.map((item) => [item.value, item.label]),
) as Record<ContactTopic, string>

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function statusBadgeClass(status: ContactMessageStatus) {
  switch (status) {
    case 'new':
      return 'bg-primary/15 text-primary border-primary/25'
    case 'in_progress':
      return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/25'
    case 'resolved':
      return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/25'
  }
}

type DetailPanelProps = {
  message: AdminContactMessage
  onClose: () => void
}

function ContactMessageDetailPanel({ message, onClose }: DetailPanelProps) {
  const queryClient = useQueryClient()
  const { pushError, pushSuccess } = useAppToast()
  const [status, setStatus] = useState(message.status)
  const [internalNote, setInternalNote] = useState(message.internalNote ?? '')

  const saveMutation = useMutation({
    mutationFn: () =>
      updateAdminContactMessage(message.id, {
        status,
        internalNote: internalNote.trim() || undefined,
      }),
    onSuccess: () => {
      pushSuccess('Contact message updated.')
      void queryClient.invalidateQueries({ queryKey: ['admin', 'contact-messages'] })
      onClose()
    },
    onError: (err) => pushError(getApiErrorMessage(err)),
  })

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-h3 font-bold text-foreground">{message.fullName}</p>
          <p className="mt-1 text-ui text-muted-foreground">{topicLabelMap[message.topic]}</p>
          <p className="mt-2 text-caption text-muted-foreground">
            Received {formatWhen(message.createdAt)}
          </p>
        </div>
        <span
          className={cn(
            'rounded-full border px-3 py-1 text-caption font-semibold capitalize',
            statusBadgeClass(message.status),
          )}
        >
          {message.status.replace('_', ' ')}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={`mailto:${encodeURIComponent(message.email)}`}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-ui text-foreground hover:border-primary/40"
        >
          <Mail className="h-4 w-4 text-primary" />
          {message.email}
        </a>
        {message.phone ? (
          <a
            href={`tel:${message.phone.replace(/\s/g, '')}`}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-ui text-foreground hover:border-primary/40"
          >
            <Phone className="h-4 w-4 text-primary" />
            {message.phone}
          </a>
        ) : null}
      </div>

      <div className="mt-5 rounded-lg border border-border bg-secondary/30 p-4">
        <p className="text-ui font-semibold text-foreground">Message</p>
        <p className="mt-2 whitespace-pre-wrap text-ui leading-relaxed text-muted-foreground">
          {message.message}
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <label className="block text-ui font-medium text-foreground">
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ContactMessageStatus)}
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-ui"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-ui font-medium text-foreground">
          Internal note (team only)
          <textarea
            rows={3}
            value={internalNote}
            onChange={(e) => setInternalNote(e.target.value)}
            placeholder="Follow-up plan, owner, etc."
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-ui"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          type="button"
          disabled={saveMutation.isPending}
          onClick={() => saveMutation.mutate()}
        >
          {saveMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            'Save changes'
          )}
        </Button>
        <Button type="button" variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  )
}

/**
 * @description Platform admin inbox for public contact form submissions.
 */
export function AdminContactInboxPage() {
  const [statusFilter, setStatusFilter] = useState<ContactMessageStatus | 'all'>('all')
  const [topicFilter, setTopicFilter] = useState<ContactTopic | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filters = {
    status: statusFilter,
    topic: topicFilter,
    page: 1,
  }

  const { data, isLoading, error } = useQuery({
    queryKey: adminContactMessagesQueryKeyWithFilters(filters),
    queryFn: () =>
      fetchAdminContactMessages({
        ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
        ...(topicFilter !== 'all' ? { topic: topicFilter } : {}),
        page: 1,
        limit: 50,
      }),
  })

  const selectedMessage = data?.items.find((item) => item.id === selectedId) ?? null

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <p className="text-ui font-semibold tracking-[0.16em] text-primary uppercase">
          Platform admin
        </p>
        <h1 className="mt-2 font-display text-h1 font-bold text-foreground">Contact inbox</h1>
        <p className="mt-2 max-w-2xl text-body text-muted-foreground">
          Messages from the public Contact page. Update status as your team follows up.
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ContactMessageStatus | 'all')}
          className="rounded-lg border border-border bg-background px-3 py-2 text-ui"
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value as ContactTopic | 'all')}
          className="rounded-lg border border-border bg-background px-3 py-2 text-ui"
          aria-label="Filter by topic"
        >
          <option value="all">All topics</option>
          {CONTACT_FORM_PLATFORM_TOPICS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-ui text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading messages…
        </div>
      ) : null}

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-ui text-destructive">
          {getApiErrorMessage(error)}
        </p>
      ) : null}

      {data && data.items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-ui text-muted-foreground">
          No contact messages yet.
        </p>
      ) : null}

      {data && data.items.length > 0 ? (
        <ul className="space-y-3">
          {data.items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={cn(
                  'w-full rounded-xl border border-border bg-card p-4 text-left shadow-sm transition hover:border-primary/35',
                  selectedId === item.id && 'ring-2 ring-primary/30',
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-display text-ui font-semibold text-foreground">
                    {item.fullName}
                  </p>
                  <span
                    className={cn(
                      'rounded-full border px-2.5 py-0.5 text-caption font-semibold capitalize',
                      statusBadgeClass(item.status),
                    )}
                  >
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="mt-1 text-caption text-muted-foreground">
                  {item.email} · {topicLabelMap[item.topic]} · {formatWhen(item.createdAt)}
                </p>
                <p className="mt-2 line-clamp-2 text-ui text-muted-foreground">{item.message}</p>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {selectedMessage ? (
        <ContactMessageDetailPanel
          message={selectedMessage}
          onClose={() => setSelectedId(null)}
        />
      ) : null}
    </div>
  )
}
