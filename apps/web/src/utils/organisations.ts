import type { Prisma } from '@/lib/prisma'

import { isContactManager, isContactManagerAndSponsorContact, isSponsorContact } from './auth'

type UserOrganisationId = Prisma.UserOrganisationGetPayload<{
  select: {
    organisationId: true
  }
}>

// Checks to see if the user has acccess to a given organisation
export const hasOrganisationAccess = (
  roles: number[],
  userOrganisations: UserOrganisationId[],
  organisationId: number
) => {
  // Contact managers have access to all organisations
  if (isContactManagerAndSponsorContact(roles) || isContactManager(roles)) return true

  // Sponsor contacts only have access to organisations they are associated to
  if (
    isSponsorContact(roles) &&
    userOrganisations.find((organisation) => organisation.organisationId === organisationId)
  )
    return true

  return false
}
