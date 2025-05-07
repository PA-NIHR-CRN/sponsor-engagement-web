import { Roles } from '../constants/auth'

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export const isContactManager = (roles: number[]) => roles.includes(Roles.ContactManager)

export const isSponsorContact = (roles: number[]) => roles.includes(Roles.SponsorContact)
