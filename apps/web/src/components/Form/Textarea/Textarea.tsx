import clsx from 'clsx'
import { forwardRef, ReactNode } from 'react'
import { FieldErrors } from 'react-hook-form'

import { TEXTAREA_MAX_CHARACTERS } from '@/constants/forms'

import { ErrorInline } from '../ErrorInline/ErrorInline'

type TextareaProps = {
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
      <div className={clsx('govuk-form-group', { 'govuk-form-group--error': !!error })}>
        <div className="govuk-label-wrapper">
          <label id={`${rest.name}-label`} className="govuk-label govuk-label--s" htmlFor={rest.name}>
            {label}
          </label>
          {hint && (
            <div id={`${rest.name}-hint`} className="govuk-hint">
              {hint}
            </div>
          )}
        </div>
        <ErrorInline name={rest.name} errors={errors} />
        <textarea
          className={clsx('govuk-textarea', {
            'govuk-textarea--error': !!error,
            'govuk-!-margin-bottom-1': typeof remainingCharacters !== 'undefined',
          })}
          id={rest.name}
          aria-required={required}
          aria-invalid={!!error ? 'true' : 'false'}
          aria-errormessage={clsx({
            [`${rest.name}-error`]: error,
          })}
          aria-describedby={clsx('with-hint-info', {
            [`${rest.name}-hint`]: hint,
            [`${rest.name}-error`]: error,
          })}
          defaultValue={defaultValue}
          maxLength={TEXTAREA_MAX_CHARACTERS}
          {...rest}
          ref={ref}
          rows={5}
        />
        <div id="with-hint-info" className="govuk-hint govuk-character-count__message js-disabled-hide">
          You have {remainingCharacters} characters remaining
        </div>
      </div>
    )
  }
)
