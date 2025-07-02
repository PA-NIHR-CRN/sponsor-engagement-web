import { emailService } from '@nihr-ui/email'
import { logger } from '@nihr-ui/logger'
import { type SysRefRole } from 'database'
import type { NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import type { RequestOptions } from 'node-mocks-http'
import { createRequest, createResponse } from 'node-mocks-http'
import { Mock } from 'ts-mockery'

import { userNoRoles, userWithContactManagerRole } from '@/__mocks__/session'
import { Roles } from '@/constants'
import { MANAGE_CONTACT_MANAGERS_PAGE, SIGN_IN_PAGE } from '@/constants/routes'
import type { UserWithRoles } from '@/lib/contactManager'
import { prismaClient } from '@/lib/prisma'
import { AuthError } from '@/utils/auth'
import type { ContactManagerAddInputs } from '@/utils/schemas'

import type { ExtendedNextApiRequest } from './contactManager'
import api from './contactManager'

jest.mock('next-auth/next')
jest.mock('@nihr-ui/logger')
jest.mock('@nihr-ui/email')
jest.mock('node:crypto', () => ({
  randomBytes: () => 'mock-token',
}))

type ApiRequest = ExtendedNextApiRequest
type ApiResponse = NextApiResponse

const testHandler = async (handler: typeof api, options: RequestOptions) => {
  const req = createRequest<ApiRequest>(options)
  const res = createResponse<ApiResponse>()
  await handler(req, res)
  return res
}

const findSysRefRoleResponse = Mock.of<SysRefRole>({
  id: 999,
  name: 'ContactManager',
})

const messageId = '121'

const currentDate = new Date('2025-03-31')

describe('Successful contact Manager invitation', () => {
  const registrationToken = 'mock-token'

  const body: ContactManagerAddInputs = {
    emailAddress: 'tom.christian@nihr.ac.uk',
  }

  const updateUserResponse = {
    id: 123,
    email: 'tom.christian@nihr.ac.uk',
    registrationToken,
    isDeleted: false,
    name: null,
    identityGatewayId: null,
    registrationConfirmed: null,
    lastLogin: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(getServerSession).mockResolvedValueOnce(userWithContactManagerRole)
    logger.info = jest.fn()
  })

  test('New user', async () => {
    jest.useFakeTimers().setSystemTime(currentDate)

    const findSysRefRoleMock = jest
      .mocked(prismaClient.sysRefRole.findFirstOrThrow)
      .mockResolvedValueOnce(findSysRefRoleResponse)

    const findUserMock = jest.mocked(prismaClient.user.findUnique).mockResolvedValueOnce(null)
    jest.mocked(prismaClient.user.create).mockResolvedValueOnce(updateUserResponse)
    jest.mocked(prismaClient.user.update).mockResolvedValueOnce(updateUserResponse)

    jest.mocked(emailService.sendEmail).mockResolvedValueOnce({ messageId, recipients: [] })

    const res = await testHandler(api, { method: 'POST', body })

    expect(findSysRefRoleMock).toHaveBeenCalledWith({ where: { name: 'ContactManager', isDeleted: false } })

    expect(findUserMock).toHaveBeenCalledWith({
      include: { roles: true },
      where: {
        email: body.emailAddress,
      },
    })

    // user is created
    expect(prismaClient.user.create).toHaveBeenCalledWith({
      include: { roles: true },
      data: {
        email: body.emailAddress,
      },
    })

    // user role is updated
    expect(prismaClient.user.update).toHaveBeenCalledWith({
      where: {
        email: body.emailAddress,
      },
      data: {
        registrationConfirmed: false,
        registrationToken,
        roles: {
          // If a user is not assigned the sponsor contact manager role, assign it
          create: {
            roleId: findSysRefRoleResponse.id,
            createdById: userWithContactManagerRole.user?.id,
            updatedById: userWithContactManagerRole.user?.id,
            isDeleted: false,
          },
        },
      },
    })

    // Send email
    expect(emailService.sendEmail).toHaveBeenCalledWith({
      subject: 'NIHR RDN has invited you to be a Contact Manager for the Sponsor Engagement tool',
      templateData: {
        signInLink: `http://localhost:3000/auth/signin?registrationToken=${registrationToken}`,
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- valid any
      htmlTemplate: expect.any(Function),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- valid any
      textTemplate: expect.any(Function),
      to: body.emailAddress,
    })

    // Redirect back to organisation page
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(`${MANAGE_CONTACT_MANAGERS_PAGE}?success=1`)

    jest.useRealTimers()
  })

  test('Existing user - registration confirmed', async () => {
    jest.useFakeTimers().setSystemTime(currentDate)

    const findSysRefRoleMock = jest
      .mocked(prismaClient.sysRefRole.findFirstOrThrow)
      .mockResolvedValueOnce(findSysRefRoleResponse)

    jest.mocked(prismaClient.user.update).mockResolvedValueOnce(updateUserResponse)

    const findUserMock = jest.mocked(prismaClient.user.findUnique).mockResolvedValueOnce({
      id: 123,
      email: 'tom.christian@nihr.ac.uk',
      registrationToken,
      isDeleted: false,
      name: null,
      identityGatewayId: null,
      registrationConfirmed: null,
      lastLogin: null,
    })

    jest.mocked(emailService.sendEmail).mockResolvedValueOnce({ messageId, recipients: [] })

    const res = await testHandler(api, { method: 'POST', body })

    expect(findSysRefRoleMock).toHaveBeenCalledWith({ where: { name: 'ContactManager', isDeleted: false } })

    expect(findUserMock).toHaveBeenCalledWith({
      include: { roles: true },
      where: {
        email: body.emailAddress,
      },
    })
    // user role is updated
    expect(prismaClient.user.update).toHaveBeenCalledWith({
      where: {
        email: body.emailAddress,
      },
      data: {
        registrationConfirmed: false,
        registrationToken,
        roles: {
          // If a user is not assigned the sponsor contact manager role, assign it
          create: {
            roleId: findSysRefRoleResponse.id,
            createdById: userWithContactManagerRole.user?.id,
            updatedById: userWithContactManagerRole.user?.id,
            isDeleted: false,
          },
        },
      },
    })

    // Send email
    expect(emailService.sendEmail).toHaveBeenCalledWith({
      subject: 'NIHR RDN has invited you to be a Contact Manager for the Sponsor Engagement tool',
      templateData: {
        signInLink: `http://localhost:3000/auth/signin?registrationToken=${registrationToken}`,
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- valid any
      htmlTemplate: expect.any(Function),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- valid any
      textTemplate: expect.any(Function),
      to: body.emailAddress,
    })

    // Redirect back to organisation page
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(`${MANAGE_CONTACT_MANAGERS_PAGE}?success=1`)

    jest.useRealTimers()
  })
})

describe('Failed contact manager invitation', () => {
  const body: ContactManagerAddInputs = {
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
    expect(res._getRedirectUrl()).toBe(`${MANAGE_CONTACT_MANAGERS_PAGE}?fatal=1`)
    expect(logger.error).toHaveBeenCalledWith(new Error('Wrong method'))
  })

  // test('Validation errors redirects back to the form with the errors and original values', async () => {
  //   jest.mocked(getServerSession).mockResolvedValueOnce(userWithContactManagerRole)

  //   const bodyWithValidationIssue: Partial<ContactManagerAddInputs> = {
  //     emailAddress: undefined,
  //   }

  //   const res = await testHandler(api, { method: 'POST', body: bodyWithValidationIssue })

  //   expect(res.statusCode).toBe(302)
  //   expect(res._getRedirectUrl()).toBe(`${MANAGE_CONTACT_MANAGERS_PAGE}?emailAddressError=Required`)
  //   expect(logger.error).toHaveBeenCalledWith(
  //     new ZodError([
  //       {
  //         code: 'invalid_type',
  //         expected: 'string',
  //         received: 'undefined',
  //         path: ['emailAddress'],
  //         message: 'Required',
  //       },
  //     ])
  //   )
  // })

  test('Attempting to invite already existing contact redirects with error', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce(userWithContactManagerRole)
    jest.mocked(prismaClient.sysRefRole.findFirstOrThrow).mockResolvedValueOnce(findSysRefRoleResponse)

    const findUserResponse = Mock.of<UserWithRoles>({
      id: 123,
      email: 'tom.christian@nihr.ac.uk',
      registrationToken: null,
      isDeleted: false,
      name: null,
      identityGatewayId: null,
      registrationConfirmed: null,
      lastLogin: null,
      roles: [
        {
          userId: 123,
          roleId: Roles.ContactManager,
          isDeleted: false,
        },
      ],
    })

    const findUserMock = jest.mocked(prismaClient.user.findUnique).mockResolvedValueOnce(findUserResponse)

    const res = await testHandler(api, { method: 'POST', body })

    expect(findUserMock).toHaveBeenCalledWith({
      include: { roles: true },
      where: {
        email: body.emailAddress,
      },
    })

    expect(emailService.sendEmail).not.toHaveBeenCalled()

    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(`${MANAGE_CONTACT_MANAGERS_PAGE}?fatal=4`)
  })
})
