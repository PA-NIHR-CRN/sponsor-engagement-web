import clsx from 'clsx'
import React from 'react'

type TableCellHeaderProps = {
  column?: boolean
} & React.ThHTMLAttributes<HTMLTableCellElement>

export const TableCellHeader = React.forwardRef<HTMLTableCellElement, TableCellHeaderProps>(
  ({ className, column, ...props }, ref) => (
    <th ref={ref} className={clsx('govuk-table__header', className)} scope={column ? 'col' : 'row'} {...props} />
  )
)
TableCellHeader.displayName = 'TableCellHeader'
