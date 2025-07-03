/**
 * Max amount of characters for a textarea
 */
export const TEXTAREA_MAX_CHARACTERS = 400

/**
 * Error messaging for different form submission failures
 */
export const FORM_ERRORS = {
  1: 'An unexpected error occurred whilst processing the form, please try again later.',
  2: 'The email address you have entered already exists for a user assigned to this organisation, so the user has not been added',
  3: "The user has been assigned to the organisation, but the invite email has not been sent as the user's email domain is not in the allowed list for testing",
  4: 'The entered email address is already a contact manager',
} as Record<number, string>

/**
 * Success messages for different form submissions
 */
export const FORM_SUCCESS_MESSAGES = {
  1: 'The study assessment was successfully saved',
  2: 'Your study data changes have been received. These will now be reviewed and applied to the study record. Until then, previous study data values will be displayed.', // Proposed study updates
  3: 'Your study data changes have been accepted.', // Direct study updates
} as Record<number, string>

export const UPDATE_FROM_SE_TEXT = 'Update from Sponsor Engagement Tool'
