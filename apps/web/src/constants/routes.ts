/**
 * Signin page that unauthenticated users are redirected to
 */
export const SIGN_IN_PAGE = '/auth/signin'

/**
 * List of studies that users with sponsor contact and contact manager roles can access
 */
export const STUDIES_PAGE = '/studies'

/**
 * List of organisations that users with contact manager role can access
 */
export const ORGANISATIONS_PAGE = '/organisations'

/**
 * Support page
 */
export const SUPPORT_PAGE = '/request-support'

/**
 * Registration page where we'll determine if a user needs to signup for an IDG account based on their registrationToken
 */
export const REGISTRATION_PAGE = '/register'

/**
 * Registration confirmation page where users will be redirected to after successful IDG & SE account creation
 */
export const REGISTRATION_CONFIRMATION_PAGE = '/register/confirmation'

/**
 * Registration confirmation page where users will be redirected to after linking existing IDG accounts to SE
 */
export const REGISTRATION_CONFIRMATION_LINKED_PAGE = '/register/confirmation/linked'

/**
 * Error page for internal server errors
 */
export const ERROR_PAGE_500 = '/500'

/**
 * Error page for page not found
 */
export const ERROR_PAGE_404 = '/404'

/**
 * External URLs
 */

export const EXTERNAL_CRN_URL = 'https://www.nihr.ac.uk/explore-nihr/support/clinical-research-network.htm'

export const EXTERNAL_CRN_TERMS_CONDITIONS_URL =
  'https://www.nihr.ac.uk/documents/researchers/i-need-help-to-deliver-my-research/terms-and-conditions-for-nihr-crn-support.pdf'
