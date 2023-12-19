/**
 * This module defines an environment schema using Zod to validate environment variables at build time.
 * It ensures that the required environment variables are present and have the correct types.
 * The schema is used to parse and validate environment variables before they are used in the application.
 *
 */

const z = require('zod')

/**
 * Represents the schema for validating environment variables.
 * @type {z.ZodObject}
 */
const envSchema = z
  .object({
    NEXTAUTH_URL: z.string(),
    NEXTAUTH_SECRET: z.string(),
    NEXTAUTH_IDLE_TIMEOUT: z.string(),
    NEXTAUTH_SESSION_EXPIRY: z.string(),
    NEXTAUTH_DEBUG: z.literal('enabled').or(z.literal('disabled')),

    NEXT_PUBLIC_APP_ENV: z.union([
      z.literal(''),
      z.literal('dev'),
      z.literal('test'),
      z.literal('uat'),
      z.literal('oat'),
      z.literal('prod'),
    ]),

    AUTH_URL: z.string(),
    AUTH_WELL_KNOWN_URL: z.string(),
    AUTH_CLIENT_ID: z.string(),
    AUTH_CLIENT_SECRET: z.string(),

    DATABASE_URL: z.string(),
  })
  .required()

/**
 * Parses and validates the environment variables using the defined schema.
 * @type {Object}
 */
if (process.env.ENVIRONMENT_VARIABLE_CHECKS !== 'disabled') {
  console.info('Skipping required environment variable checks')

  module.exports = envSchema.parse({
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_IDLE_TIMEOUT: process.env.NEXTAUTH_IDLE_TIMEOUT,
    NEXTAUTH_SESSION_EXPIRY: process.env.NEXTAUTH_SESSION_EXPIRY,
    NEXTAUTH_DEBUG: process.env.NEXTAUTH_DEBUG,

    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,

    AUTH_URL: process.env.AUTH_URL,
    AUTH_WELL_KNOWN_URL: process.env.AUTH_WELL_KNOWN_URL,
    AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID,
    AUTH_CLIENT_SECRET: process.env.AUTH_CLIENT_SECRET,

    DATABASE_URL: process.env.DATABASE_URL,
  })
}
