import type { ReactNode } from 'react'

interface WarningProps {
  children: ReactNode
}

function Warning({ children }: WarningProps) {
  return (
    <div className="govuk-warning-text">
      <span aria-hidden="true" className="govuk-warning-text__icon">
        !
      </span>
      <strong className="govuk-warning-text__text">
        <span className="govuk-visually-hidden">Warning</span>
        {children}
      </strong>
    </div>
  )
}

export default Warning
