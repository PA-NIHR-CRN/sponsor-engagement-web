/**
 * Max amount of characters for a textarea
 */
export const TEXTAREA_MAX_CHARACTERS = 400

/**
 * Error messaging for different form submission failures
 */
export const FORM_ERRORS = {
  1: 'An unexpected error occured whilst processing the form, please try again later.',
  2: 'A contact with this email address has already been assigned to this organisation',
  3: 'User has been assigned to the organisation, but the invite email has not been sent as the email is not in the allowed list for testing',
} as Record<number, string>
