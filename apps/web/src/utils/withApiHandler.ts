import type { NextApiRequest, NextApiResponse } from 'next'
import type { AuthOptions, Session } from 'next-auth'
import { getServerSession } from 'next-auth'
import { logger } from '@nihr-ui/logger'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import { SIGN_IN_PAGE } from '../constants/routes'
import type { Roles } from '../constants'
import { AuthError } from './auth'

interface SessionWithUser {
  user: NonNullable<Session['user']>
}

export const withApiHandler =
  <Req extends NextApiRequest = NextApiRequest, Res extends NextApiResponse = NextApiResponse>(
    role: Roles,
    handler: (req: Req, res: Res, session: SessionWithUser) => Promise<Res>
  ) =>
  async (req: Req, res: Res) => {
    try {
      const session = await getServerSession<AuthOptions, SessionWithUser>(req, res, authOptions)

      if (!session?.user) {
        throw new AuthError('Not signed in')
      }

      if (!session.user.roles.includes(role)) {
        throw new Error('No role found for user')
      }

      if (session.user.organisations.length === 0) {
        throw new Error('No organisations found for user')
      }

      return handler(req, res, session)
    } catch (error) {
      logger.error(error)
      if (error instanceof AuthError) {
        return res.redirect(302, SIGN_IN_PAGE)
      }
      return res.redirect(302, '/500')
    }
  }
