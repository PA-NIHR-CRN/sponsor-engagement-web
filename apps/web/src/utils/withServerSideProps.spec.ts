import { getServerSession } from 'next-auth/next'
import { Mock } from 'ts-mockery'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { SIGN_IN_PAGE } from '../constants/routes'
import { userNoOrgs, userNoRoles, userWithContactManagerRole, userWithSponsorContactRole } from '../__mocks__/session'
import { Roles } from '../constants'
import { withServerSideProps } from './withServerSideProps'

jest.mock('next-auth/next')

const mockContext = Mock.of<GetServerSidePropsContext>({ req: {}, res: {} })

describe('withServerSideProps', () => {
  it('redirects user with no session to sign-in page', async () => {
    const getServerSessionMock = jest.mocked(getServerSession)

    getServerSessionMock.mockResolvedValueOnce(null)

    const getServerSideProps = jest.fn() as GetServerSideProps

    const props = await withServerSideProps(Roles.SponsorContact, getServerSideProps)(mockContext)

    expect(getServerSideProps).not.toHaveBeenCalled()

    expect(props).toStrictEqual({
      redirect: {
        destination: SIGN_IN_PAGE,
      },
    })
  })

  it('redirects user with no roles to home page', async () => {
    const getServerSessionMock = jest.mocked(getServerSession)

    getServerSessionMock.mockResolvedValueOnce(userNoRoles)

    const getServerSideProps = jest.fn() as GetServerSideProps

    const props = await withServerSideProps(Roles.SponsorContact, getServerSideProps)(mockContext)

    expect(getServerSideProps).not.toHaveBeenCalled()

    expect(props).toStrictEqual({
      redirect: {
        destination: '/',
      },
    })
  })

  it('redirects sponsor contact with no organisations to home page', async () => {
    const getServerSessionMock = jest.mocked(getServerSession)

    getServerSessionMock.mockResolvedValueOnce(userNoOrgs)

    const getServerSideProps = jest.fn() as GetServerSideProps

    const props = await withServerSideProps(Roles.SponsorContact, getServerSideProps)(mockContext)

    expect(getServerSideProps).not.toHaveBeenCalled()

    expect(props).toStrictEqual({
      redirect: {
        destination: '/',
      },
    })
  })

  it('redirects user without required role to home page', async () => {
    const getServerSessionMock = jest.mocked(getServerSession)

    getServerSessionMock.mockResolvedValueOnce(userWithContactManagerRole)

    const getServerSideProps = jest.fn() as GetServerSideProps

    const props = await withServerSideProps(Roles.SponsorContact, getServerSideProps)(mockContext)

    expect(getServerSideProps).not.toHaveBeenCalled()

    expect(props).toStrictEqual({
      redirect: {
        destination: '/',
      },
    })
  })

  it('calls provided getServerSideProps function with expected arguments', async () => {
    const getServerSessionMock = jest.mocked(getServerSession)

    getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)

    // eslint-disable-next-line @typescript-eslint/require-await -- mock
    const getServerSideProps = jest.fn(async () => ({
      props: { test: true },
    })) as GetServerSideProps

    const result = await withServerSideProps(Roles.SponsorContact, getServerSideProps)(mockContext)

    expect(getServerSideProps).toHaveBeenCalledTimes(1)
    expect(getServerSideProps).toHaveBeenCalledWith(mockContext, userWithSponsorContactRole)

    expect(result).toStrictEqual({ props: { test: true } })
  })
})
