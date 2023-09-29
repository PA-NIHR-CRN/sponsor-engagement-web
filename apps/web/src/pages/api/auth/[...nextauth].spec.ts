import type { Provider } from 'next-auth/providers'
import { Mock } from 'ts-mockery'
import type { Session } from 'next-auth'
import type { AdapterUser } from 'next-auth/adapters'
import type { JWT } from 'next-auth/jwt'
import type { UserRole } from 'database'
import { prismaMock } from '../../../__mocks__/prisma'
import { Roles } from '../../../constants/auth'
import { authOptions } from './[...nextauth]'

describe('Authentication configuration options', () => {
  test('authOptions object is defined', () => {
    expect(authOptions).toBeDefined()
  })

  test('debug mode is set', () => {
    expect(authOptions.debug).toBe(true)
  })

  test('prisma db adapter is set', () => {
    expect(authOptions.adapter).toBeDefined()
  })
})

describe('Custom OAuth provider is compatible with next-auth', () => {
  test('authOptions object is defined', () => {
    expect(authOptions.providers[0]).toEqual<Provider>({
      id: 'oidc',
      name: 'OIDC',
      type: 'oauth',
      wellKnown: 'mockedWellKnownUrl',
      clientId: 'mockedClientId',
      clientSecret: 'mockedClientSecret',
      authorization: { params: { scope: 'openid email profile' } },
      idToken: true,
      checks: ['pkce', 'state'],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- valid any
      profile: expect.any(Function),
    })
  })
})

describe('Session authentication callback', () => {
  test('retrieves the roles for the authenticated user and forwards it to the returned session object', async () => {
    const session = Mock.of<Session>({
      user: {
        name: 'Tom Christian',
        email: 'tom.christian@nihr.ac.uk',
      },
    })
    const user = Mock.of<AdapterUser>({
      id: '26',
    })
    const token = Mock.of<JWT>()

    prismaMock.userRole.findMany.mockResolvedValueOnce([
      Mock.of<UserRole>({
        userId: 26,
        roleId: Roles.SponsorContact,
      }),
      Mock.of<UserRole>({
        userId: 26,
        roleId: Roles.ContactManager,
      }),
    ])

    const updatedSession = await authOptions.callbacks?.session?.({
      session,
      user,
      token,
      newSession: false,
      trigger: 'update',
    })

    expect(updatedSession).toEqual<Session>(
      Mock.of<Session>({
        user: {
          id: 26,
          name: 'Tom Christian',
          email: 'tom.christian@nihr.ac.uk',
          roles: [Roles.SponsorContact, Roles.ContactManager],
        },
      })
    )
  })

  test('exits early if no user object exists', async () => {
    const session = Mock.of<Session>({
      user: null,
    })
    const user = Mock.of<AdapterUser>()
    const token = Mock.of<JWT>()

    const updatedSession = await authOptions.callbacks?.session?.({
      session,
      user,
      token,
      newSession: false,
      trigger: 'update',
    })

    expect(prismaMock.userRole.findMany).not.toHaveBeenCalled()

    expect(updatedSession).toEqual<Session>(
      Mock.of<Session>({
        user: null,
      })
    )
  })
})
