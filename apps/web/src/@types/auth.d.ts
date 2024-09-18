import type { UserOrganisation } from 'database'
import type { User } from 'next-auth'
import type { AdapterUser } from 'next-auth/adapters'
import type { OAuthUserConfig } from 'next-auth/providers'

// Define the OAuthProfile interface to represent an OAuth user profile
export interface OAuthProfile {
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

// Define ProviderOptions type by extending OAuthUserConfig and adding a 'wellKnown' property
export type ProviderOptions = OAuthUserConfig<'type'> & { wellKnown: string }

// Augment the 'next-auth' module to extend the Session and Account interfaces
declare module 'next-auth' {
  /**
   * Extended Session interface containing user-related properties.
   * Returned by `useSession`, `getSession`, and received as a prop on the `SessionProvider` React Context.
   */
  interface Session {
    /** Number of seconds to wait before a user is considered idle (not related to session or token expiry) */
    idleTimeout: number

    user: {
      /** Primary key ID associated with the user's local account. */
      id: number

      /** Full name associated with a user's IDG account. */
      name: string

      /** Email address associated with a user's IDG account. */
      email: string

      /** The role IDs associated with the user's local account. */
      roles: number[]

      /** The organisations associated with the user's local account. */
      organisations: UserOrganisation[]

      /** The group ids for the users wso2 account. */
      groups: string[]
    } | null

    /** Let's the UI know if an error has occured (e.g if refreshing the access token failed) */
    error?: string
  }

  // Extended Account interface to include additional properties related to OAuth provider
  interface Account {
    providerAccountId: string
    provider: string
    type: ProviderType
    access_token: string
    refresh_token: string
    scope: string
    id_token: string
    token_type: string
    expires_at: number
    session_state: string
  }
}

// Augment the 'next-auth/jwt' module to extend the JWT interface
declare module 'next-auth/jwt' {
  /** Extended JWT interface to include user and OAuth-related properties */
  interface JWT {
    accessToken: string
    accessTokenExpires: number
    refreshToken: string
    idToken: string
    user: AdapterUser | User
    error?: string
  }
}
