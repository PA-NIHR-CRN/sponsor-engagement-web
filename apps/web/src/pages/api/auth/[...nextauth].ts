import type { AuthOptions } from 'next-auth'
import NextAuth from 'next-auth'
import type { OAuthConfig } from 'next-auth/providers'
import { logger } from '@nihr-ui/logger'
import { authService } from '@nihr-ui/auth'
import type { JWT } from 'next-auth/jwt'
import {
  AUTH_PROVIDER_ID,
  AUTH_PROVIDER_NAME,
  AUTH_PROVIDER_TYPE,
  AUTH_SESSION_EXPIRY_FALLBACK,
} from '@/constants/auth'
import { prismaClient } from '@/lib/prisma'
import { getUserOrganisations } from '@/lib/organisations'
import type { OAuthProfile, ProviderOptions } from '@/@types/auth'

/**
 * Custom OAuth provider configuration for NextAuth.
 *
 * @param clientId - The OAuth client ID.
 * @param clientSecret - The OAuth client secret.
 * @param wellKnown - The well-known URL for OAuth discovery.
 * @returns OAuth provider configuration.
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
  checks: ['pkce'], // https://github.com/nextauthjs/next-auth/discussions/7491#discussioncomment-7303997
  // https://next-auth.js.org/configuration/providers/oauth#allowdangerousemailaccountlinking-option
  allowDangerousEmailAccountLinking: true,
  profile(profile) {
    // Map OAuth profile data to user attributes.
    return {
      id: profile.sub,
      name: profile.given_name && profile.family_name ? `${profile.given_name} ${profile.family_name}` : null,
      email: profile.email,
      identityGatewayId: profile.sub,
    }
  },
})

/**
 * Refreshes the access token if it has expired.
 *
 * @param token - The JWT token containing user session data.
 * @returns Updated token with a refreshed access token or an error property.
 */
async function refreshAccessToken(token: JWT) {
  try {
    const refreshedTokenResponse = await authService.refreshToken({
      refreshToken: token.refreshToken,
      clientId: process.env.AUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
    })

    if (!refreshedTokenResponse.success) {
      throw refreshedTokenResponse.error
    }

    const {
      access_token: accessToken,
      expires_in: accessTokenExpiresIn,
      refresh_token: refreshToken,
      id_token: idToken,
    } = refreshedTokenResponse.data

    return {
      ...token,
      accessToken,
      accessTokenExpires: Date.now() + accessTokenExpiresIn * 1000,
      refreshToken: refreshToken || token.refreshToken,
      idToken,
    }
  } catch (error) {
    logger.error(error)
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

/**
 * Configuration options for NextAuth.
 */
export const authOptions: AuthOptions = {
  // Enable debug mode in non-production environments.
  debug: process.env.NEXTAUTH_DEBUG === 'enabled',

  // Session configuration using JWT strategy.
  session: {
    strategy: 'jwt',
    maxAge: Number(process.env.NEXTAUTH_SESSION_EXPIRY || AUTH_SESSION_EXPIRY_FALLBACK),
  },

  // OAuth providers for authentication.
  providers: [
    Provider({
      clientId: process.env.AUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
      wellKnown: process.env.AUTH_WELL_KNOWN_URL,
    }),
  ],

  // Callbacks for JWT and session management.
  callbacks: {
    jwt({ token, account, user, trigger }) {
      // Initial sign-in logic.
      if (account) {
        logger.info('jwt callback - initial sign in')
        return {
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at * 1000,
          refreshToken: account.refresh_token,
          idToken: account.id_token,
          user,
        }
      }

      if (trigger === 'update') {
        logger.info('jwt callback "update" triggered')
        return refreshAccessToken(token)
      }

      // Return the previous token if the access token has not expired yet.
      if (Date.now() < token.accessTokenExpires) {
        logger.info('jwt callback - access token ok')
        return token
      }

      // Access token has expired, try to update it.
      logger.info('jwt callback - token expired - attempting to refresh')
      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      try {
        if (!session.user) {
          return session
        }

        const {
          error,
          user: { id, email },
        } = token

        if (!id || !email) throw new Error('Missing id or email from jwt')

        const { id: userId } = await prismaClient.user.findFirstOrThrow({ where: { email } })

        session.user.id = userId // Update the user id to be the local id from our database
        session.idleTimeout = Number(process.env.NEXTAUTH_IDLE_TIMEOUT)
        session.error = error

        if (email) {
          session.user.email = email
        }

        // Retrieve user roles and organizations
        const roles = await prismaClient.userRole.findMany({ where: { userId, isDeleted: false } })
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
