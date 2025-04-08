import { Mock } from 'ts-mockery'
import type { UserOrgnaisationInvitations } from '../types'

export const pendingEmails = Mock.of<UserOrgnaisationInvitations>([
  {
    id: 1,
    messageId: '1-1-1',
    timestamp: new Date('2025-03-31'),
    sentBy: {
      email: 'sender@test.nihr.ac.uk',
    },
    userOrganisation: {
      user: {
        email: 'receiver@test.nihr.ac.uk',
      },
    },
  },
])
