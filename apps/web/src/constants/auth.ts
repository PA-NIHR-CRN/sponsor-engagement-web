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
 * Local roles associated with a user
 */
export enum Roles {
  SponsorContact = 1,
  ContactManager = 2,
}
