import * as React from 'react'

import clsx from 'clsx'

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, children }, ref) => (
    <div className="w-full">
      <table ref={ref} className={clsx('govuk-table', className)}>
        {children}
      </table>
    </div>
  )
)

export const TableFooter = ({ children }: { children: React.ReactNode }) => {
  return <tfoot>{children}</tfoot>
}

Table.displayName = 'Table'
