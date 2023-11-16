import type { NextApiRequest, NextApiResponse } from 'next'
import { logger } from '@nihr-ui/logger'

/**
 * This API handler is responsible for redirecting to the IDG logout page
 * E.g. https://dev.id.nihr.ac.uk/oidc/logout
 *
 * This is necessary otherwise after clearing the session in our own app, it
 * will automatically sign in the user as they're still signed into IDG
 */
export default (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'GET') {
      throw new Error('Wrong method')
    }

    const identityProviderUrl = new URL(process.env.AUTH_WELL_KNOWN_URL).origin
    const identityProviderLogoutUrl = `${identityProviderUrl}/oidc/logout`

    res.redirect(302, identityProviderLogoutUrl)
  } catch (error) {
    logger.error(error)
  }
}
