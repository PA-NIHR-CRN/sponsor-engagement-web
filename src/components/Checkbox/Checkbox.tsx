import clsx from 'clsx'
import { HTMLProps, useId } from 'react'

type CheckboxProps = {
  small?: boolean
} & HTMLProps<HTMLInputElement>

export function Checkbox({ small, className, children, ...checkboxProps }: CheckboxProps) {
  const id = useId()
  return (
    <div className={clsx('govuk-checkboxes__item', 'float-none', className)}>
      <input {...checkboxProps} id={id} className="govuk-checkboxes__input" type="checkbox" />
      <label
        className={clsx('govuk-label govuk-checkboxes__label', 'pr-0', { 'pt-[12px] text-sm': small })}
        htmlFor={id}
      >
        {children}
      </label>
    </div>
  )
}
