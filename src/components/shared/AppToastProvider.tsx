import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  AlertTriangle,
  Check,
  Info,
  Sparkles,
  X,
  XCircle,
} from 'lucide-react'

import type { FormFeedbackType } from '@/lib/form-feedback'
import { cn } from '@/lib/utils'

type ToastItem = {
  id: string
  type: FormFeedbackType
  title: string
  description: string
}

type PushToastOptions = {
  title?: string
  description: string
}

type AppToastContextValue = {
  pushToast: (type: FormFeedbackType, options: PushToastOptions | string) => void
  pushError: (description: string, title?: string) => void
  pushSuccess: (description: string, title?: string) => void
  pushInfo: (description: string, title?: string) => void
  pushWarning: (description: string, title?: string) => void
}

const AppToastContext = createContext<AppToastContextValue | null>(null)

const TOAST_DEFAULT_TITLE: Record<FormFeedbackType, string> = {
  info: 'Information',
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
}

const TOAST_STYLES: Record<
  FormFeedbackType,
  {
    titleClass: string
    iconWrap: string
    Icon: typeof Info
  }
> = {
  info: {
    titleClass: 'text-sky-600 dark:text-sky-400',
    iconWrap: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
    Icon: Info,
  },
  success: {
    titleClass: 'text-emerald-600 dark:text-emerald-400',
    iconWrap: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    Icon: Check,
  },
  error: {
    titleClass: 'text-rose-600 dark:text-rose-400',
    iconWrap: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
    Icon: XCircle,
  },
  warning: {
    titleClass: 'text-amber-600 dark:text-amber-400',
    iconWrap: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    Icon: AlertTriangle,
  },
}

function normalizeToastInput(
  type: FormFeedbackType,
  options: PushToastOptions | string,
): { title: string; description: string } {
  if (typeof options === 'string') {
    return { title: TOAST_DEFAULT_TITLE[type], description: options }
  }
  return {
    title: options.title ?? TOAST_DEFAULT_TITLE[type],
    description: options.description,
  }
}

/**
 * @description Global toast stack (reference-style cards) for validation and API feedback.
 * @param {{ children: ReactNode }} props - App tree.
 * @returns {JSX.Element}
 */
export function AppToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = useCallback(
    (type: FormFeedbackType, options: PushToastOptions | string) => {
      const { title, description } = normalizeToastInput(type, options)
      const id = crypto.randomUUID()
      setToasts((current) => [...current, { id, type, title, description }])
      window.setTimeout(() => dismissToast(id), 6000)
    },
    [dismissToast],
  )

  const value = useMemo<AppToastContextValue>(
    () => ({
      pushToast,
      pushError: (description, title) =>
        pushToast('error', title ? { title, description } : description),
      pushSuccess: (description, title) =>
        pushToast('success', title ? { title, description } : description),
      pushInfo: (description, title) =>
        pushToast('info', title ? { title, description } : description),
      pushWarning: (description, title) =>
        pushToast('warning', title ? { title, description } : description),
    }),
    [pushToast],
  )

  return (
    <AppToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-3 top-4 z-[120] flex flex-col gap-3 sm:inset-x-auto sm:right-5 sm:top-5 sm:w-[min(100%,22rem)]"
      >
        {toasts.map((toast) => {
          const style = TOAST_STYLES[toast.type]
          const Icon = toast.title === 'Message Title' ? Sparkles : style.Icon

          return (
            <div
              key={toast.id}
              role="alert"
              className={cn(
                'pointer-events-auto relative flex gap-3 rounded-lg border border-border/80 bg-card px-4 py-3.5 shadow-lg',
                'animate-in slide-in-from-top-2 fade-in duration-200',
              )}
            >
              <div
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-full',
                  style.iconWrap,
                )}
              >
                <Icon aria-hidden className="size-[18px] stroke-[2.5]" />
              </div>

              <div className="min-w-0 flex-1 pr-6">
                <p className={cn('font-semibold leading-tight', style.titleClass)}>
                  {toast.title}
                </p>
                <p className="mt-1 text-ui leading-snug text-muted-foreground">
                  {toast.description}
                </p>
              </div>

              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => dismissToast(toast.id)}
                className="absolute right-2.5 top-2.5 rounded-md p-1 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
          )
        })}
      </div>
    </AppToastContext.Provider>
  )
}

/**
 * @description Reads the global toast API from context.
 * @returns {AppToastContextValue}
 */
export function useAppToast(): AppToastContextValue {
  const context = useContext(AppToastContext)
  if (!context) {
    throw new Error('useAppToast must be used within AppToastProvider')
  }
  return context
}
