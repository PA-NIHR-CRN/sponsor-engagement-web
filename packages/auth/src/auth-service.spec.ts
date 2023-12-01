import { rest } from 'msw'
import { setupServer } from 'msw/node'
import type { z } from 'zod'
import { faker } from '@faker-js/faker'
import { AuthService } from './auth-service'
import type {
  checkSessionResponseSchema,
  createUserResponseSchema,
  getUserResponseSchema,
  refreshTokenResponseSchema,
} from './schemas'

Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: jest.fn(() => 'random-id'),
  },
})

describe('AuthService', () => {
  let authService: AuthService

  process.env.IDG_API_URL = 'https://dev.id.nihr.ac.uk'

  const USERS_API_URL = 'https://dev.id.nihr.ac.uk/scim2/Users'
  const TOKEN_API_URL = 'https://dev.id.nihr.ac.uk/oauth2/token'
  const INTROSPECT_API_URL = 'https://dev.id.nihr.ac.uk/oauth2/introspect'

  const mockGetUserResponse: z.infer<typeof getUserResponseSchema> = {
    totalResults: 1,
    startIndex: 1,
    itemsPerPage: 1,
    schemas: ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
    Resources: [
      {
        id: '2c2aa0a8-59d4-40c7-9f3d-3a310bb03f49',
        userName: '01a87546-0e8e-4e78-a326-719cde27f49f',
      },
    ],
  }

  const mockCreateUserResponse: z.infer<typeof createUserResponseSchema> = {
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

  const mockRefreshTokenResponse: z.infer<typeof refreshTokenResponseSchema> = {
    access_token: faker.string.uuid(),
    expires_in: Number(faker.date.future()),
    id_token: faker.string.uuid(),
    refresh_token: faker.string.uuid(),
    scope: faker.string.alpha(),
    token_type: faker.string.alpha(),
  }

  const mockCheckSessionResponse: z.infer<typeof checkSessionResponseSchema> = {
    active: true,
    nbf: faker.number.int(),
    scope: faker.string.alpha(),
    token_type: faker.string.alpha(),
    exp: faker.number.int(),
    iat: faker.number.int(),
    client_id: faker.string.alpha(),
    username: faker.string.alpha(),
  }

  const server = setupServer(
    rest.get(USERS_API_URL, async (_, res, ctx) => res(ctx.json(mockGetUserResponse))),
    rest.post(USERS_API_URL, async (_, res, ctx) => res(ctx.json(mockCreateUserResponse))),
    rest.post(TOKEN_API_URL, async (_, res, ctx) => res(ctx.json(mockRefreshTokenResponse))),
    rest.post(INTROSPECT_API_URL, async (_, res, ctx) => res(ctx.json(mockCheckSessionResponse)))
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
})
