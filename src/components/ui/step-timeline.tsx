import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Check, Clock, X } from 'lucide-react'

import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

const timelineVariants = cva('relative flex flex-col', {
  variants: {
    variant: {
      default: 'gap-4',
      compact: 'gap-2',
      spacious: 'gap-8',
    },
    orientation: {
      vertical: 'flex-col',
      horizontal: 'flex-row',
    },
  },
  defaultVariants: {
    variant: 'default',
    orientation: 'vertical',
  },
})

const timelineItemVariants = cva('relative flex gap-3 pb-2', {
  variants: {
    orientation: {
      vertical: 'flex-row',
      horizontal: 'min-w-[16.5rem] shrink-0 flex-col sm:min-w-64',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
})

const timelineConnectorVariants = cva('bg-border', {
  variants: {
    orientation: {
      vertical: 'absolute top-9 left-3 h-full w-px',
      horizontal: 'absolute top-3 left-8 h-px w-full',
    },
    status: {
      default: 'bg-border',
      completed: 'bg-primary',
      active: 'bg-primary',
      pending: 'bg-muted-foreground/30',
      error: 'bg-destructive',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
    status: 'default',
  },
})

const timelineIconVariants = cva(
  'flex size-6 shrink-0 items-center justify-center rounded-full border-2 bg-background text-xs font-medium',
  {
    variants: {
      status: {
        default: 'border-border text-muted-foreground',
        completed: 'border-primary bg-primary text-primary-foreground',
        active: 'animate-pulse border-primary bg-background text-primary',
        pending: 'border-muted-foreground/30 text-muted-foreground',
        error: 'border-destructive bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants: {
      status: 'default',
    },
  },
)

export type StepTimelineItem = {
  id: string
  title: string
  description?: string
  timestamp?: string | Date
  status?: 'default' | 'completed' | 'active' | 'pending' | 'error'
  icon?: React.ReactNode
  content?: React.ReactNode
}

export type StepTimelineProps = VariantProps<typeof timelineVariants> & {
  items: StepTimelineItem[]
  className?: string
  showConnectors?: boolean
  showTimestamps?: boolean
  timestampPosition?: 'top' | 'bottom' | 'inline'
}

function getStatusIcon(status: StepTimelineItem['status']) {
  switch (status) {
    case 'completed':
      return <Check className="size-3" aria-hidden />
    case 'active':
    case 'pending':
      return <Clock className="size-3" aria-hidden />
    case 'error':
      return <X className="size-3" aria-hidden />
    default:
      return <div className="size-2 rounded-full bg-current" aria-hidden />
  }
}

function formatTimestamp(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

/**
 * @description Vertical or horizontal step timeline (About journey on mobile/tablet).
 */
export function StepTimeline({
  items,
  className,
  variant,
  orientation = 'vertical',
  showConnectors = true,
  showTimestamps = true,
  timestampPosition = 'top',
}: StepTimelineProps) {
  const timelineContent = (
    <div
      className={cn(
        timelineVariants({ variant, orientation }),
        orientation === 'horizontal' ? 'pb-4' : '',
      )}
    >
      {items.map((item, index) => (
        <div
          key={item.id}
          data-journey-step={item.id}
          className={cn(timelineItemVariants({ orientation }))}
        >
          {showConnectors && index < items.length - 1 ? (
            <div
              className={cn(
                timelineConnectorVariants({
                  orientation,
                  status: item.status,
                }),
              )}
            />
          ) : null}

          <div className="relative z-10 flex shrink-0">
            <div className={cn(timelineIconVariants({ status: item.status }))}>
              {item.icon ?? getStatusIcon(item.status)}
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            {showTimestamps && timestampPosition === 'top' && item.timestamp ? (
              <time className="text-caption text-muted-foreground">
                {formatTimestamp(item.timestamp)}
              </time>
            ) : null}

            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-ui font-semibold leading-tight text-foreground">
                {item.title}
              </h3>
              {showTimestamps && timestampPosition === 'inline' && item.timestamp ? (
                <time className="shrink-0 text-caption text-muted-foreground">
                  {formatTimestamp(item.timestamp)}
                </time>
              ) : null}
            </div>

            {item.description ? (
              <p className="text-ui leading-relaxed text-muted-foreground">{item.description}</p>
            ) : null}

            {item.content ? <div className="mt-2">{item.content}</div> : null}

            {showTimestamps && timestampPosition === 'bottom' && item.timestamp ? (
              <time className="text-caption text-muted-foreground">
                {formatTimestamp(item.timestamp)}
              </time>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )

  if (orientation === 'horizontal') {
    return (
      <ScrollArea orientation="horizontal" className={cn('w-full', className)}>
        {timelineContent}
      </ScrollArea>
    )
  }

  return <div className={className}>{timelineContent}</div>
}
