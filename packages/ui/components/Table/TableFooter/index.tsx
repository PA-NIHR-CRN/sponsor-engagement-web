import clsx from 'clsx'
import React from 'react'

export const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={clsx('bg-primary font-medium text-primary-foreground', className)} {...props} />
  )
)

TableFooter.displayName = 'TableFooter'
