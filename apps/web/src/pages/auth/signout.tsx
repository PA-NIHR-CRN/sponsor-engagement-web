import { getCsrfToken, getProviders, signOut } from 'next-auth/react'
import { useEffect } from 'react'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { Container } from '@nihr-ui/frontend'
import { getServerSession } from 'next-auth/next'
import { logger } from '@nihr-ui/logger'
import { authOptions } from '../api/auth/[...nextauth]'
import { SIGN_IN_PAGE } from '../../constants/routes'
import { prismaClient } from '../../lib/prisma'

/**
 * This sign out page provides a progressively enhanced sign out experience
 *
 * For users w/ JavaScript it will automatically clear the session using next-auth's
 * built in `signOut` method (which is unfortunately client-side only).
 *
 * For users w/o JavaScript, a simple form is presented which makes a POST request to
 * next-auth's signout API handler.
 *
 * Both options will then redirect to IDG for the user to complete a federated logout
 */
export type SignoutProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Signout({ csrfToken, isAuthenticated, callbackUrl }: SignoutProps) {
  useEffect(() => {
    const handleSignout = async () => {
      await signOut({ callbackUrl })
    }
    if (isAuthenticated) {
      handleSignout().catch(console.error)
    }
  }, [isAuthenticated, callbackUrl])

  // Fallback for non-Javascript
  return (
    <Container>
      <h2 className="govuk-heading-l">Signing out...</h2>
      <form action="/api/auth/signout" method="POST">
        <input name="callbackUrl" type="hidden" value={callbackUrl} />
        <input name="csrfToken" type="hidden" value={csrfToken} />
        <button className="govuk-link" type="submit">
          Click here if you are not redirected
        </button>
      </form>
    </Container>
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const session = await getServerSession(context.req, context.res, authOptions)

    const { id_token: idTokenHint } = await prismaClient.account.findFirstOrThrow({
      where: {
        userId: session?.user?.id,
      },
      select: {
        id_token: true,
      },
    })

    // If there's no session, redirect to sign in
    if (!session) {
      return {
        redirect: {
          destination: SIGN_IN_PAGE,
        },
      }
    }

    const providers = await getProviders()

    if (providers?.oidc) {
      return {
        props: {
          isAuthenticated: Boolean(session),
          csrfToken: await getCsrfToken({ req: context.req }),
          callbackUrl: `/api/signout?idTokenHint=${idTokenHint}`,
        },
      }
    }

    throw new Error('Could not retrieve auth providers')
  } catch (error) {
    logger.info(error)
    return {
      redirect: {
        destination: '/500',
      },
    }
  }
}
