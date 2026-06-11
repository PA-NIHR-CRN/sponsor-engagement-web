import clsx from 'clsx'
import { forwardRef } from 'react'
import type { FieldErrors } from 'react-hook-form'

import { ErrorInline } from '../ErrorInline/ErrorInline'
import { Fieldset } from '../Fieldset/Fieldset'
import { TextInput } from '../TextInput/TextInput'
import type { DateInputValue } from './types'

interface DateInputProps {
  label?: string
  name: string
  hint?: string
  value?: DateInputValue
  required?: boolean
  errors: FieldErrors
  disabled?: boolean
  onChange: (value: DateInputValue) => void
}

const initialDateInputState: DateInputValue = {
  year: '',
  month: '',
  day: '',
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ label, hint, errors, required, value = { ...initialDateInputState }, onChange, disabled, ...rest }, ref) => {
    const getError = (path: string) => {
      const direct = (errors as any)?.[path]
      if (direct) return direct
      return path.split('.').reduce<any>((acc, key) => acc?.[key], errors)
    }

    const dayError = getError(`${rest.name}.day`) ?? getError(`${rest.name}-day`)
    const monthError = getError(`${rest.name}.month`) ?? getError(`${rest.name}-month`)
    const yearError = getError(`${rest.name}.year`) ?? getError(`${rest.name}-year`)
    const overallError = getError(rest.name)

    const handleInputChange = (event: React.FormEvent<HTMLInputElement>, type: keyof DateInputValue) => {
      const { value: inputValue } = event.currentTarget
      const valueWithNumericsOnly = inputValue.replace(/\D/g, '')

      onChange({
        ...value,
        [type]: valueWithNumericsOnly,
      })
    }

    return (
      <div
        className={clsx('govuk-form-group', {
          'govuk-form-group--error': Boolean(dayError) || Boolean(monthError) || Boolean(yearError) || Boolean(overallError),
        })}
      >
        <Fieldset
          aria-describedby={clsx({
            [`${rest.name}-day-error`]: dayError,
            [`${rest.name}-month-error`]: monthError,
            [`${rest.name}-year-error`]: yearError,
            [`${rest.name}-error`]: overallError,
          })}
          aria-disabled={disabled}
          disabled={disabled}
          hint={hint}
          id={rest.name}
          legend={label}
          name={rest.name}
          role="group"
        >
          <ErrorInline errors={errors} name={`${rest.name}.day`} />
          <ErrorInline errors={errors} name={`${rest.name}.month`} />
          <ErrorInline errors={errors} name={`${rest.name}.year`} />
          <ErrorInline errors={errors} name={rest.name} />

          <div className="govuk-date-input">
            <div className="govuk-date-input__item">
              <TextInput
                displayInlineError={false}
                errors={overallError ? { [`${rest.name}-day`]: overallError } : errors}
                inputClassName="govuk-input--width-2"
                label="Day"
                labelClassName="font-normal"
                onChange={(e) => { handleInputChange(e, 'day'); }}
                ref={ref}
                required={required}
                type="text"
                value={value.day}
                {...rest}
                disabled={disabled}
                id={`${rest.name}-day`}
                inputMode="numeric"
                name={`${rest.name}-day`}
              />
            </div>

            <div className="govuk-date-input__item">
              <TextInput
                displayInlineError={false}
                errors={overallError ? { [`${rest.name}-month`]: overallError } : errors}
                inputClassName="govuk-input--width-2"
                label="Month"
                labelClassName="font-normal"
                onChange={(e) => { handleInputChange(e, 'month'); }}
                ref={ref}
                required={required}
                type="text"
                value={value.month}
                {...rest}
                disabled={disabled}
                id={`${rest.name}-month`}
                inputMode="numeric"
                name={`${rest.name}-month`}
              />
            </div>

            <div className="govuk-date-input__item">
              <TextInput
                displayInlineError={false}
                errors={overallError ? { [`${rest.name}-year`]: overallError } : errors}
                inputClassName="govuk-input--width-4"
                label="Year"
                labelClassName="font-normal"
                onChange={(e) => { handleInputChange(e, 'year'); }}
                ref={ref}
                required={required}
                type="text"
                value={value.year}
                {...rest}
                disabled={disabled}
                id={`${rest.name}-year`}
                inputMode="numeric"
                name={`${rest.name}-year`}
              />
            </div>
          </div>
        </Fieldset>
      </div>
    )
  }
)