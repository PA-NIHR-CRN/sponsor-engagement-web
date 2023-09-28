import clsx from 'clsx'
import type { ReactNode } from 'react'

export interface CardProps {
  padding?: 0 | 1 | 2 | 3 | 4 | 5
  children: ReactNode
  filled?: boolean
  className?: string
}

export function Card({ children, padding = 3, filled, className }: CardProps) {
  return (
    <div
      className={clsx(`govuk-!-padding-${padding} relative`, className, {
        'bg-white border-grey-120 border border-b-2': !filled,
        'bg-grey-50': filled,
      })}
    >
      {children}
    </div>
  )
}
