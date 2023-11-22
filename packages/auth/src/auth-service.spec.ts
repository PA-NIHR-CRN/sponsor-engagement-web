import { rest } from 'msw'
import { setupServer } from 'msw/node'
import type { z } from 'zod'
import { AuthService } from './auth-service'
import type { createUserResponseSchema, getUserResponseSchema } from './schemas'

Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: jest.fn(() => 'random-id'),
  },
})

describe('AuthService', () => {
  let authService: AuthService

  const API_URL = 'https://dev.id.nihr.ac.uk/scim2/Users'

  process.env.IDG_API_URL = API_URL

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

  const server = setupServer(
    rest.get(API_URL, async (_, res, ctx) => res(ctx.json(mockGetUserResponse))),
    rest.post(API_URL, async (_, res, ctx) => res(ctx.json(mockCreateUserResponse)))
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
