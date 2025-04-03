import { Mock } from 'ts-mockery'
import type { UserOrganisationInvitation } from 'database'

export const pendingEmails = Mock.of<UserOrganisationInvitation[]>([
  { id: 1, messageId: '1-1-1', timestamp: new Date('2025-01-10') },
])
