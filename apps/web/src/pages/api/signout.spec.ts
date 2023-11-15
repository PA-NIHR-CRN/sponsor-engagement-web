import type { NextApiRequest, NextApiResponse } from 'next'
import { logger } from '@nihr-ui/logger'
import handler from './signout'

jest.mock('@nihr-ui/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}))

describe('API Handler: Logout', () => {
  let req: Partial<NextApiRequest>
  let res: Partial<NextApiResponse>

  beforeEach(() => {
    req = {
      method: 'GET',
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

    expect(res.redirect).toHaveBeenCalledWith(302, 'https://dev.id.nihr.ac.uk/oidc/logout')
  })

  it('should handle wrong HTTP methods and log an error', () => {
    req.method = 'POST'

    handler(req as NextApiRequest, res as NextApiResponse)

    expect(res.redirect).not.toHaveBeenCalled()
    expect(logger.error).toHaveBeenCalledWith(new Error('Wrong method'))
  })
})
