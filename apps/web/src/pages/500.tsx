import { Container } from '@nihr-ui/frontend'
import type { ReactElement } from 'react'

import { RootLayout } from '../components/organisms'

export default function ServiceUnavailable() {
  return (
    <Container>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">Sorry, there is a problem with the service</h2>
          <p className="govuk-body" data-testid="ErrorContactForAssitance">
            Please contact <a href="mailto:rdn.servicedesk@nihr.ac.uk">rdn.servicedesk@nihr.ac.uk</a> for further
            assistance.
          </p>
        </div>
      </div>
    </Container>
  )
}

ServiceUnavailable.getLayout = function getLayout(page: ReactElement) {
  return <RootLayout user={null}>{page}</RootLayout>
}
