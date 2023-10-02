import type { AuthOptions } from 'next-auth'
import NextAuth from 'next-auth'
import type { OAuthConfig, OAuthUserConfig } from 'next-auth/providers'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { AUTH_PROVIDER_ID, AUTH_PROVIDER_NAME, AUTH_PROVIDER_TYPE } from '../../../constants/auth'
import { prismaClient } from '../../../lib/prisma'

interface OAuthProfile {
  at_hash: string
  sub: string
  amr: string[]
  iss: string
  given_name: string
  aud: string
  c_hash: string
  nbf: number
  azp: string
  exp: number
  iat: number
  family_name: string
  email: string
}

type ProviderOptions = OAuthUserConfig<'type'> & { wellKnown: string }

/**
 * Custom oauth provider for next-auth
 */
const Provider = ({ clientId, clientSecret, wellKnown }: ProviderOptions): OAuthConfig<OAuthProfile> => ({
  id: AUTH_PROVIDER_ID,
  name: AUTH_PROVIDER_NAME,
  type: AUTH_PROVIDER_TYPE,
  wellKnown,
  clientId,
  clientSecret,
  authorization: { params: { scope: 'openid email profile' } },
  idToken: true,
  checks: ['pkce', 'state'],
  profile(profile) {
    return {
      id: profile.sub,
      name: `${profile.given_name} ${profile.family_name}`,
      email: profile.email,
      identityGatewayId: profile.sub,
    }
  },
})

export const authOptions: AuthOptions = {
  debug: true,
  adapter: PrismaAdapter(prismaClient),
  providers: [
    Provider({
      clientId: process.env.AUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
      wellKnown: process.env.AUTH_WELL_KNOWN_URL,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (!session.user) {
        return session
      }

      const userId = Number(user.id)

      session.user.id = userId

      // When a session is established or checked we can lookup the users' role(s) and forward them inside the user object
      // https://next-auth.js.org/configuration/callbacks#session-callback
      const roles = await prismaClient.userRole.findMany({ where: { userId } })

      session.user.roles = roles.map((role) => role.roleId)

      return session
    },
  },
}

export default NextAuth(authOptions)
