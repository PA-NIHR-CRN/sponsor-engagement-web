import { Container } from '@nihr-ui/frontend'
import Link from 'next/link'
import { NextSeo } from 'next-seo'

import { SIGN_IN_PAGE } from '@/constants/routes'

/**
 * This is the post logout redirect page
 */

export default function SignoutConfirmation() {
  return (
    <Container>
      <NextSeo title="You are signed out" />
      <h2 className="govuk-heading-l">You are signed out</h2>
      <p>Please sign in to access this application.</p>
      <Link className="govuk-button" href={SIGN_IN_PAGE}>
        Sign in
      </Link>
    </Container>
  )
}
