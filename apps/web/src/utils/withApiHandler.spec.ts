import { logger } from '@nihr-ui/logger'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { Mock } from 'ts-mockery'

import { userNoRoles, userWithSponsorContactRole } from '../__mocks__/session'
import { Roles } from '../constants'
import { withApiHandler } from './withApiHandler'

jest.mock('next-auth/next')
jest.mock('@nihr-ui/logger')

const redirectMock = jest.fn()

const mockRequest = Mock.of<NextApiRequest>()
const mockResponse = Mock.of<NextApiResponse>({ redirect: redirectMock })

describe('withApiHandler', () => {
  beforeEach(() => {
    logger.error = jest.fn()
    jest.clearAllMocks()
  })

  test('redirects to sign in page for a user with no session', async () => {
    const getServerSessionMock = jest.mocked(getServerSession)
    getServerSessionMock.mockResolvedValueOnce(null)

    await withApiHandler(Roles.ContactManager, jest.fn())(mockRequest, mockResponse)
    expect(redirectMock).toHaveBeenCalledWith(302, '/auth/signin')
  })

  test('redirects to a 500 page for a user with no roles', async () => {
    const getServerSessionMock = jest.mocked(getServerSession)
    getServerSessionMock.mockResolvedValueOnce(userNoRoles)

    await withApiHandler(Roles.ContactManager, jest.fn())(mockRequest, mockResponse)
    expect(redirectMock).toHaveBeenCalledWith(302, '/500')
  })

  test('calls provided api handler function with expected arguments', async () => {
    const getServerSessionMock = jest.mocked(getServerSession)
    getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)

    const handler = jest.fn()
    await withApiHandler(Roles.SponsorContact, handler)(mockRequest, mockResponse)

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(mockRequest, mockResponse, userWithSponsorContactRole)
  })
})
