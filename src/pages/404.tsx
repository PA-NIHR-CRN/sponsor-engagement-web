import { ReactElement } from 'react'

import { Container } from '@/components/Container/Container'
import { RootLayout } from '@/components/Layout/RootLayout'

export default function PageNotFound() {
  return (
    <Container>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <p className="govuk-body">If you typed the web address, check it is correct.</p>
          <p className="govuk-body">If you pasted the web address, check you copied the entire address.</p>
          <p className="govuk-body">
            Please try again later or contact the Find, Recruit and Follow-up Central Team on{' '}
            <a href="mailto:frfteam@nihr.ac.uk">frfteam@nihr.ac.uk</a>.
          </p>
        </div>
      </div>
    </Container>
  )
}

PageNotFound.getLayout = function getLayout(page: ReactElement) {
  return <RootLayout heading="Page not found">{page}</RootLayout>
}
