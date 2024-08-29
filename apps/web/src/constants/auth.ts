/**
 * Identifer of our custom next-auth provider
 */
export const AUTH_PROVIDER_ID = 'oidc'

/**
 * Name of our custom next-auth provider
 */
export const AUTH_PROVIDER_NAME = 'OIDC'

/**
 * Auth type of our custom next-auth provider
 */
export const AUTH_PROVIDER_TYPE = 'oauth'

/**
 * Fallback session expiry to use when the NEXTAUTH_SESSION_EXPIRY env var is not provided
 * This is specifically for next-auth's JWT session expiration and not IDG's access token expiration
 */
export const AUTH_SESSION_EXPIRY_FALLBACK = 2592000 // 30 days

/**
 * Local roles associated with a user
 */
export enum Roles {
  SponsorContact = 1,
  ContactManager = 2,
}

export const PASSWORD_MIN_LENGTH = 12

export const ODP_ROLE = 'ODP_SponsorEngagementTool'
