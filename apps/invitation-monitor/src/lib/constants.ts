import { EventType } from '@aws-sdk/client-sesv2'

/**
 * The status of an invitation email
 * This should match the values in SysRefInvitationStatus table
 */
export const UserOrganisationInviteStatus = { SUCCESS: 'Success', FAILURE: 'Failure', PENDING: 'Pending' }

export const PERMANENT_EMAIL_FAILURES: string[] = [EventType.RENDERING_FAILURE, EventType.REJECT]
