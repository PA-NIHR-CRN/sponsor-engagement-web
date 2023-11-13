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
} as Record<number, string>
