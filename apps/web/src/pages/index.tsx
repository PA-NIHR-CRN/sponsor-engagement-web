import { Container } from '@nihr-ui/frontend'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getServerSession } from 'next-auth/next'
import type { ReactElement } from 'react'

import { RootLayout } from '../components/organisms'
import { ERROR_PAGE_500, ORGANISATIONS_PAGE, SIGN_OUT_CONFIRM_PAGE, STUDIES_PAGE } from '../constants/routes'
import { isContactManager, isContactManagerAndSponsorContact, isSponsorContact } from '../utils/auth'
import { authOptions } from './api/auth/[...nextauth]'

export type HomeProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Home() {
  return (
    <Container>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">Your details are not associated with any account on this application</h2>
          <p className="govuk-body">Please contact crn.servicedesk@nihr.ac.uk for further assistance.</p>
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

    const {
      user: { roles, organisations },
    } = session

    if (isContactManager(roles)) {
      return {
        redirect: {
          destination: ORGANISATIONS_PAGE,
        },
      }
    }

    if ((isSponsorContact(roles) || isContactManagerAndSponsorContact(roles)) && organisations.length > 0) {
      return {
        redirect: {
          destination: STUDIES_PAGE,
        },
      }
    }

    return {
      props: {
        user: session.user,
      },
    }
  } catch (error) {
    return {
      redirect: {
        destination: ERROR_PAGE_500,
      },
    }
  }
}
