import { logger } from '@nihr-ui/logger'
import type { NextApiResponse } from 'next'

export default function handler(req, res: NextApiResponse) {
  logger.info('App healthy')
  res.status(200).send('OK')
}
