import type { GetServerSidePropsContext } from 'next'
import type { Session } from 'next-auth'
import { getServerSession } from 'next-auth'

import type { Roles } from '../constants'
import { SIGN_IN_PAGE } from '../constants/routes'
import { authOptions } from '../pages/api/auth/[...nextauth]'

export const withServerSideProps =
  <R>(roles: Roles[], getServerSideProps: (context: GetServerSidePropsContext, session: Session) => R) =>
  async (context: GetServerSidePropsContext) => {
    try {
      const session = await getServerSession(context.req, context.res, authOptions)

      if (!session?.user) {
        return {
          redirect: {
            destination: SIGN_IN_PAGE,
          },
        }
      }

      if (!session.user.roles.some((role) => roles.includes(role))) {
        return {
          redirect: {
            destination: '/',
          },
        }
      }

      return getServerSideProps(context, session)
    } catch (error) {
      return {
        redirect: {
          destination: '/500',
        },
      }
    }
  }
