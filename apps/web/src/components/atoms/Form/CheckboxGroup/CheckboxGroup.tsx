import clsx from 'clsx'
import type { ReactNode } from 'react'
import { Children, cloneElement, forwardRef, isValidElement } from 'react'
import type { FieldErrors } from 'react-hook-form'
import { ErrorInline } from '../ErrorInline/ErrorInline'
import { Fieldset } from '../Fieldset/Fieldset'
import type { CheckboxProps } from '../Checkbox/Checkbox'

interface CheckboxGroupProps {
  children: ReactNode
  label?: string
  name: string
  hint?: ReactNode
  required?: boolean
  errors: FieldErrors
  defaultValue: (string | undefined)[]
}

export const CheckboxGroup = forwardRef<HTMLInputElement, CheckboxGroupProps>(
  ({ children, label, errors, hint, defaultValue, required = true, ...rest }, ref) => {
    const error = errors[rest.name]

    return (
      <div className={clsx('govuk-form-group', { 'govuk-form-group--error': Boolean(error) })}>
        <Fieldset
          aria-errormessage={clsx({
            [`${rest.name}-error`]: error,
          })}
          aria-invalid={error ? 'true' : 'false'}
          legend={label}
          legendSize="s"
        >
          <div className="govuk-checkboxes" data-module="govuk-checkboxes">
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
                    defaultChecked: defaultValue.includes(child.props.value as string),
                    'aria-required': required,
                    'aria-invalid': error ? 'true' : 'false',
                    'aria-errormessage': clsx({
                      [`${rest.name}-error`]: error,
                    }),
                  } as CheckboxProps)}
                </>
              ) : null
            )}
          </div>
        </Fieldset>
      </div>
    )
  }
)
