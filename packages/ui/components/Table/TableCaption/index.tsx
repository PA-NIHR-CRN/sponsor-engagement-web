import clsx from 'clsx'
import React from 'react'

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={clsx('govuk-table__caption govuk-table__caption--m', className)} {...props} />
  )
)

TableCaption.displayName = 'TableCaption'
