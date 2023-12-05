import { randomUUID } from 'node:crypto'
import axios from 'axios'
import type { ZodType, z } from 'zod'
import rateLimit from 'axios-rate-limit'
import type { createUserRequestSchema, getUserRequestSchema } from './schemas'
import {
  checkSessionResponseSchema,
  getUserResponseSchema,
  createUserResponseSchema,
  refreshTokenResponseSchema,
} from './schemas'

const { IDG_API_URL, IDG_API_USERNAME, IDG_API_PASSWORD } = process.env

const baseURL = IDG_API_URL ? new URL(IDG_API_URL).origin : ''

const api = rateLimit(
  axios.create({
    baseURL,
    auth: {
      username: IDG_API_USERNAME || '',
      password: IDG_API_PASSWORD || '',
    },
  }),
  {
    maxRequests: 5,
    perMilliseconds: 1000,
    maxRPS: 5,
  }
)

type Infer<T extends ZodType> = z.infer<T>

/**
 * The requests object defines a set of functions for interacting with the IDG API using Axios.
 *
 * - `refreshToken`: Sends a POST request to refresh an OAuth2 token using a client's refresh token.
 * - `checkSession`: Sends a POST request to check the validity of a session token.
 * - `getUser`: Sends a GET request to retrieve user data based on an email address.
 * - `createUser`: Sends a POST request to create a new user with the specified information.
 *
 * These functions use rate limiting to ensure that a maximum number of requests
 * can be made to the API within a specified time frame.
 *
 * Additionally, the functions utilize Zod schemas to validate response data from the API
 * and return parsed results or error information.
 *
 * Note: The functions require certain environment variables like API URL, username, and password
 * to be set in the process environment.
 */

export const requests = {
  refreshToken: async ({
    clientId,
    clientSecret,
    refreshToken,
  }: {
    clientId: string
    clientSecret: string
    refreshToken: string
  }) => {
    const response = await api.post<Infer<typeof refreshTokenResponseSchema>>(`/oauth2/token`, null, {
      auth: {
        username: clientId,
        password: clientSecret,
      },
      params: { refresh_token: refreshToken, grant_type: 'refresh_token' },
    })
    return refreshTokenResponseSchema.safeParse(response.data)
  },
  checkSession: async (token: string) => {
    const response = await api.post<Infer<typeof checkSessionResponseSchema>>(`/oauth2/introspect`, null, {
      params: { token },
    })
    return checkSessionResponseSchema.safeParse(response.data)
  },
  getUser: async (email: string) => {
    const params: Infer<typeof getUserRequestSchema> = {
      startIndex: 1,
      count: 1,
      domain: 'PRIMARY',
      attributes: 'userName',
      filter: `emails eq ${email}`,
    }

    const response = await api.get<Infer<typeof getUserResponseSchema>>(`/scim2/Users`, { params })
    return getUserResponseSchema.safeParse(response.data)
  },
  createUser: async ({
    givenName,
    familyName,
    userName = randomUUID(),
    password,
    emails,
  }: {
    givenName?: string
    familyName?: string
    userName?: string
    password: string
    emails: string[]
  }) => {
    const data: Infer<typeof createUserRequestSchema> = {
      schemas: [],
      name: {
        givenName,
        familyName,
      },
      userName,
      password,
      emails: emails.map((value) => ({ value })),
    }

    const response = await api.post<Infer<typeof createUserResponseSchema>>(`/scim2/Users`, data)
    return createUserResponseSchema.safeParse(response.data)
  },
}
