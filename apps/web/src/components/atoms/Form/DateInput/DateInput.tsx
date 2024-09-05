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
    const dayError = errors.day
    const monthError = errors.month
    const yearError = errors.year

    const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
      const { name: fieldName, value: inputValue } = event.currentTarget

      const newDate = {
        ...value,
        [fieldName]: inputValue,
      }

      onChange(newDate)
    }

    return (
      <div
        className={clsx('govuk-form-group', {
          'govuk-form-group--error': Boolean(dayError) || Boolean(monthError) || Boolean(yearError),
        })}
      >
        <Fieldset
          aria-describedby={clsx({
            [`${rest.name}.day-error`]: dayError,
            [`${rest.name}.month-error`]: monthError,
            [`${rest.name}.year-error`]: yearError,
          })}
          aria-disabled={disabled}
          disabled={disabled}
          legend={label}
          name={rest.name}
          role="group"
        >
          <ErrorInline errors={errors} name="day" />
          <ErrorInline errors={errors} name="month" />
          <ErrorInline errors={errors} name="year" />

          <div className="govuk-date-input">
            <div className="govuk-date-input__item">
              <TextInput
                displayInlineError={false}
                errors={errors}
                inputClassName="govuk-input--width-2"
                inputMode="numeric"
                label="Day"
                labelClassName="font-normal"
                maxLength={2}
                minLength={1}
                onChange={handleInputChange}
                ref={ref}
                required={required}
                value={value.day}
                {...rest}
                disabled={disabled}
                name="day"
              />
            </div>
            <div className="govuk-date-input__item">
              <TextInput
                displayInlineError={false}
                errors={errors}
                inputClassName="govuk-input--width-2"
                inputMode="numeric"
                label="Month"
                labelClassName="font-normal"
                onChange={handleInputChange}
                ref={ref}
                required={required}
                value={value.month}
                {...rest}
                disabled={disabled}
                maxLength={2}
                minLength={1}
                name="month"
              />
            </div>
            <div className="govuk-date-input__item">
              <TextInput
                displayInlineError={false}
                errors={errors}
                inputClassName="govuk-input--width-4"
                inputMode="numeric"
                label="Year"
                labelClassName="font-normal"
                maxLength={4}
                minLength={4}
                onChange={handleInputChange}
                ref={ref}
                required={required}
                value={value.year}
                {...rest}
                disabled={disabled}
                name="year"
              />
            </div>
          </div>
        </Fieldset>
      </div>
    )
  }
)
