import { ErrorMessage } from '@hookform/error-message'
import { FieldErrors } from 'react-hook-form'

export function ErrorInline({ name, errors }: { name: string; errors: FieldErrors }) {
  return (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ message }) => (
        <p id={`${name}-error`} className="govuk-error-message">
          <span className="govuk-visually-hidden">Error:</span> {message}
        </p>
      )}
    />
  )
}
