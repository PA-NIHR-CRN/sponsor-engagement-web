import { ReactElement } from 'react'

import { Container } from '@/components/Container/Container'
import { RootLayout } from '@/components/Layout/RootLayout'

export default function ServiceUnavailable() {
  return (
    <Container>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <p className="govuk-body">
            Please try again later or contact the Find, Recruit and Follow-up Central Team on{' '}
            <a href="mailto:frfteam@nihr.ac.uk">frfteam@nihr.ac.uk</a>.
          </p>
        </div>
      </div>
    </Container>
  )
}

ServiceUnavailable.getLayout = function getLayout(page: ReactElement) {
  return <RootLayout heading="Sorry, there is a problem with the service.">{page}</RootLayout>
}
