/**
 * Max amount of characters for a textarea
 */
export const TEXTAREA_MAX_CHARACTERS = 1200

/**
 * Max amount of words for a textarea
 */
export const FORM_ERRORS = {
  fatal: 'An unexpected error occured whilst processing the form, please try again later.',
} as const

/**
 * Check is valid phone number
 * https://stackoverflow.com/a/33561517
 */
export const PHONE_NUMBER_REGEX = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g
