import { withAuth } from 'next-auth/middleware'
import { AUTH_SIGN_IN_PAGE } from './constants/auth'

export default withAuth({
  pages: {
    signIn: AUTH_SIGN_IN_PAGE,
  },
})
