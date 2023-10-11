import type { FieldErrors } from 'react-hook-form'

interface ErrorSummaryProps {
  errors: FieldErrors
}

export function ErrorSummary({ errors }: ErrorSummaryProps) {
  if (Object.keys(errors).length === 0) return null

  return (
    <div className="govuk-error-summary">
      <div aria-labelledby="form-summary-errors" role="alert">
        <h2 className="govuk-error-summary__title" id="form-summary-errors">
          There is a problem
        </h2>
        <div className="govuk-error-summary__body">
          <ul className="govuk-list govuk-error-summary__list">
            {Object.keys(errors).map((id) => {
              if (id === 'root') return <li key={id}>{errors[id]?.serverError?.message}</li>

              return (
                <li key={id}>
                  <a href={`#${id}`}>{errors[id]?.message as string}</a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
