import type { NextApiRequest, NextApiResponse } from 'next'
import type { AuthOptions, Session } from 'next-auth'
import { getServerSession } from 'next-auth'
import { authOptions } from '../pages/api/auth/[...nextauth]'

interface SessionWithUser {
  user: NonNullable<Session['user']>
}

export const withApiHandler =
  <Req extends NextApiRequest = NextApiRequest, Res extends NextApiResponse = NextApiResponse>(
    handler: (req: Req, res: Res, session: SessionWithUser) => Promise<Res>
  ) =>
  async (req: Req, res: Res) => {
    const session = await getServerSession<AuthOptions, SessionWithUser>(req, res, authOptions)

    if (!session?.user) {
      throw new Error('Unauthorised')
    }

    if (session.user.roles.length === 0 || session.user.organisations.length === 0) {
      throw new Error('No roles or organisations found for user')
    }

    return handler(req, res, session)
  }
