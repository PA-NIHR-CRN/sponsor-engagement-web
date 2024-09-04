import clsx from 'clsx'
import { forwardRef } from 'react'
import type { FieldErrors } from 'react-hook-form'

import { ErrorInline } from '../ErrorInline/ErrorInline'
import { Fieldset } from '../Fieldset/Fieldset'
import { TextInput } from '../TextInput/TextInput'
import type { DateFieldType, DateInputValue } from './utils'
import { initialDateInputState } from './utils'

interface DateInputProps {
  label?: string
  name: string
  value?: DateInputValue
  required?: boolean
  errors: FieldErrors
  disabled?: boolean
  onChange: (value: DateInputValue) => void
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ label, errors, required, value = { ...initialDateInputState }, onChange, disabled, ...rest }, ref) => {
    const error = errors[rest.name]

    const handleInputChange = (event: React.FormEvent<HTMLInputElement>, type: DateFieldType) => {
      const { value: inputValue } = event.currentTarget

      const newDate = {
        ...value,
        [type]: inputValue,
      }

      onChange(newDate)
    }

    return (
      <div className={clsx('govuk-form-group', { 'govuk-form-group--error': Boolean(error) })}>
        <Fieldset
          aria-describedby={clsx({
            [`${rest.name}-error`]: error,
          })}
          aria-disabled={disabled}
          disabled={disabled}
          legend={label}
          name={rest.name}
          role="group"
        >
          <ErrorInline errors={errors} name={rest.name} />

          <div className="govuk-date-input">
            <div className="govuk-date-input__item">
              <TextInput
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
                value={value.day}
                {...rest}
                disabled={disabled}
                name={`${rest.name}-day`}
              />
            </div>
            <div className="govuk-date-input__item">
              <TextInput
                inputClassName="govuk-input--width-2"
                inputMode="numeric"
                label="Month"
                labelClassName="font-normal"
                onChange={(e) => {
                  handleInputChange(e, 'month')
                }}
                ref={ref}
                required={required}
                value={value.month}
                {...rest}
                disabled={disabled}
                maxLength={2}
                minLength={1}
                name={`${rest.name}-month`}
              />
            </div>
            <div className="govuk-date-input__item">
              <TextInput
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
                value={value.year}
                {...rest}
                disabled={disabled}
                name={`${rest.name}-year`}
              />
            </div>
          </div>
        </Fieldset>
      </div>
    )
  }
)
