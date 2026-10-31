import * as React from 'react'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const scrollAreaVariants = cva('relative overflow-hidden', {
  variants: {
    orientation: {
      vertical: 'h-full',
      horizontal: 'w-full',
      both: 'h-full w-full',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
})

const scrollBarVariants = cva('flex touch-none select-none transition-colors', {
  variants: {
    orientation: {
      vertical: 'h-full w-2.5 border-l border-l-transparent p-px',
      horizontal: 'h-2.5 w-full border-t border-t-transparent p-px',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
})

export type ScrollAreaProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Root
> &
  VariantProps<typeof scrollAreaVariants> & {
    scrollHideDelay?: number
    type?: 'auto' | 'always' | 'scroll' | 'hover'
  }

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(
  (
    {
      className,
      children,
      orientation,
      scrollHideDelay = 600,
      type = 'hover',
      ...props
    },
    ref,
  ) => (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn(scrollAreaVariants({ orientation }), className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport className="size-full rounded-[inherit]">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar
        orientation="vertical"
        type={type}
        scrollHideDelay={scrollHideDelay}
      />
      {orientation === 'horizontal' || orientation === 'both' ? (
        <ScrollBar
          orientation="horizontal"
          type={type}
          scrollHideDelay={scrollHideDelay}
        />
      ) : null}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  ),
)
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

type ScrollBarProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.ScrollAreaScrollbar
> & {
  scrollHideDelay?: number
  type?: 'auto' | 'always' | 'scroll' | 'hover'
}

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(({ className, orientation = 'vertical', scrollHideDelay, type, ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(scrollBarVariants({ orientation }), 'hover:bg-accent', className)}
    {...(scrollHideDelay !== undefined ? { scrollHideDelay } : {})}
    {...(type !== undefined ? { type } : {})}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border transition-colors hover:bg-foreground/30" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar, scrollAreaVariants }
