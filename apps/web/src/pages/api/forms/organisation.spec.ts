import { emailService } from '@nihr-ui/email'
import { logger } from '@nihr-ui/logger'
import type {
  Assessment,
  Study,
  SysRefInvitationStatus,
  SysRefOrganisationRole,
  UserOrganisationInvitation,
} from 'database'
import type { NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import type { RequestOptions } from 'node-mocks-http'
import { createRequest, createResponse } from 'node-mocks-http'
import { Mock } from 'ts-mockery'
import { ZodError } from 'zod'

import { userNoRoles, userWithContactManagerRole } from '@/__mocks__/session'
import { EXTERNAL_CRN_TERMS_CONDITIONS_URL, EXTERNAL_CRN_URL, SIGN_IN_PAGE, SUPPORT_PAGE } from '@/constants/routes'
import type { OrganisationWithRelations, UserOrganisationWithRelations } from '@/lib/organisations'
import { prismaClient } from '@/lib/prisma'
import { AuthError } from '@/utils/auth'
import type { OrganisationAddInputs } from '@/utils/schemas'

import type { ExtendedNextApiRequest } from './organisation'
import api from './organisation'

jest.mock('next-auth/next')
jest.mock('@nihr-ui/logger')
jest.mock('@nihr-ui/email')
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

const findOrgResponse = Mock.of<OrganisationWithRelations>({ id: 2, name: 'Test Organisation', roles: [] })

const currentDate = new Date('2025-03-31')

describe('Successful organisation sponsor contact invitation', () => {
  const registrationToken = 'mock-token'

  const body: OrganisationAddInputs = {
    organisationId: '321',
    emailAddress: 'tom.christian@nihr.ac.uk',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(getServerSession).mockResolvedValueOnce(userWithContactManagerRole)
    logger.info = jest.fn()
  })

  test('New user', async () => {
    jest.useFakeTimers().setSystemTime(currentDate)
    const updateOrgResponse = Mock.of<OrganisationWithRelations>({
      id: 2,
      roles: [],
      name: 'Mock org name',
      users: [
        {
          user: {
            email: body.emailAddress,
            registrationConfirmed: false,
            registrationToken,
            id: 2,
          },
        },
      ],
    })

    const updateUserResponse = {
      id: 1,
      name: null,
      email: body.emailAddress,
      identityGatewayId: null,
      registrationToken,
      registrationConfirmed: false,
      isDeleted: false,
      lastLogin: null,
    }

    const messageId = '121'

    const createUserOrgInvitation = Mock.of<UserOrganisationInvitation>({
      id: 1,
      userOrganisationId: updateOrgResponse.users[0].id,
      messageId,
      timestamp: currentDate,
      statusId: findSysRefInvitationStatusResponse.id,
      failureNotifiedAt: null,
      createdAt: currentDate,
      updatedAt: currentDate,
    })

    jest.mocked(prismaClient.organisation.findFirst).mockResolvedValueOnce(findOrgResponse)

    const findSysRefRoleMock = jest
      .mocked(prismaClient.sysRefRole.findFirstOrThrow)
      .mockResolvedValueOnce(findSysRefRoleResponse)
    const updateOrgMock = jest.mocked(prismaClient.organisation.update).mockResolvedValueOnce(updateOrgResponse)

    jest.mocked(prismaClient.user.update).mockResolvedValueOnce(updateUserResponse)

    jest.mocked(emailService.sendEmail).mockResolvedValueOnce({ messageId, recipients: [] })
    jest
      .mocked(prismaClient.sysRefInvitationStatus.findFirstOrThrow)
      .mockResolvedValueOnce(findSysRefInvitationStatusResponse)

    jest.mocked(prismaClient.userOrganisationInvitation.create).mockResolvedValueOnce(createUserOrgInvitation)

    const res = await testHandler(api, { method: 'POST', body })

    expect(findSysRefRoleMock).toHaveBeenCalledWith({ where: { isDeleted: false, name: 'SponsorContact' } })

    // Org is updated
    expect(updateOrgMock).toHaveBeenCalledWith({
      where: { id: Number(body.organisationId) },
      include: {
        users: {
          select: {
            id: true,
            user: true,
          },
          where: {
            user: {
              email: body.emailAddress,
            },
          },
        },
      },
      data: {
        users: {
          create: {
            createdBy: { connect: { id: userWithContactManagerRole.user?.id } },
            updatedBy: { connect: { id: userWithContactManagerRole.user?.id } },
            user: {
              connectOrCreate: {
                create: {
                  email: body.emailAddress,
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

    // User role is added
    expect(prismaClient.user.update).toHaveBeenCalledWith({
      where: {
        email: body.emailAddress,
      },
      data: {
        registrationConfirmed: false,
        registrationToken: 'mocked-token',
        roles: {
          // If a user is not assigned the sponsor contact role, assign it
          createMany: {
            data: {
              roleId: findSysRefRoleResponse.id,
              createdById: userWithContactManagerRole.user?.id,
              updatedById: userWithContactManagerRole.user?.id,
            },
            skipDuplicates: true,
          },
        },
      },
    })

    // Send email
    expect(emailService.sendEmail).toHaveBeenCalledWith({
      subject: 'Assess the progress of your studies',
      templateData: {
        rdnLink: EXTERNAL_CRN_URL,
        organisationName: updateOrgResponse.name,
        requestSupportLink: `http://localhost:3000${SUPPORT_PAGE}`,
        signInLink: `http://localhost:3000/auth/signin?registrationToken=${registrationToken}`,
        termsAndConditionsLink: EXTERNAL_CRN_TERMS_CONDITIONS_URL,
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- valid any
      htmlTemplate: expect.any(Function),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- valid any
      textTemplate: expect.any(Function),
      to: body.emailAddress,
    })

    // Entry in UserOrganisationInvitation table is added
    expect(prismaClient.userOrganisationInvitation.create).toHaveBeenCalledWith({
      data: {
        messageId,
        timestamp: createUserOrgInvitation.timestamp,
        status: {
          connect: {
            id: createUserOrgInvitation.statusId,
          },
        },
        userOrganisation: {
          connect: {
            id: createUserOrgInvitation.userOrganisationId,
          },
        },
        sentBy: { connect: { id: userWithContactManagerRole.user?.id } },
      },
    })

    // Redirect back to organisation page
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(`/organisations/${body.organisationId}?success=1`)

    jest.useRealTimers()
  })

  test('Existing user - registration confirmed', async () => {
    jest.useFakeTimers().setSystemTime(currentDate)

    const updateOrgResponse = Mock.of<OrganisationWithRelations>({
      id: 2,
      roles: [],
      name: 'Mock org name',
      users: [
        {
          user: {
            id: 2,
            email: body.emailAddress,
            registrationConfirmed: false,
            registrationToken: null,
          },
        },
      ],
    })

    const updateUserResponse = {
      id: 1,
      name: null,
      email: body.emailAddress,
      identityGatewayId: 'mock-gateway-id',
      registrationToken: null,
      registrationConfirmed: true,
      isDeleted: false,
      lastLogin: null,
    }

    const messageId = '121'

    const createUserOrgInvitation = Mock.of<UserOrganisationInvitation>({
      id: 1,
      userOrganisationId: updateOrgResponse.users[0].id,
      messageId,
      timestamp: currentDate,
      statusId: findSysRefInvitationStatusResponse.id,
      failureNotifiedAt: null,
      createdAt: currentDate,
      updatedAt: currentDate,
    })

    jest.mocked(prismaClient.user.findUnique).mockResolvedValueOnce(updateUserResponse)
    jest.mocked(prismaClient.organisation.findFirst).mockResolvedValueOnce(findOrgResponse)
    jest.mocked(prismaClient.user.update).mockResolvedValueOnce(updateUserResponse)
    jest.mocked(emailService.sendEmail).mockResolvedValueOnce({ messageId, recipients: [] })
    jest
      .mocked(prismaClient.sysRefInvitationStatus.findFirstOrThrow)
      .mockResolvedValueOnce(findSysRefInvitationStatusResponse)

    jest.mocked(prismaClient.userOrganisationInvitation.create).mockResolvedValueOnce(createUserOrgInvitation)

    const findSysRefRoleMock = jest
      .mocked(prismaClient.sysRefRole.findFirstOrThrow)
      .mockResolvedValueOnce(findSysRefRoleResponse)
    const updateOrgMock = jest.mocked(prismaClient.organisation.update).mockResolvedValueOnce(updateOrgResponse)

    const res = await testHandler(api, { method: 'POST', body })

    expect(findSysRefRoleMock).toHaveBeenCalledWith({ where: { isDeleted: false, name: 'SponsorContact' } })

    // Org is updated
    expect(updateOrgMock).toHaveBeenCalledWith({
      where: { id: Number(body.organisationId) },
      include: {
        users: {
          select: {
            id: true,
            user: true,
          },
          where: {
            user: {
              email: body.emailAddress,
            },
          },
        },
      },
      data: {
        users: {
          create: {
            createdBy: { connect: { id: userWithContactManagerRole.user?.id } },
            updatedBy: { connect: { id: userWithContactManagerRole.user?.id } },
            user: {
              connectOrCreate: {
                create: {
                  email: body.emailAddress,
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

    // User role is added
    expect(prismaClient.user.update).toHaveBeenCalledWith({
      where: {
        email: body.emailAddress,
      },
      data: {
        roles: {
          // If a user is not assigned the sponsor contact role, assign it
          createMany: {
            data: {
              roleId: findSysRefRoleResponse.id,
              createdById: userWithContactManagerRole.user?.id,
              updatedById: userWithContactManagerRole.user?.id,
            },
            skipDuplicates: true,
          },
        },
      },
    })

    // Send email
    expect(emailService.sendEmail).toHaveBeenCalledWith({
      subject: 'Assess the progress of your studies',
      templateData: {
        rdnLink: EXTERNAL_CRN_URL,
        organisationName: updateOrgResponse.name,
        requestSupportLink: `http://localhost:3000${SUPPORT_PAGE}`,
        signInLink: 'http://localhost:3000/auth/signin',
        termsAndConditionsLink: EXTERNAL_CRN_TERMS_CONDITIONS_URL,
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- valid any
      htmlTemplate: expect.any(Function),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- valid any
      textTemplate: expect.any(Function),
      to: body.emailAddress,
    })

    // Entry in UserOrganisationInvitation table is added
    expect(prismaClient.userOrganisationInvitation.create).toHaveBeenCalledWith({
      data: {
        messageId,
        timestamp: createUserOrgInvitation.timestamp,
        status: {
          connect: {
            id: createUserOrgInvitation.statusId,
          },
        },
        userOrganisation: {
          connect: {
            id: createUserOrgInvitation.userOrganisationId,
          },
        },
        sentBy: {
          connect: {
            id: userWithContactManagerRole.user?.id,
          },
        },
      },
    })

    // Redirect back to organisation page
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(`/organisations/${body.organisationId}?success=1`)

    jest.useRealTimers()
  })

  test('Re-add deleted contact', async () => {
    jest.useFakeTimers().setSystemTime(currentDate)
    const updateOrgResponse = Mock.of<OrganisationWithRelations>({
      id: 2,
      roles: [],
      name: 'Mock org name',
      users: [
        {
          user: {
            email: body.emailAddress,
            registrationConfirmed: false,
            registrationToken: null,
          },
        },
      ],
    })

    const updateUserResponse = {
      id: 1,
      name: null,
      email: body.emailAddress,
      identityGatewayId: 'mock-gateway-id',
      registrationToken: null,
      registrationConfirmed: true,
      isDeleted: false,
      lastLogin: null,
    }

    const messageId = '121'

    const createUserOrgInvitation = Mock.of<UserOrganisationInvitation>({
      id: 1,
      userOrganisationId: updateOrgResponse.users[0].id,
      messageId,
      timestamp: currentDate,
      statusId: findSysRefInvitationStatusResponse.id,
      failureNotifiedAt: null,
      createdAt: currentDate,
      updatedAt: currentDate,
    })

    jest.mocked(prismaClient.user.findUnique).mockResolvedValueOnce(updateUserResponse)
    jest.mocked(prismaClient.user.update).mockResolvedValueOnce(updateUserResponse)
    jest.mocked(prismaClient.organisation.findFirst).mockResolvedValueOnce(findOrgResponse)
    jest.mocked(emailService.sendEmail).mockResolvedValueOnce({ messageId, recipients: [] })
    jest
      .mocked(prismaClient.sysRefInvitationStatus.findFirstOrThrow)
      .mockResolvedValueOnce(findSysRefInvitationStatusResponse)

    jest.mocked(prismaClient.userOrganisationInvitation.create).mockResolvedValueOnce(createUserOrgInvitation)

    const mockUserOrganisation = Mock.of<UserOrganisationWithRelations>({
      id: 123,
      isDeleted: true,
    })

    jest.mocked(prismaClient.userOrganisation.findFirst).mockResolvedValueOnce(mockUserOrganisation)

    const findSysRefRoleMock = jest
      .mocked(prismaClient.sysRefRole.findFirstOrThrow)
      .mockResolvedValueOnce(findSysRefRoleResponse)
    const updateOrgMock = jest.mocked(prismaClient.organisation.update).mockResolvedValueOnce(updateOrgResponse)

    const res = await testHandler(api, { method: 'POST', body })

    expect(findSysRefRoleMock).toHaveBeenCalledWith({ where: { isDeleted: false, name: 'SponsorContact' } })

    // Org is updated
    expect(updateOrgMock).toHaveBeenCalledWith({
      where: { id: Number(body.organisationId) },
      include: {
        users: {
          select: {
            id: true,
            user: true,
          },
          where: {
            user: {
              email: body.emailAddress,
            },
          },
        },
      },
      data: {
        users: {
          update: {
            where: {
              id: mockUserOrganisation.id,
            },
            data: {
              isDeleted: false,
              updatedBy: { connect: { id: userWithContactManagerRole.user?.id } },
            },
          },
        },
      },
    })

    // Send email
    expect(emailService.sendEmail).toHaveBeenCalledWith({
      subject: 'Assess the progress of your studies',
      templateData: {
        rdnLink: EXTERNAL_CRN_URL,
        organisationName: updateOrgResponse.name,
        requestSupportLink: `http://localhost:3000${SUPPORT_PAGE}`,
        signInLink: 'http://localhost:3000/auth/signin',
        termsAndConditionsLink: EXTERNAL_CRN_TERMS_CONDITIONS_URL,
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- valid any
      htmlTemplate: expect.any(Function),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- valid any
      textTemplate: expect.any(Function),
      to: body.emailAddress,
    })

    // Entry in UserOrganisationInvitation table is added
    expect(prismaClient.userOrganisationInvitation.create).toHaveBeenCalledWith({
      data: {
        messageId,
        timestamp: createUserOrgInvitation.timestamp,
        status: {
          connect: {
            id: createUserOrgInvitation.statusId,
          },
        },
        userOrganisation: {
          connect: {
            id: createUserOrgInvitation.userOrganisationId,
          },
        },
        sentBy: {
          connect: {
            id: userWithContactManagerRole.user?.id,
          },
        },
      },
    })

    // Redirect back to organisation page
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(`/organisations/${body.organisationId}?success=1`)
  })
})

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
    const res = await testHandler(api, { method: 'POST', body, query: {} })
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(SIGN_IN_PAGE)
    expect(logger.error).toHaveBeenCalledWith(new AuthError('Not signed in'))
  })

  test('User without having a required role is redirected to error page', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce(userNoRoles)
    const res = await testHandler(api, { method: 'POST', body, query: {} })
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(`/500`)
    expect(logger.error).toHaveBeenCalledWith(new Error('User does not have a valid role'))
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

  test('Attempting to invite already existing contact redirects with error', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce(userWithContactManagerRole)
    jest.mocked(prismaClient.organisation.findFirst).mockResolvedValueOnce(findOrgResponse)
    jest.mocked(prismaClient.sysRefRole.findFirstOrThrow).mockResolvedValueOnce(findSysRefRoleResponse)

    const mockUserOrganisation = Mock.of<UserOrganisationWithRelations>({
      id: 123,
      isDeleted: false,
    })

    jest.mocked(prismaClient.userOrganisation.findFirst).mockResolvedValueOnce(mockUserOrganisation)

    const res = await testHandler(api, { method: 'POST', body })

    expect(jest.mocked(prismaClient.organisation.update)).not.toHaveBeenCalled()

    expect(emailService.sendEmail).not.toHaveBeenCalled()

    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(`/organisations/${body.organisationId}/?fatal=2`)
    expect(logger.error).toHaveBeenCalledWith(
      'Tried to add contact with email %s to organisation %s, but active relationship already exists',
      body.emailAddress,
      findOrgResponse.name
    )
  })
})
