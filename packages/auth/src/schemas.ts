import { z } from 'zod'

/**
 * This file defines a set of Zod schemas for validating and parsing responses from the IDG API.
 *
 * - `refreshTokenResponseSchema`: Schema for validating the response when refreshing an OAuth2 token.
 * - `checkSessionResponseSchema`: Schema for validating the response when checking the validity of a session.
 * - `getUserRequestSchema`: Schema for validating the request when retrieving user data.
 * - `getUserResponseSchema`: Schema for validating the response when retrieving user data.
 * - `createUserRequestSchema`: Schema for validating the request when creating a new user.
 * - `createUserResponseSchema`: Schema for validating the response when creating a new user.
 *
 * These schemas help ensure that the data exchanged with the API follows the expected structure and types.
 * They are used in conjunction with the API interaction functions to handle and validate data effectively.
 */

export const refreshTokenResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  scope: z.string(),
  id_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
})

export const checkSessionResponseSchema = z.discriminatedUnion('active', [
  z.object({
    active: z.literal(false),
  }),
  z.object({
    active: z.literal(true),
    nbf: z.number(),
    scope: z.string(),
    token_type: z.string(),
    exp: z.number(),
    iat: z.number(),
    client_id: z.string(),
    username: z.string(),
  }),
])

export const getUserRequestSchema = z.object({
  startIndex: z.number(),
  count: z.number(),
  domain: z.string(),
  filter: z.string(),
  attributes: z.string(),
})

export const getUserResponseSchema = z.object({
  totalResults: z.number(),
  startIndex: z.number(),
  itemsPerPage: z.number(),
  schemas: z.array(z.string()),
  Resources: z.array(z.object({ id: z.string(), userName: z.string() })).optional(),
})

export const createUserRequestSchema = z.object({
  schemas: z.array(z.string()),
  name: z.object({
    givenName: z.string().optional(),
    familyName: z.string().optional(),
  }),
  userName: z.string(),
  password: z.string(),
  emails: z.array(
    z.object({
      value: z.string(),
    })
  ),
})

export const createUserResponseSchema = z.union([
  z.object({
    id: z.undefined(),
    detail: z.string(),
    status: z.string(),
    schemas: z.array(z.string()),
  }),
  z.object({
    emails: z.array(z.string()),
    meta: z.object({
      created: z.string(),
      location: z.string(),
      lastModified: z.string(),
      resourceType: z.string(),
    }),
    schemas: z.array(z.string()),
    roles: z.array(
      z.object({
        type: z.string(),
        value: z.string(),
      })
    ),
    name: z
      .object({
        givenName: z.string().optional(),
        familyName: z.string().optional(),
      })
      .optional(),
    id: z.string(),
    userName: z.string(),
  }),
])
