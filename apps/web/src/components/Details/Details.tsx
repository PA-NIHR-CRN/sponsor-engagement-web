import clsx from 'clsx'
import { ReactNode } from 'react'

type DetailsProps = {
  heading: string
  children: ReactNode
  className?: string
}

export const Details = ({ heading, children, className }: DetailsProps) => {
  return (
    <details className={clsx(className, 'govuk-details govuk-!-margin-bottom-4')}>
      <summary className="govuk-details__summary">
        <span className="govuk-details__summary-text">{heading}</span>
      </summary>
      <div className="govuk-details__text [&>*>p:last-child]:mb-0">{children}</div>
    </details>
  )
}
