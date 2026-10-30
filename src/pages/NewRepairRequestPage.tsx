import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Camera,
  Cpu,
  Headphones,
  Laptop,
  Loader2,
  Smartphone,
  Tablet,
  Watch,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  createRepairRequest,
  customerRepairsQueryKey,
  uploadRepairImage,
  type DeviceType,
  type ImageAttachment,
  type IssueCategory,
  type Urgency,
} from '@/features/repairs/api/repairsApi'
import { useAppToast } from '@/components/shared/AppToastProvider'
import { getApiErrorMessage } from '@/lib/api-client'
import { scrollToFormField } from '@/lib/form-feedback'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const DEVICE_OPTIONS: { type: DeviceType; label: string; icon: typeof Smartphone }[] = [
  { type: 'phone', label: 'Smartphone', icon: Smartphone },
  { type: 'laptop', label: 'Laptop', icon: Laptop },
  { type: 'tablet', label: 'Tablet', icon: Tablet },
  { type: 'audio', label: 'Audio / Headphones', icon: Headphones },
  { type: 'smartwatch', label: 'Smartwatch', icon: Watch },
  { type: 'other', label: 'Other Device', icon: Cpu },
]

const ISSUE_OPTIONS: { category: IssueCategory; label: string }[] = [
  { category: 'screen', label: 'Cracked / Broken Screen' },
  { category: 'battery', label: 'Battery / Draining Issue' },
  { category: 'charging', label: 'Charging Port Fault' },
  { category: 'water_damage', label: 'Liquid / Water Damage' },
  { category: 'camera', label: 'Camera / Lens Fault' },
  { category: 'audio', label: 'Speaker / Microphone' },
  { category: 'software', label: 'Software / OS Crash' },
  { category: 'hardware', label: 'Motherboard / Internal Hardware' },
  { category: 'other', label: 'Other Problem' },
]

const URGENCY_OPTIONS: { level: Urgency; label: string; desc: string }[] = [
  { level: 'low', label: 'Flexible', desc: 'Can wait 1-2 weeks' },
  { level: 'medium', label: 'Standard', desc: 'Normal 2-4 days turnaround' },
  { level: 'high', label: 'Priority', desc: 'Need it fixed in 24-48 hours' },
  { level: 'immediate', label: 'Urgent', desc: 'Critical device, same-day if possible' },
]

export function NewRepairRequestPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [deviceType, setDeviceType] = useState<DeviceType>('phone')
  const [brand, setBrand] = useState('')
  const [modelName, setModelName] = useState('')
  const [issueCategory, setIssueCategory] = useState<IssueCategory>('screen')
  const [description, setDescription] = useState('')
  const [urgency, setUrgency] = useState<Urgency>('medium')
  const [images, setImages] = useState<ImageAttachment[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { pushError, pushSuccess, pushWarning } = useAppToast()

  const mutation = useMutation({
    mutationFn: createRepairRequest,
    onSuccess: () => {
      pushSuccess('Repair request submitted. Technicians can now send estimates.')
      void queryClient.invalidateQueries({ queryKey: customerRepairsQueryKey })
      navigate('/dashboard')
    },
    onError: (err) => pushError(getApiErrorMessage(err)),
  })

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (images.length + files.length > 5) {
      pushWarning('You can upload a maximum of 5 images.')
      return
    }

    setIsUploading(true)

    try {
      const uploadPromises = Array.from(files).map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      })

      const base64List = await Promise.all(uploadPromises)

      for (const base64 of base64List) {
        const uploaded = await uploadRepairImage(base64)
        setImages((prev) => [...prev, uploaded])
      }
    } catch {
      pushError('Failed to upload one or more images. Please try again.')
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  function handleRemoveImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!brand.trim()) {
      pushError('Please enter the device brand (e.g. Apple, Samsung).')
      scrollToFormField('brand')
      return
    }

    if (!modelName.trim()) {
      pushError('Please enter the device model (e.g. iPhone 14 Pro, ThinkPad X1).')
      scrollToFormField('modelName')
      return
    }

    if (description.trim().length < 10) {
      pushError('Please describe the problem in at least 10 characters.')
      scrollToFormField('description')
      return
    }

    mutation.mutate({
      deviceType,
      brand: brand.trim(),
      modelName: modelName.trim(),
      issueCategory,
      description: description.trim(),
      urgency,
      images,
    })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Back button & Header */}
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-ui font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Repairs</span>
        </Link>
        <h1 className="mt-3 font-display text-h2 font-bold tracking-tight text-foreground">
          New Repair Request
        </h1>
        <p className="mt-1 text-ui text-muted-foreground">
          Provide device and issue details so certified technicians can review and submit preliminary estimates.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Device Category */}
        <section className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-h3 font-semibold text-foreground">
            1. Select Device Type
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {DEVICE_OPTIONS.map((opt) => {
              const Icon = opt.icon
              const selected = deviceType === opt.type
              return (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setDeviceType(opt.type)}
                  className={`flex flex-col items-center justify-center gap-2.5 rounded-xl border p-4 text-center transition ${
                    selected
                      ? 'border-primary bg-primary/10 text-primary shadow-sm'
                      : 'border-border bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-ui font-medium">{opt.label}</span>
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
            <div className="space-y-1.5" data-field-key="brand">
              <label htmlFor="brand" className="text-ui font-medium text-foreground">
                Brand / Manufacturer *
              </label>
              <Input
                id="brand"
                placeholder="e.g. Apple, Samsung, Lenovo, Dell"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5" data-field-key="modelName">
              <label htmlFor="modelName" className="text-ui font-medium text-foreground">
                Model Name / Number *
              </label>
              <Input
                id="modelName"
                placeholder="e.g. iPhone 14 Pro, XPS 13 9310"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                required
              />
            </div>
          </div>
        </section>

        {/* Step 2: Problem Description */}
        <section className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-h3 font-semibold text-foreground">
            2. Problem & Diagnosis Details
          </h2>

          <div className="space-y-2">
            <label className="text-ui font-medium text-foreground">
              Primary Issue Category *
            </label>
            <div className="flex flex-wrap gap-2">
              {ISSUE_OPTIONS.map((opt) => {
                const selected = issueCategory === opt.category
                return (
                  <button
                    key={opt.category}
                    type="button"
                    onClick={() => setIssueCategory(opt.category)}
                    className={`rounded-lg border px-3 py-1.5 text-ui font-medium transition ${
                      selected
                        ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                        : 'border-border bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-1.5" data-field-key="description">
            <div className="flex justify-between">
              <label htmlFor="description" className="text-ui font-medium text-foreground">
                Detailed Problem Description *
              </label>
              <span className="text-caption text-muted-foreground">
                {description.length} / 3000
              </span>
            </div>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain how the damage happened, symptoms (flickering screen, no power, touch dead zone), previous repair history, etc."
              className="w-full rounded-lg border border-border bg-card p-3 text-ui text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
        </section>

        {/* Step 3: Urgency & Image Attachments */}
        <section className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-h3 font-semibold text-foreground">
            3. Urgency & Damage Photos
          </h2>

          <div className="space-y-2">
            <label className="text-ui font-medium text-foreground">Turnaround Urgency</label>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {URGENCY_OPTIONS.map((opt) => {
                const selected = urgency === opt.level
                return (
                  <button
                    key={opt.level}
                    type="button"
                    onClick={() => setUrgency(opt.level)}
                    className={`flex items-start gap-3 rounded-lg border p-3 text-left transition ${
                      selected
                        ? 'border-primary bg-primary/10 shadow-sm'
                        : 'border-border bg-secondary/30 hover:bg-secondary'
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                        selected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border'
                      }`}
                    >
                      {selected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className="text-ui font-medium text-foreground">{opt.label}</p>
                      <p className="text-caption text-muted-foreground">{opt.desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Photo Upload Area */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-ui font-medium text-foreground">
                Device Photos (Max 5)
              </label>
              <span className="text-caption text-muted-foreground">
                {images.length}/5 uploaded
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="group relative h-24 w-full overflow-hidden rounded-lg border border-border bg-secondary/50"
                >
                  <img
                    src={img.url}
                    alt={`Damage preview ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-80 transition hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <label className="flex h-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary/30 text-muted-foreground transition hover:border-primary/50 hover:bg-secondary hover:text-foreground">
                  {isUploading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  ) : (
                    <>
                      <Camera className="h-5 w-5" />
                      <span className="mt-1 text-[11px] font-medium">+ Add Photo</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={isUploading}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-caption text-muted-foreground">
              Clear photos of the front, back, or damaged area help technicians give accurate estimates.
            </p>
          </div>
        </section>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard')}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={mutation.isPending || isUploading}
            className="gap-2 px-6"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Submitting Request...</span>
              </>
            ) : (
              <span>Submit Request</span>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
