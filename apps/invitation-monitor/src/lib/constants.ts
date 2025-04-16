import { EventType } from '@aws-sdk/client-sesv2'

/**
 * The status of an invitation email
 * This should match the values in SysRefInvitationStatus table
 */
export const UserOrganisationInviteStatus = { SUCCESS: 'Success', FAILURE: 'Failure', PENDING: 'Pending' }

export const PERMANENT_EMAIL_FAILURES: string[] = [EventType.RENDERING_FAILURE, EventType.REJECT]

/**
 * A list of Amazon SES errors that we want to attempt a retry after receiving
 */
export const RETRYABLE_SES_ERRORS = [
  'InternalFailure',
  'RequestAbortedException',
  'RequestExpired',
  'RequestTimeoutException',
  'ServiceUnavailable',
  'ThrottlingException',
  'TooManyRequestsException',
]
