import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { faker } from '@faker-js/faker'
import { ZodError } from 'zod'
import type { z, SafeParseReturnType } from 'zod'
import { logger } from '@nihr-ui/logger'
import { AuthService } from './auth-service'
import type {
  checkSessionResponseSchema,
  createUserResponseSchema,
  getUserResponseSchema,
  refreshTokenResponseSchema,
  updateGroupResponseSchema,
} from './schemas'
import { requests } from './handlers'
import { ODP_ROLE, Wso2GroupOperation } from './constants/constants'

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
    const res = await authService.updateWSO2UserGroup(
      'mockuser@nihr.ac.uk',
      'd6500611-5cf5-4230-8695-5a63329e2648',
      Wso2GroupOperation.Add
    )

    expect(res?.success).toBeTruthy()

    if (res?.success) {
      expect(res.data).toEqual(mockUpdateGroupResponse)
    }
  })

  test('removing WSO2 user role succeeds', async () => {
    const res = await authService.updateWSO2UserGroup(
      'mockuser@nihr.ac.uk',
      'd6500611-5cf5-4230-8695-5a63329e2648',
      Wso2GroupOperation.Remove
    )

    expect(res?.success).toBeTruthy()

    if (res?.success) {
      expect(res.data).toEqual(mockUpdateGroupResponse)
    }
  })

  test('assigning WSO2 user role fails when user is not found', async () => {
    await expect(
      authService.updateWSO2UserGroup(
        'nonexistent@nihr.ac.uk',
        'd6500611-5cf5-4230-8695-5a63329e2648',
        Wso2GroupOperation.Add
      )
    ).rejects.toThrow('No user found with email: nonexistent@nihr.ac.uk')
  })

  test('removing WSO2 user role fails when user is not found', async () => {
    await expect(
      authService.updateWSO2UserGroup(
        'nonexistent@nihr.ac.uk',
        'd6500611-5cf5-4230-8695-5a63329e2648',
        Wso2GroupOperation.Remove
      )
    ).rejects.toThrow('No user found with email: nonexistent@nihr.ac.uk')
  })

  test('updateWSO2UserGroup throws error when getUser fails', async () => {
    const mockZodError = new ZodError<GetUserResponse>([])

    const mockFailureResponse: ParsedGetUserFailureResponse = {
      success: false,
      error: mockZodError,
    }

    jest.spyOn(requests, 'getUser').mockResolvedValueOnce(mockFailureResponse)

    await expect(
      authService.updateWSO2UserGroup(
        'invaliduser@nihr.ac.uk',
        'd6500611-5cf5-4230-8695-5a63329e2648',
        Wso2GroupOperation.Add
      )
    ).rejects.toThrow('Failed to retrieve user with email: invaliduser@nihr.ac.uk')
  })

  test('updateWSO2UserGroup throws error when getUser fails', async () => {
    const mockZodError = new ZodError<GetUserResponse>([])

    const mockFailureResponse: ParsedGetUserFailureResponse = {
      success: false,
      error: mockZodError,
    }

    jest.spyOn(requests, 'getUser').mockResolvedValueOnce(mockFailureResponse)

    await expect(
      authService.updateWSO2UserGroup(
        'invaliduser@nihr.ac.uk',
        'd6500611-5cf5-4230-8695-5a63329e2648',
        Wso2GroupOperation.Remove
      )
    ).rejects.toThrow('Failed to retrieve user with email: invaliduser@nihr.ac.uk')
  })

  test('updateWSO2UserGroup throws error when user is undefined in getUser response', async () => {
    const mockSuccessResponse: ParsedGetUserResponse = {
      success: true,
      data: mockEmptyGetUserResponse,
    }

    jest.spyOn(requests, 'getUser').mockResolvedValueOnce(mockSuccessResponse)

    await expect(
      authService.updateWSO2UserGroup(
        'mockuser@nihr.ac.uk',
        'd6500611-5cf5-4230-8695-5a63329e2648',
        Wso2GroupOperation.Add
      )
    ).rejects.toThrow('No user found with email: mockuser@nihr.ac.uk')
  })

  test('updateWSO2UserGroup throws error when user is undefined in getUser response', async () => {
    const mockResponse: ParsedGetUserResponse = {
      success: true,
      data: mockEmptyGetUserResponse,
    }

    jest.spyOn(requests, 'getUser').mockResolvedValueOnce(mockResponse)

    await expect(
      authService.updateWSO2UserGroup(
        'mockuser@nihr.ac.uk',
        'd6500611-5cf5-4230-8695-5a63329e2648',
        Wso2GroupOperation.Remove
      )
    ).rejects.toThrow('No user found with email: mockuser@nihr.ac.uk')
  })

  test('updateWSO2UserGroup throws an error when Resources is undefined', async () => {
    const mockResponse: ParsedGetUserResponse = {
      success: true,
      data: {
        ...mockEmptyGetUserResponse,
        Resources: undefined,
      },
    }

    jest.spyOn(requests, 'getUser').mockResolvedValueOnce(mockResponse)

    await expect(
      authService.updateWSO2UserGroup(
        'mockuser@nihr.ac.uk',
        'd6500611-5cf5-4230-8695-5a63329e2648',
        Wso2GroupOperation.Add
      )
    ).rejects.toThrow('No user found with email: mockuser@nihr.ac.uk')
  })

  test('assigning WSO2 user role is skipped when user already has ODP_ROLE', async () => {
    // Mock user with ODP_ROLE in groups
    const mockGetUserResponseWithOdpRole: GetUserResponse = {
      ...mockGetUserResponse,
      Resources: mockGetUserResponse.Resources
        ? [
            {
              ...mockGetUserResponse.Resources[0],
              groups: [{ display: ODP_ROLE }],
            },
          ]
        : [],
    }

    jest.spyOn(requests, 'getUser').mockResolvedValueOnce({
      success: true,
      data: mockGetUserResponseWithOdpRole,
    })

    const patchSpy = jest.spyOn(requests, 'patchUserGroup')

    const res = await authService.updateWSO2UserGroup(
      'mockuser@nihr.ac.uk',
      'd6500611-5cf5-4230-8695-5a63329e2648',
      Wso2GroupOperation.Add
    )

    expect(patchSpy).not.toHaveBeenCalled()

    expect(res).toBeUndefined()
  })

  test('patchUserGroup handles Axios error with detail', async () => {
    const mockError = {
      isAxiosError: true,
      message: 'Request failed',
      response: {
        data: {
          detail: 'User does not exist',
        },
      },
    }

    jest.spyOn(requests, 'patchUserGroup').mockRejectedValueOnce(mockError)

    const groupId = 'd6500611-5cf5-4230-8695-5a63329e2648'

    const loggerSpy = jest.spyOn(logger, 'error')

    const res = await authService.updateWSO2UserGroup('mockuser@nihr.ac.uk', groupId, Wso2GroupOperation.Add)

    expect(res).toBeUndefined()
    expect(loggerSpy).toHaveBeenCalledWith('Failed to patchUserGroup Message: Request failed')
    expect(loggerSpy).toHaveBeenCalledWith('Failed to patchUserGroup Detail: User does not exist')
  })

  test('patchUserGroup handles non-Axios error', async () => {
    const mockError = new Error('Unexpected error')

    jest.spyOn(requests, 'patchUserGroup').mockRejectedValueOnce(mockError)

    const groupId = 'd6500611-5cf5-4230-8695-5a63329e2648'

    const loggerSpy = jest.spyOn(logger, 'error')

    const res = await authService.updateWSO2UserGroup('mockuser@nihr.ac.uk', groupId, Wso2GroupOperation.Add)

    expect(res).toBeUndefined()
    expect(loggerSpy).toHaveBeenCalledWith(mockError)
  })
})
