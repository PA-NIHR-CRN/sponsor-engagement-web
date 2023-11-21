import { Mock } from 'ts-mockery'
import type { RequestOptions } from 'node-mocks-http'
import { createResponse, createRequest } from 'node-mocks-http'
import type { NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { logger } from '@nihr-ui/logger'
import { prismaClient } from '../../../lib/prisma'
import type { OrganisationRemoveContactInputs } from '../../../utils/schemas'
import { userNoRoles, userWithContactManagerRole } from '../../../__mocks__/session'
import { AuthError } from '../../../utils/auth'
import { SIGN_IN_PAGE } from '../../../constants/routes'
import type { UserOrganisationWithRelations } from '../../../lib/organisations'
import type { ExtendedNextApiRequest } from './removeContact'
import api from './removeContact'

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

describe('Successful remove organisation contact', () => {
  const body: OrganisationRemoveContactInputs = {
    userOrganisationId: '123',
  }

  const findUserOrgResponse = Mock.of<UserOrganisationWithRelations>({ id: 123, organisation: { id: 12345 } })

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(getServerSession).mockResolvedValueOnce(userWithContactManagerRole)
    logger.info = jest.fn()
    logger.error = jest.fn()
  })

  test('Removing user from an organisation', async () => {
    const updateOrgResponse = Mock.of<UserOrganisationWithRelations>({
      id: 123,
    })

    jest.mocked(prismaClient.userOrganisation.findFirst).mockResolvedValueOnce(findUserOrgResponse)

    const updateUserOrgMock = jest.mocked(prismaClient.userOrganisation.update).mockResolvedValueOnce(updateOrgResponse)

    const res = await testHandler(api, { method: 'POST', body })

    // User organisation is flagged as deleted and updatedBy is set to the logged in contact manager
    expect(updateUserOrgMock).toHaveBeenCalledWith({
      where: { id: Number(body.userOrganisationId) },
      include: {
        organisation: true,
        user: true,
      },
      data: {
        isDeleted: true,
        updatedBy: { connect: { id: userWithContactManagerRole.user?.id } },
      },
    })

    // Redirect back to organisation page
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(`/organisations/${findUserOrgResponse.organisation.id}?success=2`)
  })
})

describe('Failed organisation sponsor contact invitation', () => {
  const body: OrganisationRemoveContactInputs = {
    userOrganisationId: '123',
  }

  test('User not logged in redirects to sign in page', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce(null)
    const res = await testHandler(api, { method: 'POST', body, query: {} })
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(SIGN_IN_PAGE)
    expect(logger.error).toHaveBeenCalledWith(new AuthError('Not signed in'))
  })

  test('User without roles redirects to error page', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce(userNoRoles)
    const res = await testHandler(api, { method: 'POST', body, query: {} })
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(`/500`)
    expect(logger.error).toHaveBeenCalledWith(new Error('No role found for user'))
  })

  test('Wrong http method redirects back to the form with a fatal error', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce(userWithContactManagerRole)
    const res = await testHandler(api, { method: 'GET', body, query: {} })
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(`/organisations/remove-contact/123/?fatal=1`)
    expect(logger.error).toHaveBeenCalledWith(new Error('Wrong method'))
  })
})
