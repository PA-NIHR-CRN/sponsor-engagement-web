import { signIn, useSession, getCsrfToken, getProviders } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { Container } from '@nihr-ui/frontend'
import { AUTH_PROVIDER_ID } from '@/constants/auth'

/**
 * Our middleware.ts redirects to this sign in page for unauthenticated users.
 *
 * This signin page then automatically redirects to the OIDC sign in page or back to our application root depending on authentication status
 * next-auth does not support redirecting to the authentication provider directly from the middleware. (https://github.com/nextauthjs/next-auth/discussions/4511)
 */
export type SigninProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Signin({ signinUrl, csrfToken, callbackUrl }: SigninProps) {
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      void signIn(AUTH_PROVIDER_ID)
    } else if (status === 'authenticated') {
      void router.push('/')
    }
  }, [status, router])

  // Fallback for non-Javascript
  return (
    <Container>
      <form action={signinUrl} method="POST">
        <input name="csrfToken" type="hidden" value={csrfToken} />
        <input name="callbackUrl" type="hidden" value={callbackUrl} />
        <button className="govuk-button" type="submit">
          Sign in
        </button>
      </form>
    </Container>
  )
}

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  try {
    const providers = await getProviders()

    if (providers?.oidc) {
      const { signinUrl } = providers.oidc

      return {
        props: {
          signinUrl,
          csrfToken: await getCsrfToken({ req }),
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
