import { CheckCircle2 } from 'lucide-react'

import type { RepairStatus } from '@/features/repairs/api/repairsApi'
import { cn } from '@/lib/utils'

const WORKFLOW_STEPS: { status: RepairStatus; label: string; hint: string }[] = [
  { status: 'submitted', label: 'Submitted', hint: 'Ticket opened' },
  { status: 'estimated', label: 'Estimates', hint: 'Quotes received' },
  { status: 'vendor_selected', label: 'Assigned', hint: 'Technician chosen' },
  { status: 'diagnosed', label: 'Diagnosis', hint: 'Bench inspection' },
  { status: 'quote_approved', label: 'Approved', hint: 'Final quote signed' },
  { status: 'in_repair', label: 'In repair', hint: 'Work in progress' },
  { status: 'ready_for_pickup', label: 'Pickup', hint: 'Ready to collect' },
  { status: 'completed', label: 'Completed', hint: 'Closed' },
]

function getStepIndex(status: RepairStatus): number {
  switch (status) {
    case 'submitted':
      return 0
    case 'estimated':
      return 1
    case 'vendor_selected':
      return 2
    case 'diagnosed':
      return 3
    case 'quote_approved':
      return 4
    case 'in_repair':
      return 5
    case 'ready_for_pickup':
      return 6
    case 'completed':
      return 7
    case 'cancelled':
      return -1
    default:
      return 0
  }
}

type RepairLifecycleTimelineProps = {
  status: RepairStatus
}

/**
 * @description Professional repair lifecycle stepper for the ticket detail page.
 * @param {RepairLifecycleTimelineProps} props - Current repair status.
 * @returns {JSX.Element}
 */
export function RepairLifecycleTimeline({ status }: RepairLifecycleTimelineProps) {
  const currentStep = getStepIndex(status)
  const progress =
    currentStep < 0 ? 0 : Math.min(100, (currentStep / (WORKFLOW_STEPS.length - 1)) * 100)

  if (status === 'cancelled') {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-ui text-destructive">
        This repair was cancelled and is no longer active in the lifecycle.
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-ui font-semibold uppercase tracking-wider text-muted-foreground">
            Repair lifecycle
          </h2>
          <p className="mt-1 text-caption text-muted-foreground">
            Step {Math.max(currentStep + 1, 1)} of {WORKFLOW_STEPS.length} ·{' '}
            <span className="font-semibold text-primary">
              {WORKFLOW_STEPS[currentStep]?.label ?? status}
            </span>
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-caption font-semibold text-primary">
          {Math.round(progress)}% complete
        </span>
      </div>

      <div className="relative mt-6 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {WORKFLOW_STEPS.map((step, index) => {
          const isPast = index < currentStep
          const isCurrent = index === currentStep
          return (
            <li
              key={step.status}
              className={cn(
                'rounded-xl border px-3 py-3 transition',
                isCurrent && 'border-primary/50 bg-primary/10 shadow-sm ring-1 ring-primary/20',
                isPast && 'border-emerald-500/35 bg-emerald-500/5',
                !isPast && !isCurrent && 'border-border bg-secondary/30',
              )}
            >
              <div className="flex items-start gap-2.5">
                <span
                  className={cn(
                    'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-caption font-bold',
                    isPast && 'bg-emerald-500 text-white',
                    isCurrent && 'bg-primary text-primary-foreground',
                    !isPast && !isCurrent && 'bg-muted text-muted-foreground',
                  )}
                >
                  {isPast ? <CheckCircle2 className="size-4" aria-hidden /> : index + 1}
                </span>
                <div className="min-w-0">
                  <p
                    className={cn(
                      'text-ui font-semibold',
                      isCurrent ? 'text-primary' : 'text-foreground',
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="text-caption text-muted-foreground">{step.hint}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
