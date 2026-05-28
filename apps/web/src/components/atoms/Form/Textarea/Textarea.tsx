import type React from 'react'
import type { Document } from '@contentful/rich-text-types'
import clsx from 'clsx'
import { forwardRef, useEffect, useMemo, useState } from 'react'
import type { FieldErrors } from 'react-hook-form'

import { RichTextRenderer } from '@/utils/Renderers/RichTextRenderer/RichTextRenderer'
import { ErrorInline } from '../ErrorInline/ErrorInline'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  labelSize?: 's' | 'm' | 'l'
  name: string
  hint?: string | Document
  required?: boolean
  errors: FieldErrors
  defaultValue?: string | undefined
  remainingCharacters?: number
  maxLength?: number
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      labelSize = 's',
      errors,
      hint,
      defaultValue,
      required = true,
      maxLength,
      remainingCharacters: remainingCharactersProp,
      onChange,
      onInput,
      ...rest
    },
    ref
  ) => {
    const name = rest.name
    const error = errors[name]

    const showCount = typeof maxLength === 'number'
    const countId = `${name}-count`

    const initialLen = useMemo(() => String(defaultValue ?? '').length, [defaultValue])

    const [remainingInternal, setRemainingInternal] = useState(() =>
      showCount ? Math.max(0, maxLength - initialLen) : 0
    )

    useEffect(() => {
      if (!showCount) return
      setRemainingInternal(Math.max(0, maxLength - String(defaultValue ?? '').length))
    }, [defaultValue, maxLength, showCount])

    const updateRemaining = (value: string) => {
      if (!showCount) return
      setRemainingInternal(Math.max(0, maxLength - value.length))
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateRemaining(e.currentTarget.value)
      onChange?.(e)
    }

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      updateRemaining((e.currentTarget as HTMLTextAreaElement).value)
      onInput?.(e)
    }

    const remainingToDisplay =
      typeof remainingCharactersProp === 'number' ? remainingCharactersProp : remainingInternal

    const describedBy = clsx({
      [`${name}-hint`]: hint,
      [`${name}-error`]: error,
      [countId]: showCount,
    })

    return (
      <div className={clsx('govuk-form-group', { 'govuk-form-group--error': Boolean(error) })}>
        <div className="govuk-label-wrapper">
          <label className={`govuk-label govuk-label--${labelSize}`} htmlFor={name} id={`${name}-label`}>
            {label}
          </label>

          {hint ? (
            <div className="govuk-hint" id={`${name}-hint`}>
              {typeof hint === 'string' ? hint : <RichTextRenderer>{hint}</RichTextRenderer>}
            </div>
          ) : null}
        </div>

        <ErrorInline errors={errors} name={name} />

        <textarea
          aria-describedby={describedBy}
          aria-errormessage={error ? `${name}-error` : undefined}
          aria-invalid={error ? 'true' : 'false'}
          aria-required={required}
          className={clsx('govuk-textarea', {
            'govuk-textarea--error': Boolean(error),
            'govuk-!-margin-bottom-1': showCount,
          })}
          defaultValue={defaultValue}
          id={name}
          maxLength={maxLength}
          {...rest}
          onChange={handleChange}
          onInput={handleInput}
          ref={ref}
          rows={5}
        />

        {showCount ? (
          <div className="govuk-hint govuk-character-count__message js-disabled-hide" id={countId}>
            You have {remainingToDisplay} characters remaining
          </div>
        ) : null}
      </div>
    )
  }
)