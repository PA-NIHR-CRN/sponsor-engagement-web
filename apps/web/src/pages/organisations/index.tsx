import type { ReactElement } from 'react'
import { Container } from '@nihr-ui/frontend'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getServerSession } from 'next-auth/next'
import { RootLayout } from '../../components/Layout/RootLayout'
import { authOptions } from '../api/auth/[...nextauth]'
import { SIGN_IN_PAGE } from '../../constants/routes'

export type OrganisationsProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Organisations() {
  return (
    <Container>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">Manage sponsor contacts</h2>
          <p className="govuk-body">Add and remove contacts for sponsor organisations.</p>
        </div>
      </div>
    </Container>
  )
}

Organisations.getLayout = function getLayout(page: ReactElement, { user }: OrganisationsProps) {
  return (
    <RootLayout heading="Contact management" user={user}>
      {page}
    </RootLayout>
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const session = await getServerSession(context.req, context.res, authOptions)

    if (!session) {
      return {
        redirect: {
          destination: SIGN_IN_PAGE,
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
        destination: '/500',
      },
    }
  }
}
