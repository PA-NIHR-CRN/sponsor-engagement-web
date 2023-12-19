import clsx from 'clsx'
import type { ReactNode } from 'react'

export interface FieldsetProps extends React.HTMLProps<HTMLFieldSetElement> {
  children: ReactNode
  legend?: string
  legendSize?: 's' | 'm' | 'l'
  className?: string
}

export function Fieldset({ children, legend, legendSize = 'm', className, ...props }: FieldsetProps) {
  return (
    <div className={clsx('govuk-form-group', className)}>
      <fieldset className="govuk-fieldset" {...props}>
        {legend ? (
          <legend className={`govuk-fieldset__legend govuk-fieldset__legend--${legendSize}`}>{legend}</legend>
        ) : null}
        {children}
      </fieldset>
    </div>
  )
}
