import type { GetServerSidePropsContext } from 'next'
import { Mock } from 'ts-mockery'
import { getServerSession } from 'next-auth/next'
import type { HomeProps } from '../pages/index'
import Home, { getServerSideProps } from '../pages/index'
import {
  userNoOrgs,
  userNoRoles,
  userWithContactManagerRole,
  userWithSponsorContactAndContactManagerRoles,
  userWithSponsorContactRole,
} from '../__mocks__/session'
import { ORGANISATIONS_PAGE, SIGN_OUT_CONFIRM_PAGE, STUDIES_PAGE } from '../constants/routes'
import { render } from '@/config/TestUtils'

jest.mock('next-auth/next')
jest.mock('../pages/api/auth/[...nextauth]', () => ({
  '@auth/prisma-adapter': jest.fn(),
}))

describe('getServerSideProps', () => {
  const getServerSessionMock = jest.mocked(getServerSession).mockResolvedValue(userNoRoles)

  const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {} })

  test('redirects to sign in page when there is no user session', async () => {
    getServerSessionMock.mockResolvedValueOnce(null)
    const result = await getServerSideProps(context)
    expect(result).toEqual({
      redirect: {
        destination: SIGN_OUT_CONFIRM_PAGE,
      },
    })
  })

  test('redirects to the organisations page for users with only Contact Managers role', async () => {
    getServerSessionMock.mockResolvedValueOnce(userWithContactManagerRole)
    const result = await getServerSideProps(context)
    expect(result).toEqual({
      redirect: {
        destination: ORGANISATIONS_PAGE,
      },
    })
  })

  test('redirects to studies page for users with only Sponsor Contact role', async () => {
    getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)
    const result = await getServerSideProps(context)
    expect(result).toEqual({
      redirect: {
        destination: STUDIES_PAGE,
      },
    })
  })

  test('redirects to studies page for users with Sponsor Contact role AND Contact Manager role', async () => {
    getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactAndContactManagerRoles)
    const result = await getServerSideProps(context)
    expect(result).toEqual({
      redirect: {
        destination: STUDIES_PAGE,
      },
    })
  })

  test('does not redirect for users without any roles', async () => {
    const result = await getServerSideProps(context)
    expect(result).toEqual({
      props: {
        user: userNoRoles.user,
      },
    })
  })

  test('does not redirect for Sponsor Contacts without any assigned organisations', async () => {
    getServerSessionMock.mockResolvedValueOnce(userNoOrgs)
    const result = await getServerSideProps(context)
    expect(result).toEqual({
      props: {
        user: userNoOrgs.user,
      },
    })
  })
})

describe('Homepage for users with no role', () => {
  jest.mocked(getServerSession).mockResolvedValue(userNoRoles)

  test('shows an error message', async () => {
    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {} })

    const { props } = (await getServerSideProps(context)) as {
      props: HomeProps
    }

    const { getByRole, getByText } = render(Home.getLayout(<Home />, { ...props }))

    expect(
      getByRole('heading', { level: 2, name: 'Your details are not associated with any account on this application' })
    ).toBeInTheDocument()
    expect(getByText('Please contact crn.servicedesk@nihr.ac.uk for further assistance.')).toBeInTheDocument()
  })
})
