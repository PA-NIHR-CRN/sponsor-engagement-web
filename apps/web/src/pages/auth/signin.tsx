import { signIn, getCsrfToken, getProviders } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { Container } from '@nihr-ui/frontend'
import { getServerSession } from 'next-auth/next'
import { AUTH_PROVIDER_ID } from '@/constants/auth'
import { authOptions } from '../api/auth/[...nextauth]'

/**
 * Our protected routes redirect to this sign in page for unauthenticated users.
 *
 * This sign in page then automatically performs a client-side redirect to the Identity gateway OR back to our application homepage
 * next-auth unfortunately does not support redirecting directly to the identity provider server-side (https://github.com/nextauthjs/next-auth/discussions/4511)
 * For Non-javascript use case, we fallback to a standard form
 */
export type SigninProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Signin({ isAuthenticated, signinUrl, csrfToken, callbackUrl }: SigninProps) {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      void signIn(AUTH_PROVIDER_ID)
    } else {
      void router.push('/')
    }
  }, [isAuthenticated, router])

  // Fallback for non-Javascript
  return (
    <Container>
      <h2 className="govuk-heading-l">Redirecting to sign in...</h2>
      <form action={signinUrl} method="POST">
        <input name="csrfToken" type="hidden" value={csrfToken} />
        <input name="callbackUrl" type="hidden" value={callbackUrl} />
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

    const providers = await getProviders()

    if (providers?.oidc) {
      const { signinUrl } = providers.oidc

      return {
        props: {
          isAuthenticated: Boolean(session),
          signinUrl,
          csrfToken: await getCsrfToken({ req: context.req }),
          callbackUrl: `${process.env.NEXTAUTH_URL}/`,
        },
      }
    }

    throw new Error('Could not retrieve auth providers')
  } catch (error) {
    return {
      redirect: {
        destination: '/500',
      },
    }
  }
}
