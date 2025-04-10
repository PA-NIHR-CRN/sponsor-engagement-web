import type { Prisma } from 'database'

export type UserOrgnaisationInvitations = Prisma.UserOrganisationInvitationGetPayload<{
  select: {
    id: true
    messageId: true
    timestamp: true
  }
}>[]
