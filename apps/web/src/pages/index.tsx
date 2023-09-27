import type { ReactElement } from 'react'
import { Container } from '@nihr-ui/frontend'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getServerSession } from 'next-auth/next'
import { RootLayout } from '../components/Layout/RootLayout'
import { ORGANISATIONS_PAGE, ERROR_PAGE_500, SIGN_IN_PAGE, STUDIES_PAGE } from '../constants/routes'
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
  return (
    <RootLayout heading="" user={user}>
      {page}
    </RootLayout>
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const session = await getServerSession(context.req, context.res, authOptions)

    if (!session?.user) {
      return {
        redirect: {
          destination: SIGN_IN_PAGE,
        },
      }
    }

    const {
      user: { roles },
    } = session

    if (isContactManager(roles)) {
      return {
        redirect: {
          destination: ORGANISATIONS_PAGE,
        },
      }
    }

    if (isSponsorContact(roles) || isContactManagerAndSponsorContact(roles)) {
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
