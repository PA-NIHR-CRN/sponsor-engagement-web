import type { Assessment, Study, SysRefOrganisationRole } from 'database'
import { Mock } from 'ts-mockery'
import type { RequestOptions } from 'node-mocks-http'
import { createResponse, createRequest } from 'node-mocks-http'
import type { NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { ZodError } from 'zod'
import { logger } from '@nihr-ui/logger'
import { prismaClient } from '../../../lib/prisma'
import type { OrganisationAddInputs } from '../../../utils/schemas'
import { userNoRoles, userWithContactManagerRole } from '../../../__mocks__/session'
import { AuthError } from '../../../utils/auth'
import { SIGN_IN_PAGE } from '../../../constants/routes'
import type { OrganisationWithRelations } from '../../../lib/organisations'
import type { ExtendedNextApiRequest } from './organisation'
import api from './organisation'

jest.mock('next-auth/next')
jest.mock('@nihr-ui/logger')

type ApiRequest = ExtendedNextApiRequest
type ApiResponse = NextApiResponse

const testHandler = async (handler: typeof api, options: RequestOptions) => {
  const req = createRequest<ApiRequest>(options)
  const res = createResponse<ApiResponse>()
  await handler(req, res)
  return res
}

describe('Successful organisation sponsor contact invitation', () => {
  const body: OrganisationAddInputs = {
    organisationId: '123',
    emailAddress: 'tom.christian@nihr.ac.uk',
  }

  const findSysRefOrgRoleResponse = Mock.of<SysRefOrganisationRole>({
    id: 123,
    name: 'Clinical Research Sponsor',
  })
  const findOrgResponse = Mock.of<OrganisationWithRelations>({ id: 2, roles: [] })
  const findOrgWithSponsorRoleResponse = Mock.of<OrganisationWithRelations>({
    id: 2,
    roles: [{ role: { name: 'Clinical Research Sponsor' } }],
  })
  const updateOrgResponse = Mock.of<OrganisationWithRelations>({ id: 2, roles: [] })

  beforeEach(() => {
    jest.mocked(getServerSession).mockResolvedValueOnce(userWithContactManagerRole)
    logger.info = jest.fn()
  })

  test('Invites the provided contact', async () => {
    jest.mocked(prismaClient.organisation.findFirst).mockResolvedValueOnce(findOrgWithSponsorRoleResponse)

    const findSysRefOrgRoleMock = jest
      .mocked(prismaClient.sysRefOrganisationRole.findFirstOrThrow)
      .mockResolvedValueOnce(findSysRefOrgRoleResponse)
    const updateOrgMock = jest.mocked(prismaClient.organisation.update).mockResolvedValueOnce(updateOrgResponse)

    const res = await testHandler(api, { method: 'POST', body })

    // Do not attempt to add sponsor role if already present
    expect(findSysRefOrgRoleMock).not.toHaveBeenCalled()

    // Org is updated
    expect(updateOrgMock).toHaveBeenCalledWith({
      where: { id: 123 },
      data: {
        users: {
          create: {
            createdBy: { connect: { id: userWithContactManagerRole.user?.id } },
            updatedBy: { connect: { id: userWithContactManagerRole.user?.id } },
            user: {
              connectOrCreate: {
                create: {
                  email: body.emailAddress,
                  identityGatewayId: '',
                },
                where: {
                  email: body.emailAddress,
                },
              },
            },
          },
        },
      },
    })

    // Redirect back to organisation page
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe('/organisations/123?success=1')
  })

  test('Invites the provided contact and updates the organisation to include a sponsor role when not already present', async () => {
    jest.mocked(prismaClient.organisation.findFirst).mockResolvedValueOnce(findOrgResponse)
    jest.mocked(prismaClient.sysRefOrganisationRole.findFirstOrThrow).mockResolvedValueOnce(findSysRefOrgRoleResponse)

    const updateOrgMock = jest.mocked(prismaClient.organisation.update).mockResolvedValueOnce(updateOrgResponse)

    const res = await testHandler(api, { method: 'POST', body })

    // Org is updated
    expect(updateOrgMock).toHaveBeenCalledWith({
      where: { id: 123 },
      data: {
        roles: {
          create: {
            role: {
              connect: findSysRefOrgRoleResponse,
            },
          },
        },
      },
    })

    expect(logger.info).toHaveBeenCalledWith(`Added sponsor contact role to org 123`)

    expect(updateOrgMock).toHaveBeenCalledWith({
      where: { id: 123 },
      data: {
        users: {
          create: {
            createdBy: { connect: { id: userWithContactManagerRole.user?.id } },
            updatedBy: { connect: { id: userWithContactManagerRole.user?.id } },
            user: {
              connectOrCreate: {
                create: {
                  email: body.emailAddress,
                  identityGatewayId: '',
                },
                where: {
                  email: body.emailAddress,
                },
              },
            },
          },
        },
      },
    })

    // Redirect back to organisation page
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe('/organisations/123?success=1')
  })
})

describe('Failed organisation sponsor contact invitation', () => {
  const body: OrganisationAddInputs = {
    organisationId: '123',
    emailAddress: 'tom.christian@nihr.ac.uk',
  }

  beforeEach(() => {
    logger.info = jest.fn()
    logger.error = jest.fn()
  })

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

  test('User without an organisation redirects to error page', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce({
      ...userWithContactManagerRole,
      user: { ...userWithContactManagerRole.user, organisations: [] },
    })
    const res = await testHandler(api, { method: 'POST', body, query: {} })
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(`/500`)
    expect(logger.error).toHaveBeenCalledWith(new Error('No organisations found for user'))
  })

  test('Wrong http method redirects back to the form with a fatal error', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce(userWithContactManagerRole)
    const res = await testHandler(api, { method: 'GET', body, query: {} })
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(`/organisations/${body.organisationId}/?fatal=1`)
    expect(logger.error).toHaveBeenCalledWith(new Error('Wrong method'))
  })

  test('Validation errors redirects back to the form with the errors and original values', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce(userWithContactManagerRole)
    jest.mocked(prismaClient.assessment.create).mockResolvedValueOnce(Mock.of<Assessment>({ id: 1 }))
    jest.mocked(prismaClient.study.update).mockResolvedValueOnce(Mock.of<Study>({ id: 2 }))

    const bodyWithValidationIssue: Partial<OrganisationAddInputs> = {
      organisationId: '123',
      emailAddress: undefined,
    }

    const res = await testHandler(api, { method: 'POST', body: bodyWithValidationIssue })

    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(`/organisations/123/?emailAddressError=Required`)
    expect(logger.error).toHaveBeenCalledWith(
      new ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'undefined',
          path: ['emailAddress'],
          message: 'Required',
        },
      ])
    )
  })
})
