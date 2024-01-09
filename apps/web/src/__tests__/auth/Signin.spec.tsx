import type { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import type { ClientSafeProvider } from 'next-auth/react'
import { getCsrfToken, getProviders, signIn } from 'next-auth/react'
import mockRouter from 'next-router-mock'
import { Mock } from 'ts-mockery'

import { userWithSponsorContactRole } from '@/__mocks__/session'
import { render, screen } from '@/config/TestUtils'
import { REGISTRATION_PAGE } from '@/constants/routes'
import type { SigninProps } from '@/pages/auth/signin'
import Signin, { getServerSideProps } from '@/pages/auth/signin'

jest.mock('@nihr-ui/logger')
jest.mock('next-auth/next')
jest.mock('next-auth/react', () => {
  return {
    ...jest.requireActual('next-auth/react'),
    getCsrfToken: jest.fn(),
    getProviders: jest.fn(),
    signIn: jest.fn(),
  }
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getServerSideProps', () => {
  test('Redirects to registration page when there is a registration token', async () => {
    const context = Mock.of<GetServerSidePropsContext>({
      req: {},
      res: {},
      query: { registrationToken: 'test-reg-token' },
    })

    const result = await getServerSideProps(context)

    expect(result).toEqual({
      redirect: {
        destination: `${REGISTRATION_PAGE}?registrationToken=test-reg-token`,
      },
    })
  })

  test('Redirects to 500 error page if no auth providers available', async () => {
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

describe('Signin page', () => {
  jest.mocked(getProviders).mockResolvedValue(
    Mock.of<Record<string, ClientSafeProvider>>({
      oidc: {
        signinUrl: 'test-signin-url',
      },
    })
  )

  jest.mocked(getCsrfToken).mockResolvedValue('test-csrf-token')

  test('Default layout', async () => {
    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: {} })

    const { props } = (await getServerSideProps(context)) as {
      props: SigninProps
    }

    const { container } = render(<Signin {...props} />)

    // Heading
    expect(screen.getByRole('heading', { name: 'Redirecting to sign in...', level: 2 })).toBeInTheDocument()

    // Form action
    expect(container.querySelector('form')).toHaveAttribute('action', 'test-signin-url')

    // Inputs
    expect(container.querySelector('input[type="hidden"][name="csrfToken"]')).toHaveValue('test-csrf-token')
    expect(container.querySelector('input[type="hidden"][name="callbackUrl"]')).toHaveValue(
      'https://mockedurl.nihr.ac.uk/'
    )

    // Button
    expect(screen.getByRole('button', { name: 'Click here if you are not redirected' })).toBeInTheDocument()

    // Correct context passed to `getCsrfToken`
    expect(getCsrfToken).toHaveBeenCalledWith({ req: context.req })

    // Invokes `signIn` from next-auth when user is not authenticated
    expect(signIn).toHaveBeenCalledWith('oidc', undefined, { prompt: 'login' })
  })

  test('Redirects to homepage if user is already authenticated', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce(userWithSponsorContactRole)

    void mockRouter.push('/signin')

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: {} })

    const { props } = (await getServerSideProps(context)) as {
      props: SigninProps
    }

    render(<Signin {...props} />)

    expect(signIn).not.toHaveBeenCalled()

    expect(mockRouter.asPath).toBe('/')
  })
})
