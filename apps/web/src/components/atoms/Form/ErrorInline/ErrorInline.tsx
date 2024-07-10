import { ErrorMessage } from '@hookform/error-message'
import type { FieldErrors } from 'react-hook-form'

export function ErrorInline({ name, errors }: { name: string; errors: FieldErrors }) {
  return (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ message }) => (
        <p className="govuk-error-message" id={`${name}-error`}>
          <span className="govuk-visually-hidden">Error:</span> {message}
        </p>
      )}
    />
  )
}
