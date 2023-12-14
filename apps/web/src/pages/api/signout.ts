import type { NextApiRequest, NextApiResponse } from 'next'
import { logger } from '@nihr-ui/logger'
import { getAbsoluteUrl } from '../../utils/email'

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

    const identityProviderLogoutUrl = new URL(`${identityProviderUrl}/oidc/logout`)
    identityProviderLogoutUrl.searchParams.set('post_logout_redirect_uri', getAbsoluteUrl(''))
    identityProviderLogoutUrl.searchParams.set('id_token_hint', String(req.query.idTokenHint))

    logger.info(`sign out api handler - redirecting to idg with url ${identityProviderLogoutUrl.toString()}`)

    res.redirect(302, identityProviderLogoutUrl.toString())
  } catch (error) {
    logger.error(error)
  }
}
