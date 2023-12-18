import type { Provider } from 'next-auth/providers'
import { Mock } from 'ts-mockery'
import type { Session, Account } from 'next-auth'
import type { AdapterUser } from 'next-auth/adapters'
import type { JWT } from 'next-auth/jwt'
import type { Prisma, UserOrganisation, UserRole } from 'database'
import { faker } from '@faker-js/faker'
import type { refreshTokenResponseSchema } from '@nihr-ui/auth'
import { authService } from '@nihr-ui/auth'
import { ZodError, type z } from 'zod'
import { logger } from '@nihr-ui/logger'
import { authOptions } from './[...nextauth]'
import { prismaMock } from '@/__mocks__/prisma'
import { Roles } from '@/constants/auth'

jest.mock('@nihr-ui/auth')
jest.mock('@nihr-ui/logger')
jest.useFakeTimers().setSystemTime(new Date('2023-01-01'))

describe('Authentication configuration options', () => {
  test('authOptions object is defined', () => {
    expect(authOptions).toMatchSnapshot()
  })
})

describe('Custom OAuth provider is compatible with next-auth', () => {
  test('provider object is defined', () => {
    expect(authOptions.providers[0]).toEqual<Provider>({
      id: 'oidc',
      name: 'OIDC',
      type: 'oauth',
      wellKnown: 'mockedWellKnownUrl',
      clientId: 'mockedClientId',
      clientSecret: 'mockedClientSecret',
      allowDangerousEmailAccountLinking: true,
      authorization: { params: { scope: 'openid email profile' } },
      idToken: true,
      checks: ['pkce', 'state'],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- valid any
      profile: expect.any(Function),
    })
  })
})

describe('JWT callback', () => {
  const accountMock = Mock.of<Account>({
    accessToken: faker.string.uuid(),
    expires_at: Number(faker.date.future()),
    refresh_token: faker.string.uuid(),
    id_token: faker.string.uuid(),
  })

  const userMock = Mock.of<AdapterUser>({
    email: faker.internet.email(),
  })

  const tokenMock = Mock.of<JWT>()

  test('returns a new token with account information on initial sign in', async () => {
    const account = accountMock
    const user = userMock
    const token = tokenMock

    const response = await authOptions.callbacks?.jwt?.({ account, user, token })

    expect(response).toEqual<JWT>({
      accessToken: accountMock.access_token,
      accessTokenExpires: accountMock.expires_at * 1000,
      refreshToken: accountMock.refresh_token,
      idToken: accountMock.id_token,
      user: userMock,
    })
  })

  test('returns the existing token when it has not expired yet', async () => {
    const account = null
    const user = userMock
    const accessTokenExpires = Number(faker.date.future())
    const token = Mock.of<JWT>({
      accessToken: accountMock.access_token,
      accessTokenExpires,
      refreshToken: accountMock.refresh_token,
      idToken: accountMock.id_token,
      user: userMock,
    })

    const response = await authOptions.callbacks?.jwt?.({ account, user, token })

    expect(response).toEqual<JWT>(token)
  })

  test('refreshes the token when it has expired', async () => {
    const account = null
    const user = userMock
    const accessTokenExpires = Number(faker.date.past())
    const token = Mock.of<JWT>({
      accessToken: accountMock.access_token,
      accessTokenExpires,
      refreshToken: accountMock.refresh_token,
      idToken: accountMock.id_token,
      user: userMock,
    })

    const refreshTokenResponseMock = Mock.of<z.infer<typeof refreshTokenResponseSchema>>({
      access_token: faker.string.uuid(),
      expires_in: Number(faker.date.future()),
      id_token: faker.string.uuid(),
      refresh_token: faker.string.uuid(),
    })

    jest.mocked(authService.refreshToken).mockResolvedValueOnce({
      success: true,
      data: refreshTokenResponseMock,
    })

    const response = await authOptions.callbacks?.jwt?.({ account, user, token })

    expect(response).toEqual<JWT>({
      ...token,
      accessToken: refreshTokenResponseMock.access_token,
      accessTokenExpires: Date.now() + refreshTokenResponseMock.expires_in * 1000,
      idToken: refreshTokenResponseMock.id_token,
      refreshToken: refreshTokenResponseMock.refresh_token,
    })
  })

  test('throws an error when refreshing the token rejects', async () => {
    const account = null
    const user = userMock
    const accessTokenExpires = Number(faker.date.past())
    const token = Mock.of<JWT>({
      accessToken: accountMock.access_token,
      accessTokenExpires,
      refreshToken: accountMock.refresh_token,
      idToken: accountMock.id_token,
      user: userMock,
    })

    jest.mocked(authService.refreshToken).mockRejectedValueOnce({
      success: false,
      error: new ZodError([]),
    })

    const response = await authOptions.callbacks?.jwt?.({ account, user, token })

    expect(logger.error).toHaveBeenCalledWith({ error: new ZodError([]), success: false })

    expect(response).toEqual<JWT>({
      ...token,
      error: 'RefreshAccessTokenError',
    })
  })
})

describe('Session callback', () => {
  test('retrieves the roles for the authenticated user and forwards it to the returned session object', async () => {
    const providerUserId = 'provider-user-id'
    const localUserId = 1
    const email = faker.internet.email()
    const name = faker.person.fullName()

    const session = Mock.of<Session>({ user: { name, email } })
    const user = Mock.of<AdapterUser>()
    const token = Mock.of<JWT>({ user: { id: providerUserId, email } })

    prismaMock.user.findFirstOrThrow.mockResolvedValueOnce(
      Mock.of<Prisma.UserGetPayload<undefined>>({
        id: localUserId,
      })
    )

    prismaMock.userRole.findMany.mockResolvedValueOnce([
      Mock.of<UserRole>({
        userId: Number(providerUserId),
        roleId: Roles.SponsorContact,
      }),
      Mock.of<UserRole>({
        userId: Number(providerUserId),
        roleId: Roles.ContactManager,
      }),
    ])

    const mockUserOrganisation = Mock.of<UserOrganisation>({ organisationId: 123 })

    prismaMock.userOrganisation.findMany.mockResolvedValueOnce([mockUserOrganisation])

    const updatedSession = await authOptions.callbacks?.session?.({
      session,
      user,
      token,
      newSession: false,
      trigger: 'update',
    })

    expect(updatedSession).toEqual<Session>(
      Mock.of<Session>({
        error: undefined,
        idleTimeout: 600,
        user: {
          id: localUserId,
          name,
          email,
          roles: [Roles.SponsorContact, Roles.ContactManager],
          organisations: [mockUserOrganisation],
        },
      })
    )
  })

  describe('signIn callback', () => {
    const accountMock = Mock.of<Account>({
      accessToken: faker.string.uuid(),
      expires_at: Number(faker.date.future()),
      refresh_token: faker.string.uuid(),
      id_token: faker.string.uuid(),
    })

    const userMock = Mock.of<AdapterUser>({
      email: faker.internet.email(),
    })

    test('records the last login time for the user', async () => {
      const account = accountMock
      const user = userMock

      const response = await authOptions.callbacks?.signIn?.({ account, user })

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: {
          email: user.email,
        },
        data: {
          lastLogin: new Date('2023-01-01'),
        },
      })

      expect(response).toBe(true)
    })
  })

  test('exits early if no user object exists within the session', async () => {
    const user = Mock.of<AdapterUser>()
    const token = Mock.of<JWT>()
    const session = Mock.of<Session>({
      user: null,
    })

    const updatedSession = await authOptions.callbacks?.session?.({
      session,
      user,
      token,
      newSession: false,
      trigger: 'update',
    })

    expect(prismaMock.userRole.findMany).not.toHaveBeenCalled()

    expect(updatedSession).toEqual<Session>(session)
  })
})
