import { logger } from '@nihr-ui/logger'
import type { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth/next'
import { Mock } from 'ts-mockery'

import { render, screen, within } from '@/config/TestUtils'

import { userNoRoles } from '../__mocks__/session'
import { ERROR_PAGE_500, SIGN_IN_PAGE } from '../constants/routes'
import RegistrationConfirmation, { getServerSideProps } from '../pages/register/confirmation'

jest.mock('@nihr-ui/logger')
jest.mock('next-auth/next')

describe('getServerSideProps', () => {
  const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {} })

  test('redirects to home page when there is already a session', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce(userNoRoles)
    const result = await getServerSideProps(context)
    expect(result).toEqual({
      redirect: {
        destination: '/',
      },
    })
  })

  test('shows the confirmation page when there is no session', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce(null)
    const result = await getServerSideProps(context)
    expect(result).toEqual({
      props: {},
    })
  })

  test('redirects to the 500 error page if the session fails to retrieve', async () => {
    jest.mocked(getServerSession).mockRejectedValueOnce('error!')
    const result = await getServerSideProps(context)
    expect(logger.error).toHaveBeenCalledWith('error!')
    expect(result).toEqual({
      redirect: {
        destination: ERROR_PAGE_500,
      },
    })
  })
})

describe('Registration confirmation page', () => {
  jest.mocked(getServerSession).mockResolvedValue(null)

  test('shows a success message and login button', async () => {
    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {} })

    await getServerSideProps(context)

    render(RegistrationConfirmation.getLayout(<RegistrationConfirmation />))

    const banner = screen.getByRole('alert', { name: 'Success' })
    expect(within(banner).getByText('Your NIHR Identity Gateway account has been created.')).toBeInTheDocument()
    expect(
      within(banner).getByText('You can now log in using your email address and the password you specified.')
    ).toBeInTheDocument()

    expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', SIGN_IN_PAGE)
  })
})
