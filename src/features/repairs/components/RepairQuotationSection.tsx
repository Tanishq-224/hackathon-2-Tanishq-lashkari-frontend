import { useState } from 'react'
import {
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  Plus,
  Receipt,
  ShieldCheck,
  Trash2,
  Wrench,
  XCircle,
} from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  decideQuotationRequest,
  fetchRepairQuotation,
  repairDetailQueryKey,
  repairQuotationQueryKey,
  submitDiagnosisRequest,
  withdrawQuotationRequest,
  type LineItemCategory,
  type QuotationLineItem,
  type RepairItem,
} from '@/features/repairs/api/repairsApi'
import { useAppToast } from '@/components/shared/AppToastProvider'
import { getApiErrorMessage } from '@/lib/api-client'
import { formatUsd } from '@/lib/format-money'
import { cn } from '@/lib/utils'

type RepairQuotationSectionProps = {
  repair: RepairItem
  userRole?: 'customer' | 'vendor' | 'admin'
  userId?: string
}

export function RepairQuotationSection({
  repair,
  userRole,
  userId,
}: RepairQuotationSectionProps) {
  const queryClient = useQueryClient()
  const { pushError, pushSuccess, pushWarning } = useAppToast()
  const [isEditingQuotation, setIsEditingQuotation] = useState(false)

  // Vendor quotation form states
  const [diagnosticFindings, setDiagnosticFindings] = useState('')
  const [estimatedCompletion, setEstimatedCompletion] = useState('2-3 Days')
  const [lineItems, setLineItems] = useState<QuotationLineItem[]>([
    { description: 'OEM Replacement Display Assembly', category: 'parts', cost: 120 },
    { description: 'Precision Diagnostic & Bench Labor', category: 'labor', cost: 40 },
  ])

  // Customer decision states
  const [showDeclineModal, setShowDeclineModal] = useState(false)
  const [declineFeedback, setDeclineFeedback] = useState('')

  const isAssignedVendor =
    (userRole === 'vendor' && repair.assignedVendorId === userId) || userRole === 'admin'
  /** Matches POST /quotation/decision — customer role only, ticket owner. */
  const canAuthorizeQuotation =
    userRole === 'customer' &&
    Boolean(userId) &&
    repair.customerId === userId

  const { data: quotation, isLoading } = useQuery({
    queryKey: repairQuotationQueryKey(repair.id),
    queryFn: () => fetchRepairQuotation(repair.id),
    enabled: ['vendor_selected', 'diagnosed', 'quote_approved', 'in_repair', 'ready_for_pickup', 'completed', 'cancelled'].includes(repair.status),
  })

  const submitDiagnosisMutation = useMutation({
    mutationFn: () =>
      submitDiagnosisRequest(repair.id, {
        diagnosticFindings,
        lineItems,
        estimatedCompletion,
      }),
    onSuccess: () => {
      pushSuccess('Quotation sent to the customer for approval.')
      setIsEditingQuotation(false)
      void queryClient.invalidateQueries({ queryKey: repairDetailQueryKey(repair.id) })
      void queryClient.invalidateQueries({ queryKey: repairQuotationQueryKey(repair.id) })
    },
    onError: (err) => pushError(getApiErrorMessage(err)),
  })

  const withdrawQuotationMutation = useMutation({
    mutationFn: () => withdrawQuotationRequest(repair.id),
    onSuccess: (data) => {
      pushSuccess(data.message ?? 'Quotation withdrawn.')
      setIsEditingQuotation(false)
      void queryClient.invalidateQueries({ queryKey: repairDetailQueryKey(repair.id) })
      void queryClient.invalidateQueries({ queryKey: repairQuotationQueryKey(repair.id) })
    },
    onError: (err) => pushError(getApiErrorMessage(err)),
  })

  const decideMutation = useMutation({
    mutationFn: ({ decision, feedback }: { decision: 'approved' | 'rejected'; feedback?: string }) =>
      decideQuotationRequest(repair.id, { decision, feedback }),
    onSuccess: (data) => {
      pushSuccess(data.message ?? 'Quotation decision recorded.')
      setShowDeclineModal(false)
      void queryClient.invalidateQueries({ queryKey: repairDetailQueryKey(repair.id) })
      void queryClient.invalidateQueries({ queryKey: repairQuotationQueryKey(repair.id) })
    },
    onError: (err) => pushError(getApiErrorMessage(err)),
  })

  const activeQuotation =
    quotation && quotation.status !== 'withdrawn' ? quotation : null

  function beginQuotationEdit() {
    if (!activeQuotation) return
    setDiagnosticFindings(activeQuotation.diagnosticFindings)
    setEstimatedCompletion(activeQuotation.estimatedCompletion)
    setLineItems(
      activeQuotation.lineItems.length
        ? activeQuotation.lineItems
        : [{ description: '', category: 'parts', cost: 0 }],
    )
    setIsEditingQuotation(true)
  }

  const showVendorQuotationForm =
    isAssignedVendor &&
    (!activeQuotation || quotation?.status === 'withdrawn' || isEditingQuotation)

  // Handlers for dynamic line items
  function addLineItem() {
    setLineItems((prev) => [
      ...prev,
      { description: '', category: 'parts', cost: 0 },
    ])
  }

  function removeLineItem(index: number) {
    if (lineItems.length <= 1) {
      pushWarning('A quotation must contain at least one line item.')
      return
    }
    setLineItems((prev) => prev.filter((_, i) => i !== index))
  }

  function updateLineItem(
    index: number,
    field: keyof QuotationLineItem,
    value: string | number,
  ) {
    setLineItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item
        return { ...item, [field]: value }
      }),
    )
  }

  const computedTotal = lineItems.reduce(
    (sum, item) => sum + (Number(item.cost) || 0),
    0,
  )

  function handleVendorSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (diagnosticFindings.trim().length < 10) {
      pushError('Diagnostic findings must be at least 10 characters long.')
      return
    }

    if (lineItems.length === 0) {
      pushError('Must include at least one itemized line item.')
      return
    }

    for (let i = 0; i < lineItems.length; i++) {
      const it = lineItems[i]
      if (!it.description.trim()) {
        pushError(`Line item #${i + 1} description is required.`)
        return
      }
      if (isNaN(it.cost) || it.cost < 0) {
        pushError(`Line item #${i + 1} cost cannot be negative.`)
        return
      }
    }

    if (!estimatedCompletion.trim()) {
      pushError('Please provide an estimated completion turnaround.')
      return
    }

    submitDiagnosisMutation.mutate()
  }

  // If the repair has not reached vendor assignment, do not show quotation stage
  if (repair.status === 'submitted' || repair.status === 'estimated') {
    return null
  }

  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Receipt className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-h3 font-semibold text-foreground">
              Physical Diagnosis & Itemized Quotation
            </h2>
            <p className="text-caption text-muted-foreground">
              Official cost breakdown based on physical bench inspection
            </p>
          </div>
        </div>

        {quotation && (
          <div className="flex items-center gap-2">
            {quotation.status === 'pending' && (
              <span className="rounded-full bg-amber-500/15 px-3 py-1 text-caption font-bold text-amber-600 dark:text-amber-400">
                Awaiting Customer Approval
              </span>
            )}
            {quotation.status === 'approved' && (
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-caption font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="h-3.5 w-3.5" />
                Quote Approved & Authorized
              </span>
            )}
            {quotation.status === 'rejected' && (
              <span className="flex items-center gap-1.5 rounded-full bg-rose-500/15 px-3 py-1 text-caption font-bold text-rose-600 dark:text-rose-400">
                <XCircle className="h-3.5 w-3.5" />
                Quote Declined
              </span>
            )}
            {quotation.status === 'withdrawn' && (
              <span className="rounded-full bg-muted px-3 py-1 text-caption font-bold text-muted-foreground">
                Withdrawn by technician
              </span>
            )}
          </div>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="mt-6 flex items-center justify-center py-8 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-ui">Retrieving diagnosis records...</span>
        </div>
      )}

      {/* Case 1: No quotation yet, but assigned vendor is looking at ticket */}
      {!isLoading && showVendorQuotationForm && (
        <form onSubmit={handleVendorSubmit} className="mt-6 space-y-6">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <h3 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
              <Wrench className="h-4 w-4 text-primary" />
              Technician Physical Inspection Bench
            </h3>
            <p className="mt-1 text-caption text-muted-foreground">
              Please inspect the device, confirm actual component damage, and provide an itemized quote of hardware parts and labor charges.
            </p>
          </div>

          <div>
            <label className="block text-ui font-medium text-foreground">
              Diagnostic Inspection Findings
            </label>
            <textarea
              required
              rows={3}
              value={diagnosticFindings}
              onChange={(e) => setDiagnosticFindings(e.target.value)}
              placeholder="e.g. OLED digitizer damaged. Motherboard power rails tested normal. Battery health at 88%. Internal water indicators negative."
              className="mt-1.5 w-full rounded-lg border border-border bg-background p-3 text-ui text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Line items table builder */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-ui font-medium text-foreground">
                Itemized Cost Breakdown
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLineItem}
                className="gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Item
              </Button>
            </div>

            <div className="mt-3 space-y-3">
              {lineItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 rounded-lg border border-border bg-secondary/30 p-3 sm:flex-row sm:items-center"
                >
                  <div className="flex-1">
                    <Input
                      placeholder="Item description (e.g. OEM Display)"
                      value={item.description}
                      onChange={(e) =>
                        updateLineItem(index, 'description', e.target.value)
                      }
                      className="text-ui"
                    />
                  </div>

                  <div className="w-full sm:w-36">
                    <select
                      value={item.category}
                      onChange={(e) =>
                        updateLineItem(
                          index,
                          'category',
                          e.target.value as LineItemCategory,
                        )
                      }
                      className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-ui shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="parts">Part</option>
                      <option value="labor">Labor</option>
                      <option value="consumable">Consumable</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="w-full sm:w-32">
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-ui text-muted-foreground">
                        $
                      </span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={item.cost || ''}
                        onChange={(e) =>
                          updateLineItem(
                            index,
                            'cost',
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="pl-7 text-ui"
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLineItem(index)}
                    disabled={lineItems.length <= 1}
                    className="text-muted-foreground hover:text-rose-500"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Subtotal & Estimated Completion */}
            <div className="mt-4 flex flex-col gap-4 rounded-lg bg-secondary/50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="w-full sm:w-64">
                <label className="block text-caption font-medium text-foreground">
                  Estimated Repair Time
                </label>
                <Input
                  value={estimatedCompletion}
                  onChange={(e) => setEstimatedCompletion(e.target.value)}
                  placeholder="e.g. 24 Hours, 2 Days"
                  className="mt-1 text-ui"
                />
              </div>

              <div className="text-right">
                <span className="text-caption uppercase text-muted-foreground">
                  Total Quotation Amount
                </span>
                <p className="text-h3 font-bold text-foreground">
                  ${computedTotal.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitDiagnosisMutation.isPending}
            className="w-full sm:w-auto gap-2"
          >
            {submitDiagnosisMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting Quotation...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                {isEditingQuotation ? 'Save revised quotation' : 'Submit official quotation to customer'}
              </>
            )}
          </Button>
        </form>
      )}

      {/* Case 2: Customer waiting for assigned technician to submit diagnosis */}
      {!isLoading &&
        !activeQuotation &&
        !isAssignedVendor &&
        quotation?.status !== 'withdrawn' && (
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
            <Clock className="h-6 w-6" />
          </div>
          <h3 className="mt-3 font-display text-base font-semibold text-foreground">
            Physical Diagnostic Inspection in Progress
          </h3>
          <p className="mt-1 max-w-md text-ui text-muted-foreground">
            {repair.assignedVendorName || 'Your assigned technician'} is currently running diagnostic bench tests on your device. You will receive an itemized parts & labor quotation here before any repair is authorized.
          </p>
        </div>
      )}

      {/* Case 3: Quotation has been submitted -> Customer & Vendor can inspect receipt */}
      {!isLoading && quotation?.status === 'withdrawn' && !isAssignedVendor && (
        <div className="mt-6 rounded-lg border border-dashed border-border bg-secondary/20 p-6 text-center text-ui text-muted-foreground">
          The technician withdrew the previous quote and is preparing a revised itemized quotation.
        </div>
      )}

      {!isLoading && activeQuotation && !isEditingQuotation && (
        <div className="mt-6 space-y-6">
          {/* Diagnostic Findings Card */}
          <div className="rounded-lg border border-border bg-secondary/20 p-4">
            <h4 className="flex items-center gap-2 font-display text-ui font-semibold text-foreground">
              <FileText className="h-4 w-4 text-primary" />
              Technician Diagnostic Findings
            </h4>
            <p className="mt-2 whitespace-pre-wrap text-ui leading-relaxed text-foreground/90">
              {quotation.diagnosticFindings}
            </p>
            <div className="mt-3 flex items-center gap-4 text-caption text-muted-foreground">
              <span>Inspected by: <strong className="text-foreground">{quotation.vendorName}</strong></span>
              <span>Turnaround: <strong className="text-foreground">{quotation.estimatedCompletion}</strong></span>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-left text-ui">
              <thead className="border-b border-border bg-secondary/50 text-caption font-semibold uppercase text-muted-foreground">
                <tr>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Description</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(quotation.lineItems ?? []).map((item, i) => (
                  <tr key={i} className="hover:bg-secondary/10">
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          'rounded-md px-2 py-0.5 text-caption font-semibold uppercase',
                          item.category === 'parts' && 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
                          item.category === 'labor' && 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
                          item.category === 'consumable' && 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
                          item.category === 'other' && 'bg-secondary text-muted-foreground',
                        )}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">
                      {item.description}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-foreground">
                      {formatUsd(item.cost)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-border bg-secondary/30">
                <tr>
                  <td colSpan={2} className="py-3 px-4 font-bold text-foreground">
                    Total Authorized Amount
                  </td>
                  <td className="py-3 px-4 text-right font-display text-h3 font-bold text-foreground">
                    {formatUsd(quotation.totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Customer Action Area (Pending Approval) */}
          {quotation.status === 'pending' &&
            !canAuthorizeQuotation &&
            userRole !== 'vendor' && (
              <div className="rounded-lg border border-border bg-secondary/30 p-4 text-ui text-muted-foreground">
                This quotation is awaiting approval from the customer who owns this repair
                ticket.
              </div>
            )}

          {activeQuotation.status === 'pending' && isAssignedVendor && (
            <div className="flex flex-wrap gap-2 border-t border-border pt-4">
              <Button variant="outline" size="sm" onClick={beginQuotationEdit}>
                Edit quotation
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={withdrawQuotationMutation.isPending}
                onClick={() => withdrawQuotationMutation.mutate()}
                className="text-rose-600 hover:bg-rose-500/10"
              >
                Withdraw quotation
              </Button>
            </div>
          )}

          {activeQuotation.status === 'pending' && canAuthorizeQuotation && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 text-primary shrink-0" />
                <div>
                  <h4 className="font-display text-base font-semibold text-foreground">
                    Customer Authorization Required
                  </h4>
                  <p className="mt-1 text-ui text-muted-foreground">
                    Please review the itemized breakdown. Authorizing this quote permits the technician to order replacement parts and proceed with the repair. You will only be billed the approved amount upon satisfactory completion.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => decideMutation.mutate({ decision: 'approved' })}
                  disabled={decideMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                >
                  {decideMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  Approve & Authorize Repair ({formatUsd(quotation.totalAmount)})
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowDeclineModal(true)}
                  disabled={decideMutation.isPending}
                  className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 gap-1.5"
                >
                  <XCircle className="h-4 w-4" />
                  Decline Quote
                </Button>
              </div>

              {/* Decline Feedback Box */}
              {showDeclineModal && (
                <div className="mt-4 rounded-lg border border-border bg-background p-4 space-y-3">
                  <label className="block text-ui font-medium text-foreground">
                    Reason for Declining (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={declineFeedback}
                    onChange={(e) => setDeclineFeedback(e.target.value)}
                    placeholder="e.g. Price is too high, decided to buy a new device, etc."
                    className="w-full rounded-md border border-border bg-background p-2.5 text-ui text-foreground placeholder:text-muted-foreground focus:border-rose-500 focus:outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        decideMutation.mutate({
                          decision: 'rejected',
                          feedback: declineFeedback,
                        })
                      }
                      disabled={decideMutation.isPending}
                    >
                      Confirm Decline & Cancel Repair
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDeclineModal(false)}
                    >
                      Back
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Approved status view */}
          {activeQuotation.status === 'approved' && (
            <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-300">
              <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="font-semibold text-ui">
                  Repair Authorized for {formatUsd(quotation.totalAmount)}
                </p>
                <p className="text-caption text-muted-foreground">
                  The quotation was approved
                  {quotation.customerDecisionAt &&
                    ` on ${new Date(quotation.customerDecisionAt).toLocaleDateString()}`}
                  . Technician is now proceeding with repair work.
                </p>
              </div>
            </div>
          )}

          {/* Rejected status view */}
          {activeQuotation.status === 'rejected' && (
            <div className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-rose-700 dark:text-rose-300">
              <XCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
              <div>
                <p className="font-semibold text-ui">
                  Quotation Declined
                </p>
                <p className="text-caption text-muted-foreground">
                  Customer opted not to proceed with the repair. Ticket has been closed.
                  {quotation.customerFeedback && ` Note: "${quotation.customerFeedback}"`}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

