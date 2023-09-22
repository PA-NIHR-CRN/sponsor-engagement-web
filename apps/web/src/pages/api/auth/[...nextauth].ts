import type { AuthOptions } from 'next-auth'
import NextAuth from 'next-auth'
import type { OAuthConfig, OAuthUserConfig } from 'next-auth/providers'
import { AUTH_PROVIDER_ID, AUTH_PROVIDER_NAME, AUTH_PROVIDER_TYPE } from '@/constants/auth'

interface Profile {
  id: string
  given_name: string
  family_name: string
  email: string
}

type ProviderOptions = OAuthUserConfig<'type'> & { wellKnown: string }

const Provider = ({ clientId, clientSecret, wellKnown }: ProviderOptions): OAuthConfig<Profile> => ({
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
      id: String(profile.id),
      firstName: profile.given_name,
      lastName: profile.family_name,
      emailAddress: profile.email,
    }
  },
})

export const authOptions: AuthOptions = {
  debug: true,
  providers: [
    Provider({
      clientId: process.env.AUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
      wellKnown: process.env.AUTH_WELL_KNOWN_URL,
    }),
  ],
}
export default NextAuth(authOptions)
