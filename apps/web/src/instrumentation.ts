import assert from 'node:assert'

import { logger } from '@nihr-ui/logger'
import { getAllSecrets } from '@nihr-ui/secrets'

export async function register() {
  logger.info('Registering secrets')

  const { AWS_SECRET_NAME } = process.env
  assert(AWS_SECRET_NAME, 'AWS_SECRET_NAME is not defined')

  await getAllSecrets(AWS_SECRET_NAME)

  logger.info('Secrets registered')
}
