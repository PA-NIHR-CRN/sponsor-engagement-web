import { getServerSession } from 'next-auth/next'
import { Mock } from 'ts-mockery'
import type { NextApiRequest, NextApiResponse } from 'next'
import { userNoOrgs, userNoRoles, userWithSponsorContactRole } from '../__mocks__/session'
import { withApiHandler } from './withApiHandler'

jest.mock('next-auth/next')

const mockRequest = Mock.of<NextApiRequest>()
const mockResponse = Mock.of<NextApiResponse>()

describe('withApiHandler', () => {
  it('throws an error for a user with no session', async () => {
    const getServerSessionMock = jest.mocked(getServerSession)

    getServerSessionMock.mockResolvedValueOnce(null)

    const handler = jest.fn()

    await expect(async () => {
      await withApiHandler(handler)(mockRequest, mockResponse)
    }).rejects.toThrow('Unauthorised')

    expect(handler).not.toHaveBeenCalled()
  })

  it('throws an error for a user with no roles to home page', async () => {
    const getServerSessionMock = jest.mocked(getServerSession)

    getServerSessionMock.mockResolvedValueOnce(userNoRoles)

    const handler = jest.fn()

    await expect(async () => {
      await withApiHandler(handler)(mockRequest, mockResponse)
    }).rejects.toThrow('No roles or organisations found for user')

    expect(handler).not.toHaveBeenCalled()
  })

  it('throws an error for a user with no organisations to home page', async () => {
    const getServerSessionMock = jest.mocked(getServerSession)

    getServerSessionMock.mockResolvedValueOnce(userNoOrgs)

    const handler = jest.fn()

    await expect(async () => {
      await withApiHandler(handler)(mockRequest, mockResponse)
    }).rejects.toThrow('No roles or organisations found for user')

    expect(handler).not.toHaveBeenCalled()
  })

  it('calls provided api handler function with expected arguments', async () => {
    const getServerSessionMock = jest.mocked(getServerSession)

    getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)

    const handler = jest.fn()

    await withApiHandler(handler)(mockRequest, mockResponse)

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(mockRequest, mockResponse, userWithSponsorContactRole)
  })
})
