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
          <ErrorInline errors={errors} name={`${rest.name}-day`} />
          <ErrorInline errors={errors} name={`${rest.name}-month`} />
          <ErrorInline errors={errors} name={`${rest.name}-year`} />
          <ErrorInline errors={errors} name={rest.name} />

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
                onChange={(e) => {
                  handleInputChange(e, 'day')
                }}
                ref={ref}
                required={required}
                type="text"
                value={value.day}
                {...rest}
                disabled={disabled}
                id={`${rest.name}-day`}
                name={`${rest.name}-day`}
                pattern="[0-9]*"
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
                onChange={(e) => {
                  handleInputChange(e, 'month')
                }}
                ref={ref}
                required={required}
                type="text"
                value={value.month}
                {...rest}
                disabled={disabled}
                id={`${rest.name}-month`}
                maxLength={2}
                minLength={1}
                name={`${rest.name}-month`}
                pattern="[0-9]*"
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
                onChange={(e) => {
                  handleInputChange(e, 'year')
                }}
                ref={ref}
                required={required}
                type="text"
                value={value.year}
                {...rest}
                disabled={disabled}
                id={`${rest.name}-year`}
                name={`${rest.name}-year`}
                pattern="[0-9]*"
              />
            </div>
          </div>
        </Fieldset>
      </div>
    )
  }
)
