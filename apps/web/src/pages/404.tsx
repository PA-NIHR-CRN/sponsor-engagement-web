import { Container } from '@nihr-ui/frontend'
import type { ReactElement } from 'react'

import { RootLayout } from '../components/organisms'

export default function PageNotFound() {
  return (
    <Container>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">Page not found</h2>
          <p className="govuk-body">If you typed the web address, check it is correct.</p>
          <p className="govuk-body">If you pasted the web address, check you copied the entire address.</p>
          <p className="govuk-body" data-testid="PageNotFoundContactForAssistance">
            Please contact <a href="mailto:rdn.servicedesk@nihr.ac.uk">rdn.servicedesk@nihr.ac.uk</a> for further
            assistance.
          </p>
        </div>
      </div>
    </Container>
  )
}

PageNotFound.getLayout = function getLayout(page: ReactElement) {
  return <RootLayout user={null}>{page}</RootLayout>
}
