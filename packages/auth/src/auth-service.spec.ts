import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { faker } from '@faker-js/faker'
import { ZodError } from 'zod'
import type { z, SafeParseReturnType } from 'zod'
import { AuthService } from './auth-service'
import {
  checkSessionResponseSchema,
  createUserResponseSchema,
  getUserResponseSchema,
  refreshTokenResponseSchema,
  updateGroupResponseSchema,
} from './schemas'
import { requests } from './handlers'

// Define types inferred from Zod schemas
type GetUserResponse = z.infer<typeof getUserResponseSchema>
type CreateUserResponse = z.infer<typeof createUserResponseSchema>
type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>
type CheckSessionResponse = z.infer<typeof checkSessionResponseSchema>
type UpdateGroupResponse = z.infer<typeof updateGroupResponseSchema>
type ParsedGetUserResponse = SafeParseReturnType<GetUserResponse, GetUserResponse>
type ParsedGetUserFailureResponse = SafeParseReturnType<GetUserResponse, ZodError<GetUserResponse>>

describe('AuthService', () => {
  let authService: AuthService
  const USERS_API_URL = 'https://dev.id.nihr.ac.uk/scim2/Users'
  const TOKEN_API_URL = 'https://dev.id.nihr.ac.uk/oauth2/token'
  const INTROSPECT_API_URL = 'https://dev.id.nihr.ac.uk/oauth2/introspect'
  const GROUPS_API_URL = 'https://dev.id.nihr.ac.uk/scim2/Groups'

  const mockGetUserResponse: GetUserResponse = {
    schemas: ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
    totalResults: 1,
    startIndex: 1,
    itemsPerPage: 1,
    Resources: [
      {
        id: '2c2aa0a8-59d4-40c7-9f3d-3a310bb03f49',
        userName: '01a87546-0e8e-4e78-a326-719cde27f49f',
      },
    ],
  }

  const mockEmptyGetUserResponse: GetUserResponse = {
    schemas: ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
    totalResults: 0,
    startIndex: 1,
    itemsPerPage: 0,
    Resources: [],
  }

  const mockCreateUserResponse: CreateUserResponse = {
    emails: ['tom4@test.nihr.ac.uk'],
    meta: {
      created: '2023-11-20T20:09:45.305Z',
      location: 'https://dev.id.nihr.ac.uk/scim2/Users/eb9d56dc-5b0e-4fb9-983a-ffbe018c7d5e',
      lastModified: '2023-11-20T20:09:45.336Z',
      resourceType: 'User',
    },
    schemas: [
      'urn:ietf:params:scim:schemas:core:2.0:User',
      'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User',
    ],
    roles: [
      {
        type: 'default',
        value: 'Internal/everyone',
      },
    ],
    id: 'eb9d56dc-5b0e-4fb9-983a-ffbe018c7d5e',
    userName: '01a87546-0e8e-4e78-a326-719cde27f49f',
  }

  const mockRefreshTokenResponse: RefreshTokenResponse = {
    access_token: faker.string.uuid(),
    expires_in: Number(faker.date.future()),
    id_token: faker.string.uuid(),
    refresh_token: faker.string.uuid(),
    scope: faker.string.alpha(),
    token_type: faker.string.alpha(),
  }

  const mockCheckSessionResponse: CheckSessionResponse = {
    active: true,
    nbf: faker.number.int(),
    scope: faker.string.alpha(),
    token_type: faker.string.alpha(),
    exp: faker.number.int(),
    iat: faker.number.int(),
    client_id: faker.string.alpha(),
    username: faker.string.alpha(),
  }

  const mockUpdateGroupResponse: UpdateGroupResponse = {
    schemas: ['urn:ietf:params:scim:schemas:core:2.0:Group'],
    id: 'd6500611-5cf5-4230-8695-5a63329e2648',
    displayName: 'ODP_SponsorEngagementTool',
    meta: {
      created: new Date().toISOString(),
      location: 'https://dev.id.nihr.ac.uk/scim2/Groups/d6500611-5cf5-4230-8695-5a63329e2648',
      lastModified: new Date().toISOString(),
    },
    members: [
      {
        value: 'eb9d56dc-5b0e-4fb9-983a-ffbe018c7d5e',
        display: '01a87546-0e8e-4e78-a326-719cde27f49f',
      },
    ],
  }

  const server = setupServer(
    rest.get(USERS_API_URL, async (req, res, ctx) => {
      const email = req.url.searchParams.get('filter')?.split(' ')[2]
      if (email === 'nonexistent@nihr.ac.uk') {
        return res(ctx.status(200), ctx.json(mockEmptyGetUserResponse))
      }
      return res(ctx.json(mockGetUserResponse))
    }),
    rest.post(USERS_API_URL, async (_, res, ctx) => res(ctx.json(mockCreateUserResponse))),
    rest.post(TOKEN_API_URL, async (_, res, ctx) => res(ctx.json(mockRefreshTokenResponse))),
    rest.post(INTROSPECT_API_URL, async (_, res, ctx) => res(ctx.json(mockCheckSessionResponse))),
    rest.patch(`${GROUPS_API_URL}/:role`, async (_, res, ctx) => res(ctx.json(mockUpdateGroupResponse)))
  )

  beforeAll(() => {
    server.listen()
  })

  afterEach(() => {
    server.resetHandlers()
    jest.clearAllMocks()
  })

  afterAll(() => {
    server.close()
  })

  beforeEach(() => {
    authService = new AuthService()
  })

  test('refreshing an IDG token', async () => {
    const res = await authService.refreshToken({ clientId: '', clientSecret: '', refreshToken: '' })

    expect(res.success).toBeTruthy()

    if (res.success) {
      expect(res.data).toEqual(mockRefreshTokenResponse)
    }
  })

  test('checking session validity', async () => {
    const res = await authService.checkSession('123456')

    expect(res.success).toBeTruthy()

    if (res.success) {
      expect(res.data).toEqual(mockCheckSessionResponse)
    }
  })

  test('getting an IDG user by email', async () => {
    const res = await authService.getUser('mockuser@nihr.ac.uk')

    expect(res.success).toBeTruthy()

    if (res.success) {
      expect(res.data).toEqual(mockGetUserResponse)
    }
  })

  test('creating an IDG user', async () => {
    const res = await authService.createUser({
      emails: ['mockuser@nihr.ac.uk'],
      password: '123123123123',
    })

    expect(res.success).toBeTruthy()

    if (res.success) {
      expect(res.data).toEqual(mockCreateUserResponse)
    }
  })

  test('assigning WSO2 user role succeeds', async () => {
    const res = await authService.updateWSO2UserRole(
      'mockuser@nihr.ac.uk',
      'd6500611-5cf5-4230-8695-5a63329e2648',
      'add'
    )

    expect(res.success).toBeTruthy()

    if (res.success) {
      expect(res.data).toEqual(mockUpdateGroupResponse)
    }
  })

  test('removing WSO2 user role succeeds', async () => {
    const res = await authService.updateWSO2UserRole(
      'mockuser@nihr.ac.uk',
      'd6500611-5cf5-4230-8695-5a63329e2648',
      'remove'
    )

    expect(res.success).toBeTruthy()

    if (res.success) {
      expect(res.data).toEqual(mockUpdateGroupResponse)
    }
  })

  test('assigning WSO2 user role fails when user is not found', async () => {
    await expect(
      authService.updateWSO2UserRole('nonexistent@nihr.ac.uk', 'd6500611-5cf5-4230-8695-5a63329e2648', 'add')
    ).rejects.toThrow('No user found with email: nonexistent@nihr.ac.uk')
  })

  test('removing WSO2 user role fails when user is not found', async () => {
    await expect(
      authService.updateWSO2UserRole('nonexistent@nihr.ac.uk', 'd6500611-5cf5-4230-8695-5a63329e2648', 'remove')
    ).rejects.toThrow('No user found with email: nonexistent@nihr.ac.uk')
  })

  test('updateWSO2UserRole throws error when getUser fails', async () => {
    const mockZodError = new ZodError<GetUserResponse>([])

    const mockFailureResponse: ParsedGetUserFailureResponse = {
      success: false,
      error: mockZodError,
    }

    jest.spyOn(requests, 'getUser').mockResolvedValueOnce(mockFailureResponse)

    await expect(
      authService.updateWSO2UserRole('invaliduser@nihr.ac.uk', 'd6500611-5cf5-4230-8695-5a63329e2648', 'add')
    ).rejects.toThrow('Failed to retrieve user with email: invaliduser@nihr.ac.uk')
  })

  test('updateWSO2UserRole throws error when getUser fails', async () => {
    const mockZodError = new ZodError<GetUserResponse>([])

    const mockFailureResponse: ParsedGetUserFailureResponse = {
      success: false,
      error: mockZodError,
    }

    jest.spyOn(requests, 'getUser').mockResolvedValueOnce(mockFailureResponse)

    await expect(
      authService.updateWSO2UserRole('invaliduser@nihr.ac.uk', 'd6500611-5cf5-4230-8695-5a63329e2648', 'remove')
    ).rejects.toThrow('Failed to retrieve user with email: invaliduser@nihr.ac.uk')
  })

  test('updateWSO2UserRole throws error when user is undefined in getUser response', async () => {
    const mockSuccessResponse: ParsedGetUserResponse = {
      success: true,
      data: mockEmptyGetUserResponse,
    }

    jest.spyOn(requests, 'getUser').mockResolvedValueOnce(mockSuccessResponse)

    await expect(
      authService.updateWSO2UserRole('mockuser@nihr.ac.uk', 'd6500611-5cf5-4230-8695-5a63329e2648', 'add')
    ).rejects.toThrow('No user found with email: mockuser@nihr.ac.uk')
  })

  test('updateWSO2UserRole throws error when user is undefined in getUser response', async () => {
    const mockResponse: ParsedGetUserResponse = {
      success: true,
      data: mockEmptyGetUserResponse,
    }

    jest.spyOn(requests, 'getUser').mockResolvedValueOnce(mockResponse)

    await expect(
      authService.updateWSO2UserRole('mockuser@nihr.ac.uk', 'd6500611-5cf5-4230-8695-5a63329e2648', 'remove')
    ).rejects.toThrow('No user found with email: mockuser@nihr.ac.uk')
  })

  test('updateWSO2UserRole throws an error when Resources is undefined', async () => {
    const mockResponse: ParsedGetUserResponse = {
      success: true,
      data: {
        ...mockEmptyGetUserResponse,
        Resources: undefined,
      },
    }

    jest.spyOn(requests, 'getUser').mockResolvedValueOnce(mockResponse)

    await expect(
      authService.updateWSO2UserRole('mockuser@nihr.ac.uk', 'd6500611-5cf5-4230-8695-5a63329e2648', 'add')
    ).rejects.toThrow('No user found with email: mockuser@nihr.ac.uk')
  })
})
