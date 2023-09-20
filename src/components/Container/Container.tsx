import { ReactNode } from 'react'

export function Container({ children }: { children: ReactNode }) {
  return <div className="govuk-width-container govuk-!-padding-left-6 govuk-!-padding-right-6">{children}</div>
}
