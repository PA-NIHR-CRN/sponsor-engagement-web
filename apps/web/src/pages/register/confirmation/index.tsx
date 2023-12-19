import { Container, NotificationBanner } from '@nihr-ui/frontend'
import { logger } from '@nihr-ui/logger'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import type { ReactElement } from 'react'

import { RootLayout } from '@/components/organisms'
import { ERROR_PAGE_500, SIGN_IN_PAGE } from '@/constants/routes'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

export type RegisterConfirmationProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function RegisterConfirmation() {
  return (
    <Container>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <NotificationBanner heading="Your NIHR Identity Gateway account has been created." success>
            You can now log in using your email address and the password you specified.
          </NotificationBanner>

          <Link className="govuk-button" href={SIGN_IN_PAGE}>
            Login
          </Link>
        </div>
      </div>
    </Container>
  )
}

RegisterConfirmation.getLayout = function getLayout(page: ReactElement) {
  return <RootLayout user={null}>{page}</RootLayout>
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const session = await getServerSession(context.req, context.res, authOptions)

    // If already signed in, redirect to homepage
    if (session) {
      return {
        redirect: {
          destination: '/',
        },
      }
    }

    return {
      props: {},
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
