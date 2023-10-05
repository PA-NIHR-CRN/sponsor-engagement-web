import clsx from 'clsx'
import type { ReactNode } from 'react'
import { forwardRef } from 'react'
import type { FieldErrors } from 'react-hook-form'
import { TEXTAREA_MAX_CHARACTERS } from '../../../../constants/forms'
import { ErrorInline } from '../ErrorInline/ErrorInline'

interface TextareaProps {
  label: string
  name: string
  hint?: ReactNode
  required?: boolean
  errors: FieldErrors
  defaultValue: string | undefined
  remainingCharacters?: number
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, errors, hint, remainingCharacters, defaultValue, required = true, ...rest }, ref) => {
    const error = errors[rest.name]

    return (
      <div className={clsx('govuk-form-group', { 'govuk-form-group--error': Boolean(error) })}>
        <div className="govuk-label-wrapper">
          <label className="govuk-label govuk-label--s" htmlFor={rest.name} id={`${rest.name}-label`}>
            {label}
          </label>
          {hint ? (
            <div className="govuk-hint" id={`${rest.name}-hint`}>
              {hint}
            </div>
          ) : null}
        </div>
        <ErrorInline errors={errors} name={rest.name} />
        <textarea
          aria-describedby={clsx('with-hint-info', {
            [`${rest.name}-hint`]: hint,
            [`${rest.name}-error`]: error,
          })}
          aria-errormessage={clsx({
            [`${rest.name}-error`]: error,
          })}
          aria-invalid={error ? 'true' : 'false'}
          aria-required={required}
          className={clsx('govuk-textarea', {
            'govuk-textarea--error': Boolean(error),
            'govuk-!-margin-bottom-1': typeof remainingCharacters !== 'undefined',
          })}
          defaultValue={defaultValue}
          id={rest.name}
          maxLength={TEXTAREA_MAX_CHARACTERS}
          {...rest}
          ref={ref}
          rows={5}
        />
        <div className="govuk-hint govuk-character-count__message js-disabled-hide" id="with-hint-info">
          You have {remainingCharacters} characters remaining
        </div>
      </div>
    )
  }
)
