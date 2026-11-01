import { Loader2, Plus, Send, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { DynamicSubmitEstimatePayload } from '@/features/repairs/api/repairsApi'
import { useAppToast } from '@/components/shared/AppToastProvider'
import { dynamicEstimateFormSchema } from '@/features/repairs/lib/dynamic-estimate-form-schema'
import { scrollToFormField } from '@/lib/form-feedback'
import { parseMoneyInput } from '@/lib/validation/fields'
import { formatUsd } from '@/lib/format-money'

type ComponentRow = {
  id: string
  component: string
  price: string
  warrantyMonths: string
}

type DynamicEstimateFormProps = {
  deviceLabel: string
  issueLabel: string
  isSubmitting?: boolean
  mode?: 'create' | 'edit'
  initialValues?: DynamicSubmitEstimatePayload
  onSubmit: (payload: DynamicSubmitEstimatePayload) => Promise<void>
  onCancel?: () => void
}

function rowsFromInitialValues(initial?: DynamicSubmitEstimatePayload): ComponentRow[] {
  if (!initial?.componentLines?.length) {
    return [createRow(), createRow()]
  }
  return initial.componentLines.map((line) => ({
    id: crypto.randomUUID(),
    component: line.component,
    price: String(line.price),
    warrantyMonths: String(line.warrantyMonths),
  }))
}

function createRow(): ComponentRow {
  return {
    id: crypto.randomUUID(),
    component: '',
    price: '',
    warrantyMonths: '6',
  }
}

/**
 * @description Full-width dynamic estimate form with component rows, labour, and notes.
 * @param {DynamicEstimateFormProps} props - Context labels and submit handler.
 * @returns {JSX.Element}
 */
export function DynamicEstimateForm({
  deviceLabel,
  issueLabel,
  isSubmitting = false,
  mode = 'create',
  initialValues,
  onSubmit,
  onCancel,
}: DynamicEstimateFormProps) {
  const { pushError, pushSuccess } = useAppToast()
  const [rows, setRows] = useState<ComponentRow[]>(() => rowsFromInitialValues(initialValues))
  const [labourCost, setLabourCost] = useState(
    initialValues ? String(initialValues.labourCost ?? '') : '',
  )
  const [turnaroundTime, setTurnaroundTime] = useState(initialValues?.turnaroundTime ?? '24 Hours')
  const [notes, setNotes] = useState(initialValues?.notes ?? '')

  const totals = useMemo(() => {
    const parts = rows.reduce((sum, row) => {
      const value = parseFloat(row.price)
      return sum + (Number.isFinite(value) ? value : 0)
    }, 0)
    const labour = parseFloat(labourCost)
    const labourValue = Number.isFinite(labour) ? labour : 0
    return { parts, labour: labourValue, total: parts + labourValue }
  }, [rows, labourCost])

  function updateRow(id: string, patch: Partial<ComponentRow>) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    )
  }

  function removeRow(id: string) {
    setRows((current) => (current.length <= 1 ? current : current.filter((row) => row.id !== id)))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const componentLines = rows.map((row, index) => {
      const price = parseMoneyInput(row.price)
      const warrantyMonths = Number.parseInt(row.warrantyMonths, 10)
      return {
        component: row.component,
        price: price ?? Number.NaN,
        warrantyMonths: Number.isFinite(warrantyMonths) ? warrantyMonths : Number.NaN,
        _index: index,
      }
    })

    const labourParsed = parseMoneyInput(labourCost)
    const parsed = dynamicEstimateFormSchema.safeParse({
      componentLines: componentLines.map(({ component, price, warrantyMonths }) => ({
        component,
        price,
        warrantyMonths,
      })),
      labourCost: labourParsed ?? Number.NaN,
      turnaroundTime,
      notes,
    })

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]
      const path = firstIssue?.path
      let fieldKey = 'notes'
      if (path?.[0] === 'componentLines' && typeof path[1] === 'number') {
        const rowIndex = path[1]
        const field = path[2]
        fieldKey =
          field === 'price'
            ? `component-${rowIndex}-price`
            : field === 'warrantyMonths'
              ? `component-${rowIndex}-warranty`
              : `component-${rowIndex}`
      } else if (path?.[0] === 'labourCost') {
        fieldKey = 'labourCost'
      } else if (path?.[0] === 'turnaroundTime') {
        fieldKey = 'turnaroundTime'
      }
      pushError(firstIssue?.message ?? 'Please check the estimate form.')
      scrollToFormField(fieldKey)
      return
    }

    try {
      await onSubmit(parsed.data)
      pushSuccess(mode === 'edit' ? 'Estimate updated.' : 'Estimate submitted to the customer.')
    } catch {
      // Caller may toast API errors separately
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <header className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-sm">
        <p className="text-caption font-semibold uppercase tracking-wider text-primary">
          Dynamic preliminary proposal
        </p>
        <h1 className="mt-2 font-display text-h2 font-bold text-foreground">{deviceLabel}</h1>
        <p className="mt-1 text-ui text-muted-foreground">
          Issue: <span className="capitalize text-foreground">{issueLabel}</span>
        </p>
        <p className="mt-3 max-w-2xl text-ui text-muted-foreground">
          List each possible damaged component with price and warranty. Add labour and a clear
          description before sending the estimate to the customer dashboard.
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-h3 font-semibold text-foreground">
              Damage components
            </h2>
            <p className="mt-1 text-caption text-muted-foreground">
              Add one row per part or subsystem you expect to replace or repair.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => setRows((r) => [...r, createRow()])}>
            <Plus className="mr-1.5 size-4" aria-hidden />
            Add component
          </Button>
        </div>

        <div className="mt-5 space-y-4">
          {rows.map((row, index) => (
            <div
              key={row.id}
              data-field-key={`component-${index}`}
              className="rounded-xl border border-border/80 bg-secondary/20 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                  Component {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove component ${index + 1}`}
                  disabled={rows.length <= 1}
                  onClick={() => removeRow(row.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="sm:col-span-2 lg:col-span-2">
                  <label className="text-caption font-medium text-foreground">Component *</label>
                  <Input
                    value={row.component}
                    onChange={(event) => updateRow(row.id, { component: event.target.value })}
                    placeholder="e.g. OLED display assembly"
                    className="mt-1"
                  />
                </div>
                <div data-field-key={`component-${index}-price`}>
                  <label className="text-caption font-medium text-foreground">Price ($) *</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={row.price}
                    onChange={(event) => updateRow(row.id, { price: event.target.value })}
                    placeholder="85"
                    className="mt-1"
                  />
                </div>
                <div data-field-key={`component-${index}-warranty`}>
                  <label className="text-caption font-medium text-foreground">Warranty (mo) *</label>
                  <Input
                    type="number"
                    min="0"
                    max="60"
                    value={row.warrantyMonths}
                    onChange={(event) =>
                      updateRow(row.id, { warrantyMonths: event.target.value })
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
        <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div data-field-key="labourCost">
            <label className="text-caption font-medium text-foreground">Labour cost ($) *</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={labourCost}
              onChange={(event) => setLabourCost(event.target.value)}
              placeholder="45"
              className="mt-1 max-w-xs"
            />
          </div>
          <div data-field-key="turnaroundTime">
            <label className="text-caption font-medium text-foreground">
              Estimated turnaround *
            </label>
            <Input
              value={turnaroundTime}
              onChange={(event) => setTurnaroundTime(event.target.value)}
              placeholder="24 Hours, 2–3 business days"
              className="mt-1"
            />
          </div>
          <div data-field-key="notes">
            <label className="text-caption font-medium text-foreground">
              Description & repair plan *
            </label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={5}
              placeholder="Diagnostic steps, calibration, quality checks, and customer-facing notes…"
              className="mt-1 w-full rounded-xl border border-input bg-background p-3 text-ui text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-primary/30 bg-primary/5 p-5 shadow-sm">
          <p className="text-caption font-semibold uppercase tracking-wide text-primary">
            Estimate preview
          </p>
          <dl className="mt-4 space-y-2 text-ui">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Parts</dt>
              <dd className="font-semibold text-foreground">{formatUsd(totals.parts)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Labour</dt>
              <dd className="font-semibold text-foreground">{formatUsd(totals.labour)}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-primary/20 pt-3">
              <dt className="font-semibold text-foreground">Total</dt>
              <dd className="font-display text-h3 font-bold text-primary">
                {formatUsd(totals.total)}
              </dd>
            </div>
          </dl>
        </aside>
      </section>

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-4">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={isSubmitting} className="min-w-[12rem]">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
              Submitting…
            </>
          ) : (
            <>
              <Send className="mr-2 size-4" aria-hidden />
              {mode === 'edit' ? 'Save changes' : 'Send estimate'}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
