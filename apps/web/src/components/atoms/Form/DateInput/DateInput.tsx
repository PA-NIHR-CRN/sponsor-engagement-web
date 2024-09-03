import clsx from 'clsx'
import { forwardRef } from 'react'
import type { FieldErrors } from 'react-hook-form'

import { ErrorInline } from '../ErrorInline/ErrorInline'
import { Fieldset } from '../Fieldset/Fieldset'
import { TextInput } from '../TextInput/TextInput'
import type { DateFieldType, DateInputValue } from './utils'
import { constructISODateFromParts, initialDateInputState } from './utils'

interface DateInputProps {
  label?: string
  name: string
  value?: DateInputValue
  required?: boolean
  errors: FieldErrors
  onChange: (value?: string) => void
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ label, errors, required, value = { ...initialDateInputState }, onChange, ...rest }, ref) => {
    const error = errors[rest.name]

    const handleInputChange = (event: React.FormEvent<HTMLInputElement>, type: DateFieldType) => {
      const { value: inputValue } = event.currentTarget

      const newDate = {
        ...value,
        [type]: inputValue,
      }

      const formattedDate = constructISODateFromParts(newDate)

      // Reset to undefined if values have been removed
      if (formattedDate === '--') {
        onChange(undefined)
        return
      }

      onChange(formattedDate)
    }

    return (
      <div className={clsx('govuk-form-group', { 'govuk-form-group--error': Boolean(error) })}>
        <Fieldset
          aria-describedby={clsx({
            [`${rest.name}-error`]: error,
          })}
          legend={label}
          name={rest.name}
          role="group"
        >
          <ErrorInline errors={errors} name={rest.name} />

          <div className="govuk-date-input">
            <div className="govuk-date-input__item">
              <TextInput
                errors={errors}
                inputClassName="govuk-input--width-2"
                inputMode="numeric"
                label="Day"
                labelClassName="font-normal"
                onChange={(e) => {
                  handleInputChange(e, 'day')
                }}
                ref={ref}
                required={required}
                value={value.day}
                {...rest}
                name={`${rest.name}-day`}
              />
            </div>
            <div className="govuk-date-input__item">
              <TextInput
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
                value={value.month}
                {...rest}
                name={`${rest.name}-month`}
              />
            </div>
            <div className="govuk-date-input__item">
              <TextInput
                errors={errors}
                inputClassName="govuk-input--width-4"
                inputMode="numeric"
                label="Year"
                labelClassName="font-normal"
                onChange={(e) => {
                  handleInputChange(e, 'year')
                }}
                ref={ref}
                required={required}
                value={value.year}
                {...rest}
                name={`${rest.name}-year`}
              />
            </div>
          </div>
        </Fieldset>
      </div>
    )
  }
)
