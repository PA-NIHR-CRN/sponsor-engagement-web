import clsx from 'clsx'
import React from 'react'

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tbody ref={ref} className={clsx('govuk-table__body', className)} {...props} />
)

TableBody.displayName = 'TableBody'
