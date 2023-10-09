import clsx from 'clsx'
import React from 'react'

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => <td ref={ref} className={clsx('govuk-table__cell', className)} {...props} />
)

TableCell.displayName = 'TableCell'
