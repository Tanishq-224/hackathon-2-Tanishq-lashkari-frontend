import { Clock, ShieldCheck, UserRound } from 'lucide-react'

import type { EstimateItem } from '@/features/repairs/api/repairsApi'
import { estimateStatusLabel } from '@/features/repairs/lib/estimate-status'
import { formatUsd } from '@/lib/format-money'
import { cn } from '@/lib/utils'

type EstimateReportViewProps = {
  estimate: EstimateItem
  className?: string
}

/**
 * @description Read-only itemized estimate report (form-style layout).
 * @param {EstimateReportViewProps} props - Estimate record to render.
 * @returns {JSX.Element}
 */
export function EstimateReportView({ estimate, className }: EstimateReportViewProps) {
  const hasBreakdown =
    Array.isArray(estimate.componentLines) && estimate.componentLines.length > 0
  const partsTotal = hasBreakdown
    ? estimate.componentLines!.reduce((sum, line) => sum + line.price, 0)
    : 0
  const labour = estimate.labourCost ?? 0
  const computedTotal = hasBreakdown ? partsTotal + labour : estimate.maxCost

  return (
    <div className={cn('space-y-6', className)}>
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <p className="text-caption font-semibold uppercase tracking-wider text-primary">
          Preliminary estimate report
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-caption font-medium text-foreground">
            <UserRound className="size-3.5 text-primary" aria-hidden />
            {estimate.vendorName}
          </div>
          <div className="inline-flex items-center gap-2 text-caption text-muted-foreground">
            <Clock className="size-3.5 text-primary" aria-hidden />
            Turnaround: <strong className="text-foreground">{estimate.turnaroundTime}</strong>
          </div>
          <div className="inline-flex items-center gap-2 text-caption text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" aria-hidden />
            Coverage up to{' '}
            <strong className="text-foreground">{estimate.warrantyMonths} months</strong>
          </div>
          {estimateStatusLabel(estimate.status) ? (
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
              {estimateStatusLabel(estimate.status)}
            </span>
          ) : null}
        </div>
        {estimate.declineReason ? (
          <p className="mt-3 text-ui text-muted-foreground">
            Customer note:{' '}
            <span className="text-foreground">{estimate.declineReason}</span>
          </p>
        ) : null}
      </div>

      {hasBreakdown ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border bg-secondary/40 px-5 py-3">
            <h3 className="font-display text-ui font-semibold text-foreground">
              Possible damage components
            </h3>
          </div>
          <div className="divide-y divide-border">
            {estimate.componentLines!.map((line, index) => (
              <div
                key={`${line.component}-${index}`}
                className="grid gap-3 px-5 py-4 sm:grid-cols-[1.4fr_repeat(2,minmax(0,7rem))]"
              >
                <div>
                  <p className="text-caption font-medium uppercase tracking-wide text-muted-foreground">
                    Component
                  </p>
                  <p className="mt-1 text-ui font-semibold text-foreground">{line.component}</p>
                </div>
                <div>
                  <p className="text-caption font-medium uppercase tracking-wide text-muted-foreground">
                    Price
                  </p>
                  <p className="mt-1 text-ui font-semibold text-foreground">
                    {formatUsd(line.price)}
                  </p>
                </div>
                <div>
                  <p className="text-caption font-medium uppercase tracking-wide text-muted-foreground">
                    Warranty
                  </p>
                  <p className="mt-1 text-ui font-semibold text-foreground">
                    {line.warrantyMonths} mo
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t border-border bg-secondary/20 px-5 py-4">
            <div className="flex items-center justify-between text-ui">
              <span className="text-muted-foreground">Parts subtotal</span>
              <span className="font-semibold text-foreground">{formatUsd(partsTotal)}</span>
            </div>
            <div className="flex items-center justify-between text-ui">
              <span className="text-muted-foreground">Labour</span>
              <span className="font-semibold text-foreground">{formatUsd(labour)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border/80 pt-3 text-ui">
              <span className="font-semibold text-foreground">Estimated total</span>
              <span className="font-display text-h3 font-bold text-primary">
                {formatUsd(computedTotal)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-caption font-medium uppercase tracking-wide text-muted-foreground">
            Estimated cost range
          </p>
          <p className="mt-2 font-display text-h2 font-bold text-primary">
            {formatUsd(estimate.minCost)} – {formatUsd(estimate.maxCost)}
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h3 className="font-display text-ui font-semibold text-foreground">
          Repair plan & notes
        </h3>
        <p className="mt-3 whitespace-pre-wrap text-ui leading-relaxed text-foreground/90">
          {estimate.notes}
        </p>
      </div>
    </div>
  )
}
