import clsx from 'clsx'
import type { ReactNode } from 'react'
import { Children, cloneElement, forwardRef, isValidElement } from 'react'
import type { FieldErrors } from 'react-hook-form'

import { ErrorInline } from '../ErrorInline/ErrorInline'
import type { FieldsetProps } from '../Fieldset/Fieldset'
import { Fieldset } from '../Fieldset/Fieldset'
import type { RadioProps } from '../Radio/Radio'

interface RadioGroupProps {
  children: ReactNode
  label?: string
  labelSize?: FieldsetProps['legendSize']
  name: string
  hint?: ReactNode
  required?: boolean
  errors: FieldErrors
  defaultValue: string | undefined
  disabled?: boolean
  onChange?: (e: React.ChangeEvent<EventTarget>) => void
}

export const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
  (
    { children, label, labelSize = 's', errors, hint, defaultValue, required = true, disabled, onChange, ...rest },
    ref
  ) => {
    const error = errors[rest.name]

    return (
      <div className={clsx('govuk-form-group', { 'govuk-form-group--error': Boolean(error) })}>
        <Fieldset
          aria-describedby={clsx({
            [`${rest.name}-error`]: error,
          })}
          aria-disabled={disabled}
          aria-errormessage={clsx({
            [`${rest.name}-error`]: error,
          })}
          aria-invalid={error ? 'true' : 'false'}
          aria-required={required}
          disabled={disabled}
          legend={label}
          legendSize={labelSize}
          onChange={onChange}
          role="radiogroup"
        >
          <div className="govuk-radios" data-module="govuk-radios">
            <div className="govuk-label-wrapper">
              {hint ? (
                <div className="govuk-hint" id={`${rest.name}-hint`}>
                  {hint}
                </div>
              ) : null}
            </div>
            <ErrorInline errors={errors} name={rest.name} />
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
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- temp fix
                    defaultChecked: defaultValue === child.props.value,
                    'aria-required': required,
                    'aria-invalid': error ? 'true' : 'false',
                    'aria-disabled': disabled,
                  } as RadioProps)}
                </>
              ) : null
            )}
          </div>
        </Fieldset>
      </div>
    )
  }
)
