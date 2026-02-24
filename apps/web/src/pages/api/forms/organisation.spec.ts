/* eslint-disable @typescript-eslint/no-unsafe-assignment -- mock objects in tests do not conform to strict typing */
import { authService } from '@nihr-ui/auth'
import { emailService } from '@nihr-ui/email'
import { logger } from '@nihr-ui/logger'
import type { SysRefInvitationStatus, SysRefOrganisationRole, UserOrganisationInvitation } from 'database'
import type { NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import type { RequestOptions } from 'node-mocks-http'
import { createRequest, createResponse } from 'node-mocks-http'
import { Mock } from 'ts-mockery'

import { userNoRoles, userWithContactManagerRole } from '@/__mocks__/session'
import { EXTERNAL_CRN_TERMS_CONDITIONS_URL, EXTERNAL_CRN_URL, SIGN_IN_PAGE, SUPPORT_PAGE } from '@/constants/routes'
import type { OrganisationWithRelations, UserOrganisationWithRelations } from '@/lib/organisations'
import { getOrganisationById } from '@/lib/organisations'
import { prismaClient } from '@/lib/prisma'
import type { OrganisationAddInputs } from '@/utils/schemas'

import type { ExtendedNextApiRequest } from './organisation'
import api from './organisation'

jest.mock('next-auth/next')
jest.mock('@nihr-ui/logger')
jest.mock('@nihr-ui/email')
jest.mock('@nihr-ui/auth')
jest.mock('@/lib/organisations')

jest.mock('node:crypto', () => ({
  randomBytes: () => 'mocked-token',
}))

type ApiRequest = ExtendedNextApiRequest
type ApiResponse = NextApiResponse

const testHandler = async (handler: typeof api, options: RequestOptions) => {
  const req = createRequest<ApiRequest>(options)
  const res = createResponse<ApiResponse>()
  await handler(req, res)
  return res
}

const findSysRefRoleResponse = Mock.of<SysRefOrganisationRole>({
  id: 999,
  name: 'SponsorContact',
})

const findSysRefInvitationStatusResponse = Mock.of<SysRefInvitationStatus>({
  id: 121,
  name: 'Pending',
})

const findOrgResponse = Mock.of<OrganisationWithRelations>({
  id: 2,
  name: 'Test Organisation',
  roles: [],
})

const currentDate = new Date('2025-03-31')

/* -------------------------------------------------------------------------- */
/* SUCCESS CASES                                                              */
/* -------------------------------------------------------------------------- */

describe('Successful organisation sponsor contact invitation', () => {
  const registrationToken = 'mocked-token'

  const body: OrganisationAddInputs = {
    organisationId: '321',
    emailAddress: 'tom.christian@nihr.ac.uk',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(getServerSession).mockResolvedValueOnce(userWithContactManagerRole)

    // Correct organisation lookup (handler uses this)
    jest.mocked(getOrganisationById).mockResolvedValue(findOrgResponse)

    // Correct Zod-shaped IDG response
    const idgResponse: Awaited<ReturnType<typeof authService.getUser>> = {
      success: true,
      data: {
        totalResults: 0,
        startIndex: 0,
        itemsPerPage: 0,
        schemas: [],
        Resources: [],
      },
    }

    jest.mocked(authService.getUser).mockResolvedValue(idgResponse)

    // Correct Prisma User return
    const prismaUser = {
      id: 2,
      name: null,
      email: body.emailAddress,
      identityGatewayId: null,
      registrationToken: null,
      registrationConfirmed: false,
      isDeleted: false,
      lastLogin: null,
    }

    jest.mocked(prismaClient.user.upsert).mockResolvedValue(prismaUser)
    jest.mocked(prismaClient.user.findUniqueOrThrow).mockResolvedValue(prismaUser)

    logger.info = jest.fn()
  })

  /* ------------------------------ NEW USER -------------------------------- */

  test('New user', async () => {
    jest.useFakeTimers().setSystemTime(currentDate)

    const updateOrgResponse = Mock.of<OrganisationWithRelations>({
      id: 2,
      roles: [],
      name: 'Mock org name',
      users: [
        {
          id: 555,
          user: {
            id: 2,
            email: body.emailAddress,
            registrationConfirmed: false,
            registrationToken,
          },
        },
      ],
    })

    const updatedUser = {
      id: 2,
      name: null,
      email: body.emailAddress,
      identityGatewayId: null,
      registrationToken,
      registrationConfirmed: false,
      isDeleted: false,
      lastLogin: null,
    }

    const messageId = '121'

    // Correct invitation mock
    const invitation: UserOrganisationInvitation = {
      id: 1,
      userOrganisationId: 555,
      messageId,
      timestamp: currentDate,
      statusId: 121,
      failureNotifiedAt: null,
      createdAt: currentDate,
      updatedAt: currentDate,
      sentById: userWithContactManagerRole.user?.id ?? 1,
      isDeleted: false,
    }

    jest.mocked(prismaClient.userOrganisation.findFirst).mockResolvedValueOnce(null)

    jest.mocked(prismaClient.sysRefRole.findFirstOrThrow).mockResolvedValue(findSysRefRoleResponse)

    const updateOrgMock = jest.mocked(prismaClient.organisation.update).mockResolvedValue(updateOrgResponse)

    // Two update calls: token then role
    jest.mocked(prismaClient.user.update).mockResolvedValue(updatedUser)
    jest.mocked(prismaClient.user.update).mockResolvedValue(updatedUser)

    jest.mocked(emailService.sendEmail).mockResolvedValue({
      messageId,
      recipients: [],
    })

    jest
      .mocked(prismaClient.sysRefInvitationStatus.findFirstOrThrow)
      .mockResolvedValue(findSysRefInvitationStatusResponse)

    jest.mocked(prismaClient.userOrganisationInvitation.create).mockResolvedValue(invitation)

    const res = await testHandler(api, {
      method: 'POST',
      body,
    })

    expect(updateOrgMock).toHaveBeenCalledWith({
      where: { id: Number(body.organisationId) },
      include: {
        users: {
          where: { user: { email: body.emailAddress } },
          select: { id: true, user: true },
        },
      },
      data: {
        users: {
          create: {
            createdBy: {
              connect: { id: userWithContactManagerRole.user?.id },
            },
            updatedBy: {
              connect: { id: userWithContactManagerRole.user?.id },
            },
            user: { connect: { email: body.emailAddress } },
          },
        },
      },
    })

    // First update call (token)
    expect(prismaClient.user.update).toHaveBeenNthCalledWith(1, {
      where: { email: body.emailAddress },
      data: {
        registrationToken: 'mocked-token',
        registrationConfirmed: false,
      },
    })

    // Second update call (role)
    expect(prismaClient.user.update).toHaveBeenNthCalledWith(2, {
      where: { email: body.emailAddress },
      data: {
        roles: {
          createMany: {
            data: {
              roleId: 999,
              createdById: userWithContactManagerRole.user?.id,
              updatedById: userWithContactManagerRole.user?.id,
            },
            skipDuplicates: true,
          },
        },
      },
    })

    expect(emailService.sendEmail).toHaveBeenCalledWith({
      to: body.emailAddress,
      subject: 'Assess the progress of your studies',
      htmlTemplate: expect.any(Function),
      textTemplate: expect.any(Function),
      templateData: {
        organisationName: updateOrgResponse.name,
        rdnLink: EXTERNAL_CRN_URL,
        requestSupportLink: `http://localhost:3000${SUPPORT_PAGE}`,
        signInLink: `http://localhost:3000/auth/signin?registrationToken=${registrationToken}`,
        termsAndConditionsLink: EXTERNAL_CRN_TERMS_CONDITIONS_URL,
      },
    })

    expect(res._getRedirectUrl()).toBe(`/organisations/${body.organisationId}?success=1`)
  })

  /* -------------------- EXISTING CONFIRMED USER -------------------- */

  test('Existing user - registration confirmed', async () => {
    jest.useFakeTimers().setSystemTime(currentDate)

    jest.mocked(authService.getUser).mockResolvedValue({
      success: true,
      data: {
        totalResults: 1,
        startIndex: 1,
        itemsPerPage: 1,
        schemas: ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
        Resources: [
          {
            id: 'idg-123',
            userName: 'idg-123',
            groups: [],
          },
        ],
      },
    })

    jest.mocked(prismaClient.user.findUniqueOrThrow).mockResolvedValue({
      id: 2,
      name: null,
      email: body.emailAddress,
      identityGatewayId: 'idg-123',
      registrationToken: null,
      registrationConfirmed: true,
      isDeleted: false,
      lastLogin: null,
    })

    const updateOrgResponse = Mock.of<OrganisationWithRelations>({
      id: 2,
      name: 'Mock org name',
      roles: [],
      users: [
        {
          id: 444,
          user: {
            id: 2,
            email: body.emailAddress,
            registrationConfirmed: true,
            registrationToken: null,
          },
        },
      ],
    })

    jest.mocked(prismaClient.userOrganisation.findFirst).mockResolvedValue(null)

    jest.mocked(prismaClient.sysRefRole.findFirstOrThrow).mockResolvedValue(findSysRefRoleResponse)

    jest.mocked(prismaClient.organisation.update).mockResolvedValue(updateOrgResponse)

    jest.mocked(prismaClient.user.update).mockResolvedValue({
      id: 2,
      name: null,
      email: body.emailAddress,
      identityGatewayId: 'idg-123',
      registrationToken: null,
      registrationConfirmed: true,
      isDeleted: false,
      lastLogin: null,
    })

    const messageId = '121'
    jest.mocked(emailService.sendEmail).mockResolvedValue({
      messageId,
      recipients: [],
    })

    jest
      .mocked(prismaClient.sysRefInvitationStatus.findFirstOrThrow)
      .mockResolvedValue(findSysRefInvitationStatusResponse)

    const invitation: UserOrganisationInvitation = {
      id: 1,
      userOrganisationId: 444,
      messageId,
      timestamp: currentDate,
      statusId: 121,
      failureNotifiedAt: null,
      createdAt: currentDate,
      updatedAt: currentDate,
      sentById: userWithContactManagerRole.user?.id ?? 1,
      isDeleted: false,
    }

    jest.mocked(prismaClient.userOrganisationInvitation.create).mockResolvedValue(invitation)

    const res = await testHandler(api, {
      method: 'POST',
      body,
    })

    expect(emailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        templateData: expect.objectContaining({
          signInLink: 'http://localhost:3000/auth/signin',
        }),
      })
    )

    expect(res._getRedirectUrl()).toBe(`/organisations/${body.organisationId}?success=1`)
  })

  /* ------------------------ RE-ACTIVATE USER ----------------------- */

  test('Re-add deleted contact', async () => {
    jest.useFakeTimers().setSystemTime(currentDate)

    jest.mocked(prismaClient.userOrganisation.findFirst).mockResolvedValue({
      id: 123,
      isDeleted: true,
    } as UserOrganisationWithRelations)

    jest.mocked(prismaClient.sysRefRole.findFirstOrThrow).mockResolvedValue(findSysRefRoleResponse)

    const updateOrgResponse = Mock.of<OrganisationWithRelations>({
      id: 2,
      name: 'Mock org name',
      roles: [],
      users: [{ id: 123, user: { email: body.emailAddress } }],
    })

    jest.mocked(prismaClient.organisation.update).mockResolvedValue(updateOrgResponse)

    jest.mocked(prismaClient.user.update).mockResolvedValue({
      id: 2,
      name: null,
      email: body.emailAddress,
      identityGatewayId: null,
      registrationToken: null,
      registrationConfirmed: true,
      isDeleted: false,
      lastLogin: null,
    })

    const messageId = '121'

    jest.mocked(emailService.sendEmail).mockResolvedValue({
      messageId,
      recipients: [],
    })

    jest
      .mocked(prismaClient.sysRefInvitationStatus.findFirstOrThrow)
      .mockResolvedValue(findSysRefInvitationStatusResponse)

    const invitation: UserOrganisationInvitation = {
      id: 1,
      userOrganisationId: 123,
      messageId,
      timestamp: currentDate,
      statusId: 121,
      failureNotifiedAt: null,
      createdAt: currentDate,
      updatedAt: currentDate,
      sentById: userWithContactManagerRole.user?.id ?? 1,
      isDeleted: false,
    }

    jest.mocked(prismaClient.userOrganisationInvitation.create).mockResolvedValue(invitation)

    const res = await testHandler(api, {
      method: 'POST',
      body,
    })

    expect(emailService.sendEmail).toHaveBeenCalled()

    expect(res._getRedirectUrl()).toBe(`/organisations/${body.organisationId}?success=1`)
  })
})

/* -------------------------------------------------------------------------- */
/* FAILURE CASES                                                              */
/* -------------------------------------------------------------------------- */

describe('Failed organisation sponsor contact invitation', () => {
  const body: OrganisationAddInputs = {
    organisationId: '123',
    emailAddress: 'tom.christian@nihr.ac.uk',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    logger.info = jest.fn()
    logger.error = jest.fn()
  })

  test('User not logged in redirects to sign in page', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce(null)
    const res = await testHandler(api, {
      method: 'POST',
      body,
      query: {},
    })
    expect(res._getRedirectUrl()).toBe(SIGN_IN_PAGE)
  })

  test('User without role is redirected', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce(userNoRoles)
    const res = await testHandler(api, {
      method: 'POST',
      body,
      query: {},
    })
    expect(res._getRedirectUrl()).toBe(`/500`)
  })

  test('Wrong http method returns fatal=1', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce(userWithContactManagerRole)
    const res = await testHandler(api, {
      method: 'GET',
      body,
      query: {},
    })
    expect(res._getRedirectUrl()).toBe(`/organisations/${body.organisationId}/?fatal=1`)
  })

  test('Validation errors redirect to the form', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce(userWithContactManagerRole)

    const invalidBody = {
      organisationId: '123',
    }

    const res = await testHandler(api, {
      method: 'POST',
      body: invalidBody,
    })

    expect(res._getRedirectUrl()).toBe(`/organisations/123/?emailAddressError=Required`)
  })

  test('Attempting to invite existing contact returns fatal=2', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce(userWithContactManagerRole)

    jest.mocked(getOrganisationById).mockResolvedValue(findOrgResponse)

    jest.mocked(prismaClient.sysRefRole.findFirstOrThrow).mockResolvedValue(findSysRefRoleResponse)

    jest.mocked(prismaClient.userOrganisation.findFirst).mockResolvedValue({
      id: 123,
      isDeleted: false,
    } as UserOrganisationWithRelations)

    const res = await testHandler(api, {
      method: 'POST',
      body,
    })

    expect(res._getRedirectUrl()).toBe(`/organisations/${body.organisationId}/?fatal=2`)
    expect(emailService.sendEmail).not.toHaveBeenCalled()
  })
})
