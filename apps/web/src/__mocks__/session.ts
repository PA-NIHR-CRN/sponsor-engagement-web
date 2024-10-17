import type { UserOrganisation } from 'database'
import type { Session } from 'next-auth'

import { Roles } from '../constants/auth'

const defaults: Omit<Session, 'user'> = {
  idleTimeout: 10000,
  expires: '12345',
}

const mockUserOrganisation: UserOrganisation = {
  id: 1,
  userId: 123,
  organisationId: 123,
  createdById: 1,
  updatedById: 1,
  createdAt: new Date('2001-01-01'),
  updatedAt: new Date('2001-01-01'),
  isDeleted: false,
}

export const userNoRoles: Session = {
  ...defaults,
  user: {
    id: 123,
    name: 'Test User',
    email: 'testuser@nihr.ac.uk',
    roles: [],
    organisations: [mockUserOrganisation],
    groups: [],
  },
}

export const userNoOrgs: Session = {
  ...defaults,
  user: {
    id: 123,
    name: 'Test User',
    email: 'testuser@nihr.ac.uk',
    roles: [Roles.SponsorContact],
    organisations: [],
    groups: [],
  },
}

export const userWithSponsorContactRole: Session = {
  ...defaults,
  user: {
    id: 123,
    name: 'Test User',
    email: 'testuser@nihr.ac.uk',
    roles: [Roles.SponsorContact],
    organisations: [mockUserOrganisation],
    groups: [],
  },
}

export const userWithContactManagerRole: Session = {
  ...defaults,
  user: {
    id: 123,
    name: 'Test User',
    email: 'testuser@nihr.ac.uk',
    roles: [Roles.ContactManager],
    organisations: [mockUserOrganisation],
    groups: [],
  },
}

export const userWithSponsorContactAndContactManagerRoles: Session = {
  ...defaults,
  user: {
    id: 123,
    name: 'Test User',
    email: 'testuser@nihr.ac.uk',
    roles: [Roles.SponsorContact, Roles.ContactManager],
    organisations: [mockUserOrganisation],
    groups: [],
  },
}
