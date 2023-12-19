import { faker } from '@faker-js/faker'
import type { createUserResponseSchema } from '@nihr-ui/auth'
import { authService } from '@nihr-ui/auth'
import { logger } from '@nihr-ui/logger'
import type { NextApiResponse } from 'next'
import type { RequestOptions } from 'node-mocks-http'
import { createRequest, createResponse } from 'node-mocks-http'
import { Mock } from 'ts-mockery'
import type { z } from 'zod'
import { ZodError } from 'zod'

import type { Prisma } from '@/lib/prisma'
import { prismaClient } from '@/lib/prisma'
import type { RegistrationInputs } from '@/utils/schemas'

import type { ExtendedNextApiRequest } from './registration'
import api from './registration'

jest.mock('next-auth/next')
jest.mock('@nihr-ui/logger')
jest.mock('@nihr-ui/auth')

type ApiRequest = ExtendedNextApiRequest
type ApiResponse = NextApiResponse

const testHandler = async (handler: typeof api, options: RequestOptions) => {
  const req = createRequest<ApiRequest>(options)
  const res = createResponse<ApiResponse>()
  await handler(req, res)
  return res
}

describe('Successful registration', () => {
  const mockEmail = faker.internet.email()
  const mockLocalUserId = faker.number.int()
  const mockIdentityGatewayId = faker.string.uuid()
  const mockPassword = faker.string.numeric(12)
  const body: RegistrationInputs = {
    registrationToken: '789',
    password: mockPassword,
    confirmPassword: mockPassword,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Creates an account in IDG, updates local user with the new IDG id, then redirects to the confirmation page', async () => {
    const findUserResponse = Mock.of<Prisma.UserGetPayload<null>>({ email: mockEmail })
    const updateUserResponse = Mock.of<Prisma.UserGetPayload<null>>({ id: mockLocalUserId })
    const createUserResponse = Mock.of<z.infer<typeof createUserResponseSchema>>({
      id: mockIdentityGatewayId,
      userName: mockIdentityGatewayId,
    })

    jest.mocked(prismaClient.user.findFirst).mockResolvedValueOnce(findUserResponse)
    jest.mocked(prismaClient.user.update).mockResolvedValueOnce(updateUserResponse)
    jest.mocked(authService.createUser).mockResolvedValueOnce({ success: true, data: createUserResponse })

    const res = await testHandler(api, {
      method: 'POST',
      body,
    })

    expect(logger.info).toHaveBeenCalledWith('Created user in IDG, updating user in local applicaton')

    expect(prismaClient.user.update).toHaveBeenCalledWith({
      where: {
        email: mockEmail,
        isDeleted: false,
      },
      data: {
        identityGatewayId: mockIdentityGatewayId,
        registrationConfirmed: true,
        registrationToken: null,
      },
    })

    expect(logger.info).toHaveBeenCalledWith(
      `Updated local user ${mockLocalUserId} with identityGatewayId ${mockIdentityGatewayId}, now redirecting to confirmation page`
    )

    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(`/register/confirmation`)
  })
})

describe('Failed registration - validation errors', () => {
  const body: RegistrationInputs = {
    registrationToken: '789',
    password: '1234567689123',
    confirmPassword: '1234567689123',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Passwords do not match', async () => {
    const res = await testHandler(api, {
      method: 'POST',
      body: { ...body, password: 'this_password_is___', confirmPassword: 'not_the_same___' },
    })
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(
      `/register?confirmPasswordError=The+passwords+did+not+match&registrationToken=${body.registrationToken}`
    )
    expect(logger.error).toHaveBeenCalledWith(
      new ZodError([
        {
          code: 'custom',
          message: 'The passwords did not match',
          path: ['confirmPassword'],
        },
      ])
    )
  })

  test('Password is less than 12 characters', async () => {
    const res = await testHandler(api, {
      method: 'POST',
      body: { ...body, password: 'notenough', confirmPassword: 'notenough' },
    })
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(
      `/register?passwordError=Enter+a+minimum+of+12+characters&confirmPasswordError=Enter+a+minimum+of+12+characters&registrationToken=${body.registrationToken}`
    )
    expect(logger.error).toHaveBeenCalledWith(
      new ZodError([
        {
          code: 'too_small',
          minimum: 12,
          type: 'string',
          inclusive: true,
          exact: false,
          message: 'Enter a minimum of 12 characters',
          path: ['password'],
        },
        {
          code: 'too_small',
          minimum: 12,
          type: 'string',
          inclusive: true,
          exact: false,
          message: 'Enter a minimum of 12 characters',
          path: ['confirmPassword'],
        },
      ])
    )
  })

  test('Password contains a £ character', async () => {
    const res = await testHandler(api, {
      method: 'POST',
      body: { ...body, password: 'the_password_contains_a_£', confirmPassword: 'the_password_contains_a_£' },
    })
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(
      `/register?passwordError=Must+not+contain+the+%C2%A3+character&confirmPasswordError=Must+not+contain+the+%C2%A3+character&registrationToken=${body.registrationToken}`
    )
    expect(logger.error).toHaveBeenCalledWith(
      new ZodError([
        {
          code: 'custom',
          message: 'Must not contain the £ character',
          path: ['password'],
        },
        {
          code: 'custom',
          message: 'Must not contain the £ character',
          path: ['confirmPassword'],
        },
      ])
    )
  })
})

describe('Failed registration - application errors', () => {
  const mockEmail = faker.internet.email()
  const mockPassword = faker.string.numeric(12)
  const body: RegistrationInputs = {
    registrationToken: '789',
    password: mockPassword,
    confirmPassword: mockPassword,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Wrong http method redirects back to the form with a fatal error', async () => {
    const res = await testHandler(api, { method: 'GET' })
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(`/register?fatal=1`)
    expect(logger.error).toHaveBeenCalledWith(new Error('Wrong method'))
  })

  test('No user associated with the provided registration token', async () => {
    jest.mocked(prismaClient.user.findFirst).mockResolvedValueOnce(null)

    const res = await testHandler(api, { method: 'POST', body })
    expect(logger.error).toHaveBeenCalledWith(
      new Error(`No email found associated with the registrationToken ${body.registrationToken}`)
    )
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(`/register?fatal=1&registrationToken=${body.registrationToken}`)
  })

  test('IDG fails to create the user', async () => {
    const findUserResponse = Mock.of<Prisma.UserGetPayload<null>>({ email: mockEmail })
    jest.mocked(prismaClient.user.findFirst).mockResolvedValueOnce(findUserResponse)
    jest.mocked(authService.createUser).mockResolvedValueOnce({ success: false, error: new ZodError([]) })

    const res = await testHandler(api, { method: 'POST', body })
    expect(logger.error).toHaveBeenCalledWith(new Error(`Failed to create user in IDG`))
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(`/register?fatal=1&registrationToken=${body.registrationToken}`)
  })

  test('IDG create user does not provide a user id', async () => {
    const findUserResponse = Mock.of<Prisma.UserGetPayload<null>>({ email: mockEmail })
    const createUserResponse = Mock.of<z.infer<typeof createUserResponseSchema>>({ id: undefined })
    jest.mocked(prismaClient.user.findFirst).mockResolvedValueOnce(findUserResponse)
    jest.mocked(authService.createUser).mockResolvedValueOnce({ success: true, data: createUserResponse })

    const res = await testHandler(api, { method: 'POST', body })
    expect(logger.error).toHaveBeenCalledWith(new Error(`Missing data from IDG createUser response`))
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(`/register?fatal=1&registrationToken=${body.registrationToken}`)
  })
})
