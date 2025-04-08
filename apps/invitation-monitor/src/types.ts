import type { Prisma } from 'database'

export type UserOrgnaisationInvitations = Prisma.UserOrganisationInvitationGetPayload<{
  select: {
    id: true
    messageId: true
    timestamp: true
    sentBy: {
      select: {
        email: true
      }
    }
    userOrganisation: {
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    }
  }
}>[]
