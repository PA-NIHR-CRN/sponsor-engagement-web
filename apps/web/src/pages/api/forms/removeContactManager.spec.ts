import { logger } from '@nihr-ui/logger'
import type { NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import { getServerSession } from 'next-auth'
import type { RequestOptions } from 'node-mocks-http'
import { createRequest, createResponse } from 'node-mocks-http'

import { userNoRoles, userWithContactManagerRole } from '@/__mocks__/session'
import { Roles } from '@/constants'
import { CONTACT_MANAGERS_PAGE, SIGN_IN_PAGE } from '@/constants/routes'
import { prismaClient } from '@/lib/prisma'
import { AuthError } from '@/utils/auth'
import type { RemoveContactManagerInputs } from '@/utils/schemas'

import type { ExtendedNextApiRequest } from './removeContactManager'
import api from './removeContactManager'

jest.mock('next-auth/next')
jest.mock('@nihr-ui/logger')
jest.mock('@nihr-ui/email')

type ApiRequest = ExtendedNextApiRequest
type ApiResponse = NextApiResponse

const testHandler = async (handler: typeof api, options: RequestOptions) => {
  const req = createRequest<ApiRequest>(options)
  const res = createResponse<ApiResponse>()
  await handler(req, res)
  return res
}

describe('Successful remove contact manager', () => {
  const body: RemoveContactManagerInputs = {
    contactManagerUserId: '12345',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    logger.info = jest.fn()
    logger.error = jest.fn()
  })

  test.each([userWithContactManagerRole])('Removing user as contact manager', async (userSession: Session) => {
    jest.mocked(getServerSession).mockResolvedValueOnce(userSession)

    const res = await testHandler(api, { method: 'POST', body })
    const updateUserMock = jest.mocked(prismaClient.userRole.update)

    expect(updateUserMock).toHaveBeenCalledWith({
      where: {
        userId_roleId: {
          userId: 12345,
          roleId: Roles.ContactManager,
        },
        isDeleted: false,
      },
      data: {
        isDeleted: true,
        updatedById: userSession.user?.id,
      },
    })

    // Redirect back to organisation page
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(`${CONTACT_MANAGERS_PAGE}?success=2`)
  })
})

describe('Failed contact manager role removal', () => {
  const body: RemoveContactManagerInputs = {
    contactManagerUserId: '123',
  }

  test('User not logged in redirects to sign in page', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce(null)
    const res = await testHandler(api, { method: 'POST', body, query: {} })
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(SIGN_IN_PAGE)
    expect(logger.error).toHaveBeenCalledWith(new AuthError('Not signed in'))
  })
  test('Wrong http method redirects back to the form with a fatal error', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce(userWithContactManagerRole)
    const res = await testHandler(api, { method: 'GET', body, query: {} })
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(`${CONTACT_MANAGERS_PAGE}/remove-contact-manager/123/?fatal=1`)
    expect(logger.error).toHaveBeenCalledWith(new Error('Wrong method'))
  })
  test('User without having a required role is redirected to error page', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce(userNoRoles)
    const res = await testHandler(api, { method: 'POST', body, query: {} })
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(`/500`)
    expect(logger.error).toHaveBeenCalledWith(new Error('User does not have a valid role'))
  })
})
