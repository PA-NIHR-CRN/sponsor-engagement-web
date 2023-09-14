import clsx from 'clsx'
import { ComponentProps, ElementType, ReactNode } from 'react'

type CardProps<Element extends ElementType = ElementType> = {
  /** Content to be rendered within the Card */
  children: ReactNode
  /** Custom class name for the Card element */
  className?: string
  /** Element/component/tag the Card will be rendered as (default: <div>) */
  as?: Element
} & ComponentProps<Element>

export function Card<Element extends ElementType = 'div'>({ children, className, as, ...props }: CardProps<Element>) {
  const Component = as ?? 'div'
  return (
    <Component className={clsx('shadow-card flex h-full flex-col bg-white', className)} {...props}>
      {children}
    </Component>
  )
}
