import type { AuthOptions } from 'next-auth'
import NextAuth from 'next-auth'
import type { OAuthConfig, OAuthUserConfig } from 'next-auth/providers'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { logger } from '@nihr-ui/logger'
import { AUTH_PROVIDER_ID, AUTH_PROVIDER_NAME, AUTH_PROVIDER_TYPE } from '../../../constants/auth'
import { prismaClient } from '../../../lib/prisma'
import { getUserOrganisations } from '../../../lib/organisations'

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

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
function refreshAccessToken(token) {
  try {
    // TODO: Implement access token refresh
    // https://next-auth.js.org/v3/tutorials/refresh-token-rotation
  } catch (error) {
    console.log(error)
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

export const authOptions: AuthOptions = {
  debug: process.env.APP_ENV !== 'prod',
  adapter: PrismaAdapter(prismaClient),
  session: {
    strategy: 'jwt',
  },
  providers: [
    Provider({
      clientId: process.env.AUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
      wellKnown: process.env.AUTH_WELL_KNOWN_URL,
    }),
  ],
  callbacks: {
    jwt({ token, account, user }) {
      // Initial sign in
      if (account?.access_token && account.expires_at && account.refresh_token) {
        logger.info('jwt callback - initial sign in')
        return {
          ...token,
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at * 1000,
          refreshToken: account.refresh_token,
          user,
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        logger.info('jwt callback - returning previous token as access token has not expired yet')
        return token
      }

      // Access token has expired, try to update it
      logger.info('jwt callback - access token has expired, try to update it')
      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      try {
        if (!session.user) {
          return session
        }

        const userId = Number(token.sub)

        session.accessToken = token.accessToken
        session.user.id = userId

        // TODO: Check session is valid in IDG on every request?

        // When a session is established or checked we can lookup the users' role(s) and forward them inside the user object
        // https://next-auth.js.org/configuration/callbacks#session-callback
        const roles = await prismaClient.userRole.findMany({ where: { userId } })

        session.user.roles = roles.map((role) => role.roleId)

        session.user.organisations = await getUserOrganisations(userId)

        return session
      } catch (error) {
        logger.error('NextAuth session callback exception')
        logger.error(error)
        return session
      }
    },
  },
}

export default NextAuth(authOptions)
