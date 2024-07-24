import assert from 'node:assert'

import { logger } from '@nihr-ui/logger'
import { getAllSecrets } from '@nihr-ui/secrets'

export async function register() {
  const { AWS_SECRET_NAME, APP_ENV } = process.env

  if (APP_ENV) {
    logger.info(`${APP_ENV}: Attempting to register secrets from AWS Secrets Manager as environment variables.`)
    assert(AWS_SECRET_NAME, 'AWS_SECRET_NAME is not defined')

    await getAllSecrets(AWS_SECRET_NAME)

    logger.info(`${APP_ENV}: Successfully registered secrets from AWS Secrets Manager as environment variables.`)
  }
}
