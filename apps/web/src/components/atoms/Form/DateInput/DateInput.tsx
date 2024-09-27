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
  ({ label, errors, required, value = { ...initialDateInputState }, onChange, disabled, ...rest }, ref) => {
    const dayError = errors[`${rest.name}-day`]
    const monthError = errors[`${rest.name}-month`]
    const yearError = errors[`${rest.name}-year`]
    const overallError = errors[rest.name]

    const handleInputChange = (event: React.FormEvent<HTMLInputElement>, type: keyof DateInputValue) => {
      const { value: inputValue } = event.currentTarget

      const newDate = {
        ...value,
        [type]: inputValue,
      }

      onChange(newDate)
    }

    return (
      <div
        className={clsx('govuk-form-group', {
          'govuk-form-group--error':
            Boolean(dayError) || Boolean(monthError) || Boolean(yearError) || Boolean(overallError),
        })}
      >
        <Fieldset
          aria-describedby={clsx({
            [`${rest.name}.day-error`]: dayError,
            [`${rest.name}.month-error`]: monthError,
            [`${rest.name}.year-error`]: yearError,
            [`${rest.name}-error`]: overallError,
          })}
          aria-disabled={disabled}
          disabled={disabled}
          id={rest.name}
          legend={label}
          name={rest.name}
          role="group"
        >
          <ErrorInline errors={errors} name={`${rest.name}-day`} />
          <ErrorInline errors={errors} name={`${rest.name}-month`} />
          <ErrorInline errors={errors} name={`${rest.name}-year`} />
          <ErrorInline errors={errors} name={rest.name} />

          <div className="govuk-date-input">
            <div className="govuk-date-input__item">
              <TextInput
                displayInlineError={false}
                // Conditional here is to trigger error state of input when there is an overall error
                errors={overallError ? { [`${rest.name}-day`]: overallError } : errors}
                inputClassName="govuk-input--width-2"
                label="Day"
                labelClassName="font-normal"
                onChange={(e) => {
                  handleInputChange(e, 'day')
                }}
                ref={ref}
                required={required}
                type="number"
                value={value.day}
                {...rest}
                disabled={disabled}
                id={`${rest.name}-day`}
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
                onChange={(e) => {
                  handleInputChange(e, 'month')
                }}
                ref={ref}
                required={required}
                type="number"
                value={value.month}
                {...rest}
                disabled={disabled}
                id={`${rest.name}-month`}
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
                onChange={(e) => {
                  handleInputChange(e, 'year')
                }}
                ref={ref}
                required={required}
                type="number"
                value={value.year}
                {...rest}
                disabled={disabled}
                id={`${rest.name}-year`}
                name={`${rest.name}-year`}
              />
            </div>
          </div>
        </Fieldset>
      </div>
    )
  }
)
