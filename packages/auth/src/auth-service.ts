import { requests } from './handlers'

export class AuthService {
  getUser = async (email: string) => {
    return requests.getUser(email)
  }

  createUser = async (user: {
    givenName?: string
    familyName?: string
    userName?: string
    password: string
    emails: string[]
  }) => {
    return requests.createUser(user)
  }
}
