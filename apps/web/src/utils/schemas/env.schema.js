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
    APP_ENV: z.union([
      z.literal(''),
      z.literal('dev'),
      z.literal('test'),
      z.literal('uat'),
      z.literal('oat'),
      z.literal('prod'),
    ]),
    AUTH_WELL_KNOWN_URL: z.string(),
    AUTH_CLIENT_ID: z.string(),
    AUTH_CLIENT_SECRET: z.string(),
    IDG_API_URL: z.string(),
    IDG_API_USERNAME: z.string(),
    IDG_API_PASSWORD: z.string(),
    DATABASE_URL: z.string(),
    NEXT_PUBLIC_GTM_ID: z.string(),
    CONTENTFUL_SPACE_ID: z.string(),
    CONTENTFUL_ACCESS_TOKEN: z.string(),
    CONTENTFUL_ENVIRONMENT: z.string(),
    CONTENTFUL_BANNER_ENTRY_ID: z.string(),
    CONTENTFUL_PREVIEW_MODE: z.string(),
    CONTENTFUL_PREVIEW_ACCESS_TOKEN: z.string(),
    AWS_SECRET_NAME: z.string(),
    AWS_REGION: z.string(),
  })
  .required()

/**
 * Parses and validates the environment variables using the defined schema.
 * @type {Object}
 */
if (process.env.ENVIRONMENT_VARIABLE_CHECKS !== 'disabled') {
  module.exports = envSchema.parse({
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_IDLE_TIMEOUT: process.env.NEXTAUTH_IDLE_TIMEOUT,
    NEXTAUTH_SESSION_EXPIRY: process.env.NEXTAUTH_SESSION_EXPIRY,
    NEXTAUTH_DEBUG: process.env.NEXTAUTH_DEBUG,
    APP_ENV: process.env.APP_ENV,
    AUTH_WELL_KNOWN_URL: process.env.AUTH_WELL_KNOWN_URL,
    AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID,
    AUTH_CLIENT_SECRET: process.env.AUTH_CLIENT_SECRET,
    IDG_API_URL: process.env.IDG_API_URL,
    IDG_API_USERNAME: process.env.IDG_API_USERNAME,
    IDG_API_PASSWORD: process.env.IDG_API_PASSWORD,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
    CONTENTFUL_ENVIRONMENT: process.env.CONTENTFUL_ENVIRONMENT,
    CONTENTFUL_BANNER_ENTRY_ID: process.env.CONTENTFUL_BANNER_ENTRY_ID,
    CONTENTFUL_PREVIEW_MODE: process.env.CONTENTFUL_PREVIEW_MODE,
    CONTENTFUL_PREVIEW_ACCESS_TOKEN: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
    AWS_SECRET_NAME: process.env.AWS_SECRET_NAME,
    AWS_REGION: process.env.AWS_REGION,
  })
}
