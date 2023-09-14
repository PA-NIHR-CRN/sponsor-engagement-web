import clsx from 'clsx'
import { ReactNode } from 'react'

export function Fieldset({
  children,
  legend,
  legendSize = 'm',
  className,
  ...props
}: {
  children: ReactNode
  legend?: string
  legendSize?: 's' | 'm' | 'l'
  className?: string
}) {
  return (
    <div className={clsx('govuk-form-group', className)}>
      <fieldset className="govuk-fieldset" {...props}>
        {legend && <legend className={`govuk-fieldset__legend govuk-fieldset__legend--${legendSize}`}>{legend}</legend>}
        {children}
      </fieldset>
    </div>
  )
}
