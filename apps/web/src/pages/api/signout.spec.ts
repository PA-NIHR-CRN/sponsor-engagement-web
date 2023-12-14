import type { NextApiRequest, NextApiResponse } from 'next'
import { logger } from '@nihr-ui/logger'
import handler from './signout'

jest.mock('@nihr-ui/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}))

describe('API Handler: Logout', () => {
  let req: Partial<NextApiRequest>
  let res: Partial<NextApiResponse>

  beforeEach(() => {
    req = {
      method: 'GET',
      query: {
        idTokenHint: 'mocked-id-token-hint',
      },
    }
    res = {
      redirect: jest.fn(),
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should redirect to the IDG logout page with a 302 status code', () => {
    process.env.AUTH_WELL_KNOWN_URL = 'https://dev.id.nihr.ac.uk'

    handler(req as NextApiRequest, res as NextApiResponse)

    expect(logger.info).toHaveBeenCalledWith(
      'sign out api handler - redirecting to idg with url https://dev.id.nihr.ac.uk/oidc/logout?post_logout_redirect_uri=http%3A%2F%2Flocalhost%3A3000&id_token_hint=mocked-id-token-hint'
    )

    expect(res.redirect).toHaveBeenCalledWith(
      302,
      'https://dev.id.nihr.ac.uk/oidc/logout?post_logout_redirect_uri=http%3A%2F%2Flocalhost%3A3000&id_token_hint=mocked-id-token-hint'
    )
  })

  it('should handle wrong HTTP methods and log an error', () => {
    req.method = 'POST'

    handler(req as NextApiRequest, res as NextApiResponse)

    expect(res.redirect).not.toHaveBeenCalled()
    expect(logger.error).toHaveBeenCalledWith(new Error('Wrong method'))
  })
})
