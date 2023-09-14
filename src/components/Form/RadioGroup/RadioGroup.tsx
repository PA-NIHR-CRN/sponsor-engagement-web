import clsx from 'clsx'
import { Children, cloneElement, forwardRef, isValidElement, ReactNode } from 'react'
import { FieldErrors } from 'react-hook-form'

import { ErrorInline } from '../ErrorInline/ErrorInline'
import { Fieldset } from '../Fieldset/Fieldset'

type RadioGroupProps = {
  children: ReactNode
  label?: string
  name: string
  hint?: ReactNode
  required?: boolean
  errors: FieldErrors
  defaultValue: string | undefined
}

export const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
  ({ children, label, errors, hint, defaultValue, required = true, ...rest }, ref) => {
    const error = errors[rest.name]

    return (
      <div className={clsx('govuk-form-group', { 'govuk-form-group--error': !!error })}>
        <Fieldset
          legend={label}
          legendSize="s"
          aria-invalid={!!error ? 'true' : 'false'}
          aria-errormessage={clsx({
            [`${rest.name}-error`]: error,
          })}
        >
          <div className="govuk-radios" data-module="govuk-radios">
            <div className="govuk-label-wrapper">
              {hint && (
                <div id={`${name}-hint`} className="govuk-hint">
                  {hint}
                </div>
              )}
            </div>
            <ErrorInline name={rest.name} errors={errors} />
            {Children.map(children, (child, index) =>
              isValidElement(child) ? (
                <>
                  {cloneElement(child, {
                    ...child.props,
                    ...rest,
                    ref,
                    id: clsx({
                      [rest.name]: index === 0,
                      [`${rest.name}-${index}`]: index > 0,
                    }),
                    defaultChecked: defaultValue === child.props.value,
                    'aria-required': required,
                    'aria-invalid': !!error ? 'true' : 'false',
                    'aria-errormessage': clsx({
                      [`${rest.name}-error`]: error,
                    }),
                  })}
                </>
              ) : null
            )}
          </div>
        </Fieldset>
      </div>
    )
  }
)
