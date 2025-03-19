import { Container } from '@nihr-ui/frontend'
import { logger } from '@nihr-ui/logger'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getServerSession } from 'next-auth/next'
import type { ReactElement } from 'react'

import { RootLayout } from '../components/organisms'
import { ERROR_PAGE_500, ORGANISATIONS_PAGE, SIGN_OUT_CONFIRM_PAGE, STUDIES_PAGE } from '../constants/routes'
import { isContactManager, isSponsorContact } from '../utils/auth'
import { authOptions } from './api/auth/[...nextauth]'

export type HomeProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Home() {
  return (
    <Container>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">Your details are not associated with any account on this application</h2>
          <p className="govuk-body">
            The Sponsor Engagement Tool is for use by project sponsors or their delegates in CRO/CTU organisations only.
          </p>
          <p className="govuk-body">Please contact supportmystudy@nihr.ac.uk for further assistance.</p>
        </div>
      </div>
    </Container>
  )
}

Home.getLayout = function getLayout(page: ReactElement, { user }: HomeProps) {
  return <RootLayout user={user}>{page}</RootLayout>
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const session = await getServerSession(context.req, context.res, authOptions)

    if (!session?.user) {
      return {
        redirect: {
          destination: SIGN_OUT_CONFIRM_PAGE,
        },
      }
    }

    if (!session.user.id) {
      logger.error('Session missing required user data. Check this IDG user has a corresponding User record.')
      return {
        props: {},
      }
    }

    const {
      user: { roles, organisations },
    } = session

    if (isSponsorContact(roles) && organisations.length > 0) {
      return {
        redirect: {
          destination: STUDIES_PAGE,
        },
      }
    }

    if (isContactManager(roles)) {
      return {
        redirect: {
          destination: ORGANISATIONS_PAGE,
        },
      }
    }

    return {
      props: {
        user: session.user,
      },
    }
  } catch (error) {
    logger.error(error)
    return {
      redirect: {
        destination: ERROR_PAGE_500,
      },
    }
  }
}
