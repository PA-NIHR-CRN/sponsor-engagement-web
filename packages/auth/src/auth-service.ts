import type { Wso2GroupOperation } from './constants/constants'
import { requests } from './handlers'
import type { GroupUpdateData } from './types/requests'

/**
 * The `AuthService` class provides a set of methods for interacting with the IDG OAuth2 API.
 *
 * These methods act as a high-level interface to interact with the authentication service,
 * making it easier to manage and organize authentication-related operations in your application.
 * The methods delegate their functionality to corresponding functions in the 'requests' module.
 */

export class AuthService {
  /**
   * Refreshes an access token using the provided parameters.
   * @param params - The parameters required for token refresh.
   * @returns A promise that resolves with the refreshed access token.
   */
  async refreshToken(params: { clientId: string; clientSecret: string; refreshToken: string }) {
    return requests.refreshToken(params)
  }

  /**
   * Checks the session validity using the provided token.
   * @param token - The session token to be checked.
   * @returns A promise that resolves with the session status.
   */
  async checkSession(token: string) {
    return requests.checkSession(token)
  }

  /**
   * Retrieves user information based on the provided email.
   * @param email - The email address of the user to retrieve.
   * @returns A promise that resolves with user information.
   */
  async getUser(email: string) {
    return requests.getUser(email)
  }

  /**
   * Creates a new user with the provided details.
   * @param user - The user details for creation.
   * @returns A promise that resolves with the created user's information.
   */
  async createUser(user: {
    givenName?: string
    familyName?: string
    userName?: string
    password: string
    emails: string[]
  }) {
    return requests.createUser(user)
  }

  async patchUserGroup(groupId: string, groupUpdateData: GroupUpdateData) {
    return requests.patchUserGroup(`/scim2/Groups/${groupId}`, groupUpdateData)
  }

  /**
   *
   * @param userId - New wso2 role to user
   * @param userName - New wso2 username
   * @param group - New wso2 group
   * @returns
   */
  async updateWSO2UserGroup(email: string, group: string, operation: Wso2GroupOperation) {
    return requests.updateWSO2UserGroup(email, group, operation)
  }
}
