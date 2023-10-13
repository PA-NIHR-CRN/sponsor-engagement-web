import { getServerSession } from 'next-auth/next'
import { Mock } from 'ts-mockery'
import type { NextApiRequest, NextApiResponse } from 'next'
import { userNoOrgs, userNoRoles, userWithSponsorContactRole } from '../__mocks__/session'
import { withApiHandler } from './withApiHandler'

jest.mock('next-auth/next')

const redirectMock = jest.fn()

const mockRequest = Mock.of<NextApiRequest>()
const mockResponse = Mock.of<NextApiResponse>({ redirect: redirectMock })

describe('withApiHandler', () => {
  beforeEach(() => {
    console.error = jest.fn()
    jest.clearAllMocks()
  })

  test('redirects to sign in page for a user with no session', async () => {
    const getServerSessionMock = jest.mocked(getServerSession)
    getServerSessionMock.mockResolvedValueOnce(null)

    await withApiHandler(jest.fn())(mockRequest, mockResponse)
    expect(redirectMock).toHaveBeenCalledWith(302, '/auth/signin')
  })

  test('redirects to a 500 page for a user with no roles', async () => {
    const getServerSessionMock = jest.mocked(getServerSession)
    getServerSessionMock.mockResolvedValueOnce(userNoRoles)

    await withApiHandler(jest.fn())(mockRequest, mockResponse)
    expect(redirectMock).toHaveBeenCalledWith(302, '/500')
  })

  test('redirects to a 500 page for a user with no organisations', async () => {
    const getServerSessionMock = jest.mocked(getServerSession)
    getServerSessionMock.mockResolvedValueOnce(userNoOrgs)

    await withApiHandler(jest.fn())(mockRequest, mockResponse)
    expect(redirectMock).toHaveBeenCalledWith(302, '/500')
  })

  test('calls provided api handler function with expected arguments', async () => {
    const getServerSessionMock = jest.mocked(getServerSession)
    getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)

    const handler = jest.fn()
    await withApiHandler(handler)(mockRequest, mockResponse)

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(mockRequest, mockResponse, userWithSponsorContactRole)
  })
})
