import type { Prisma } from 'database'

export type UserOrganisationInvitations = Prisma.UserOrganisationInvitationGetPayload<{
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

export type Notification = Prisma.NotificationGetPayload<{
  select: {
    id: true
    messageId: true
    timestamp: true
  }
}>[]
