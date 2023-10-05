import clsx from 'clsx'
import React from 'react'

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={clsx('govuk-table__head', className)} {...props} />
)

TableHeader.displayName = 'TableHeader'
