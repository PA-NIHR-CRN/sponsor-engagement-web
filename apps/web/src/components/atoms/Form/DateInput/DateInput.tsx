import clsx from 'clsx'
import { forwardRef } from 'react'
import type { FieldErrors } from 'react-hook-form'

import { Fieldset } from '../Fieldset/Fieldset'
import { TextInput } from '../TextInput/TextInput'

interface DateInputProps {
  label?: string
  name: string
  required?: boolean
  errors: FieldErrors
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(({ label, errors, required, ...rest }, ref) => {
  const error = errors[rest.name]

  return (
    <div className="govuk-form-group">
      <Fieldset
        aria-describedby={clsx({
          [`${rest.name}-error`]: error,
        })}
        legend={label}
        role="group"
      >
        <div className="govuk-date-input">
          <div className="govuk-date-input__item">
            <TextInput
              errors={errors}
              inputClassName="govuk-input--width-2"
              label="Day"
              labelClassName="font-normal"
              ref={ref}
              required={required}
              {...rest}
            />
          </div>
          <div className="govuk-date-input__item">
            <TextInput
              errors={errors}
              inputClassName="govuk-input--width-2"
              label="Month"
              labelClassName="font-normal"
              ref={ref}
              required={required}
              {...rest}
            />
          </div>
          <div className="govuk-date-input__item">
            <TextInput
              errors={errors}
              inputClassName="govuk-input--width-4"
              label="Year"
              labelClassName="font-normal"
              ref={ref}
              required={required}
              {...rest}
            />
          </div>
        </div>
      </Fieldset>
    </div>
  )
})
