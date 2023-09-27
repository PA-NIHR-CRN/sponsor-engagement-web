import type { Session } from 'next-auth'
import { Roles } from '../constants/auth'

const defaults: Omit<Session, 'user'> = {
  expires: '12345',
}

export const userNoRoles: Session = {
  ...defaults,
  user: {
    name: 'Test User',
    email: 'testuser@nihr.ac.uk',
    roles: [],
  },
}

export const userWithSponsorContactRole: Session = {
  ...defaults,
  user: {
    name: 'Test User',
    email: 'testuser@nihr.ac.uk',
    roles: [Roles.SponsorContact],
  },
}

export const userWithContactManagerRole: Session = {
  ...defaults,
  user: {
    name: 'Test User',
    email: 'testuser@nihr.ac.uk',
    roles: [Roles.ContactManager],
  },
}

export const userWithSponsorContactAndContactManagerRoles: Session = {
  ...defaults,
  user: {
    name: 'Test User',
    email: 'testuser@nihr.ac.uk',
    roles: [Roles.SponsorContact, Roles.ContactManager],
  },
}
