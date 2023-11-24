import { requests } from './handlers'

export class AuthService {
  checkSession = async (token: string) => requests.checkSession(token)

  getUser = async (email: string) => requests.getUser(email)

  createUser = async (user: {
    givenName?: string
    familyName?: string
    userName?: string
    password: string
    emails: string[]
  }) => requests.createUser(user)
}
