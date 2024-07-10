import clsx from 'clsx'
import React from 'react'

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => <tr ref={ref} className={clsx('govuk-table__row', className)} {...props} />
)

TableRow.displayName = 'TableRow'
