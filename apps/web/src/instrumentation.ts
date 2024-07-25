import assert from 'node:assert'

import { logger } from '@nihr-ui/logger'
import { getAllSecrets } from '@nihr-ui/secrets'

import { validateEnv } from './utils/schemas/env.schema'

export async function register() {
  const { AWS_SECRET_NAME, NODE_ENV } = process.env

  logger.info(`${NODE_ENV}`)
  if (NODE_ENV !== 'development') {
    logger.info(`Attempting to register secrets from AWS Secrets Manager as environment variables.`)
    assert(AWS_SECRET_NAME, 'AWS_SECRET_NAME is not defined')

    await getAllSecrets(AWS_SECRET_NAME)

    logger.info(`Successfully registered secrets from AWS Secrets Manager as environment variables.`)
    logger.info(process.env)
  }

  validateEnv()
}
