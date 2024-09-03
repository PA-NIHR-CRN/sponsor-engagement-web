import clsx from 'clsx'
import { forwardRef } from 'react'
import type { FieldErrors } from 'react-hook-form'

import { ErrorInline } from '../ErrorInline/ErrorInline'
import { Fieldset } from '../Fieldset/Fieldset'
import { TextInput } from '../TextInput/TextInput'

interface DateInputProps {
  label?: string
  name: string
  value?: string
  required?: boolean
  errors: FieldErrors
  onChange: (value?: string) => void
}

export const parseIntoDateParts = (date?: string) => {
  if (!date) return { year: '', month: '', day: '' }

  const [year, month, day] = date.split('-')
  return { year, month, day }
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ label, errors, required, value = '', onChange, ...rest }, ref) => {
    const error = errors[rest.name]

    const dateInputValue = parseIntoDateParts(value)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value: inputValue } = e.target
      const currentDateParts = parseIntoDateParts(value)

      const newDate = {
        ...currentDateParts,
        [name]: inputValue,
      }

      const formattedDate = `${newDate.year || ''}-${newDate.month || ''}-${newDate.day || ''}`

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
                label="Day"
                labelClassName="font-normal"
                onChange={handleInputChange}
                ref={ref}
                required={required}
                value={dateInputValue.day}
                {...rest}
                name="day"
              />
            </div>
            <div className="govuk-date-input__item">
              <TextInput
                errors={errors}
                inputClassName="govuk-input--width-2"
                label="Month"
                labelClassName="font-normal"
                onChange={handleInputChange}
                ref={ref}
                required={required}
                value={dateInputValue.month}
                {...rest}
                name="month"
              />
            </div>
            <div className="govuk-date-input__item">
              <TextInput
                errors={errors}
                inputClassName="govuk-input--width-4"
                label="Year"
                labelClassName="font-normal"
                onChange={handleInputChange}
                ref={ref}
                required={required}
                value={dateInputValue.year}
                {...rest}
                name="year"
              />
            </div>
          </div>
        </Fieldset>
      </div>
    )
  }
)
