import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * @description Card surface for marketing and dashboard content blocks.
 * @param {React.ComponentProps<'div'> & { size?: 'default' | 'sm' }} props - Card div props and size variant.
 * @returns {JSX.Element} Card container.
 */
function Card({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<'div'> & { size?: 'default' | 'sm' }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        'theme-marketing-card group/card flex flex-col gap-(--card-spacing) overflow-hidden py-(--card-spacing) text-sm [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl',
        className,
      )}
      {...props}
    />
  )
}

/**
 * @description Top region of a card with title and optional actions.
 * @param {React.ComponentProps<'div'>} props - Header div props.
 * @returns {JSX.Element} Card header.
 */
function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)',
        className,
      )}
      {...props}
    />
  )
}

/**
 * @description Primary card heading text.
 * @param {React.ComponentProps<'div'>} props - Title div props.
 * @returns {JSX.Element} Card title.
 */
function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        'text-base leading-snug font-medium group-data-[size=sm]/card:text-sm',
        className,
      )}
      {...props}
    />
  )
}

/**
 * @description Supporting description under a card title.
 * @param {React.ComponentProps<'div'>} props - Description div props.
 * @returns {JSX.Element} Card description.
 */
function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

/**
 * @description Optional action slot aligned in the card header.
 * @param {React.ComponentProps<'div'>} props - Action div props.
 * @returns {JSX.Element} Card action area.
 */
function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  )
}

/**
 * @description Main card body content area.
 * @param {React.ComponentProps<'div'>} props - Content div props.
 * @returns {JSX.Element} Card content.
 */
function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-(--card-spacing)', className)}
      {...props}
    />
  )
}

/**
 * @description Footer strip for card actions or metadata.
 * @param {React.ComponentProps<'div'>} props - Footer div props.
 * @returns {JSX.Element} Card footer.
 */
function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        'flex items-center rounded-b-xl border-t bg-muted/50 p-(--card-spacing)',
        className,
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
