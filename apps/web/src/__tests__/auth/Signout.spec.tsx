import type { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import { getToken } from 'next-auth/jwt'
import type { ClientSafeProvider } from 'next-auth/react'
import { getCsrfToken, getProviders, signOut } from 'next-auth/react'
import { Mock } from 'ts-mockery'

import { userWithSponsorContactRole } from '@/__mocks__/session'
import { render, screen } from '@/config/TestUtils'
import { SIGN_IN_PAGE } from '@/constants/routes'
import type { SignoutProps } from '@/pages/auth/signout'
import Signout, { getServerSideProps } from '@/pages/auth/signout'

jest.mock('@nihr-ui/logger')
jest.mock('next-auth/next')
jest.mock('next-auth/jwt')
jest.mock('next-auth/react', () => {
  return {
    ...jest.requireActual('next-auth/react'),
    getCsrfToken: jest.fn(),
    getProviders: jest.fn(),
    signOut: jest.fn(),
  }
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getServerSideProps', () => {
  test('Redirects to sign-in page when there is no session available', async () => {
    const context = Mock.of<GetServerSidePropsContext>({
      req: {},
      res: {},
    })

    const result = await getServerSideProps(context)

    expect(result).toEqual({
      redirect: {
        destination: SIGN_IN_PAGE,
      },
    })
  })

  test('Redirects to sign-in page when there is no token available', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce(userWithSponsorContactRole)

    const context = Mock.of<GetServerSidePropsContext>({
      req: {},
      res: {},
    })

    const result = await getServerSideProps(context)

    expect(result).toEqual({
      redirect: {
        destination: SIGN_IN_PAGE,
      },
    })
  })

  test('Redirects to 500 error page if no auth providers available', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce(userWithSponsorContactRole)
    jest.mocked(getToken).mockResolvedValueOnce(Mock.of<JWT>({ idToken: 'test-id-token' }))

    const context = Mock.of<GetServerSidePropsContext>({
      req: {},
      res: {},
    })

    const result = await getServerSideProps(context)

    expect(result).toEqual({
      redirect: {
        destination: `/500`,
      },
    })
  })
})

describe('Signout page', () => {
  test('Default layout', async () => {
    jest.mocked(getServerSession).mockResolvedValue(userWithSponsorContactRole)
    jest.mocked(getProviders).mockResolvedValue(Mock.of<Record<string, ClientSafeProvider>>({ oidc: {} }))
    jest.mocked(getCsrfToken).mockResolvedValue('test-csrf-token')

    const testIdToken = 'test-id-token'

    jest.mocked(getToken).mockResolvedValue(Mock.of<JWT>({ idToken: testIdToken }))

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: {} })

    const { props } = (await getServerSideProps(context)) as {
      props: SignoutProps
    }

    const { container } = render(<Signout {...props} />)

    // Heading
    expect(screen.getByRole('heading', { name: 'Signing out...', level: 2 })).toBeInTheDocument()

    // Form action
    expect(container.querySelector('form')).toHaveAttribute('action', '/api/auth/signout')

    // Inputs
    expect(container.querySelector('input[type="hidden"][name="csrfToken"]')).toHaveValue('test-csrf-token')
    expect(container.querySelector('input[type="hidden"][name="callbackUrl"]')).toHaveValue(
      '/api/signout?idTokenHint=test-id-token'
    )

    // Button
    expect(screen.getByRole('button', { name: 'Click here if you are not redirected' })).toBeInTheDocument()

    // Correct context passed to `getCsrfToken`
    expect(getCsrfToken).toHaveBeenCalledWith({ req: context.req })

    // Invokes `signOut` from next-auth
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: `/api/signout?idTokenHint=${testIdToken}` })
  })
})
