/**
 * Signin page that unauthenticated users are redirected to
 */
export const SIGN_IN_PAGE = '/auth/signin'

/**
 * Signout page that authenticated users are redirected to when their access token has expired OR clicking logout
 */
export const SIGN_OUT_PAGE = '/auth/signout'

/**
 * Signout page that unauthenticated users are redirected to after IDG signs out a user and redirects back to the SE app
 */
export const SIGN_OUT_CONFIRM_PAGE = '/auth/signout/confirmation'

/**
 * List of studies that users with sponsor contact and contact manager roles can access
 */
export const STUDIES_PAGE = '/studies'

/**
 * List of organisations that users with contact manager role can access
 */
export const ORGANISATIONS_PAGE = '/organisations'

/**
 * List of organisations that users with contact manager role can access
 */
export const CONTACT_MANAGERS_PAGE = '/contact-managers'

/**
 * Support page
 */
export const SUPPORT_PAGE = '/request-support'

/**
 * Registration page where we'll determine if a user needs to signup for an IDG account based on their registrationToken
 */
export const REGISTRATION_PAGE = '/register'

/**
 * Assessment page
 */
export const getAssessmentPageRoute = (studyId: string | number) => `/studies/${studyId}/assess`

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

export const EXTERNAL_CRN_URL =
  'https://www.nihr.ac.uk/support-and-services/support-for-delivering-research/research-delivery-network'

export const EXTERNAL_CRN_TERMS_CONDITIONS_URL =
  'https://www.nihr.ac.uk/support-and-services/support-for-delivering-research/eligibility-rdn-support/rdn-portfolio-terms-and-conditions'

export const EXTERNAL_COOKIE_POLICY_PAGE_URL =
  'https://sites.google.com/nihr.ac.uk/rdncc-policies/sponsor-engagement-tool/set-cookie-policy'

export const TERMS_AND_CONDITIONS_FOOTER_URL =
  'https://sites.google.com/nihr.ac.uk/rdncc-policies/sponsor-engagement-tool/set-terms-and-conditions'

export const PRIVACY_PAGE_URL =
  'https://sites.google.com/nihr.ac.uk/rdncc-policies/sponsor-engagement-tool/set-privacy-notice'

export const ACCESSIBILITY_PAGE_URL =
  'https://sites.google.com/nihr.ac.uk/rdncc-policies/sponsor-engagement-tool/set-accessibility-statement'

export const RELEASE_NOTES_URL =
  'https://sites.google.com/nihr.ac.uk/nihr-sponsor-engagement-tool/se-tool-release-notes'

export const SHAW_TRUST_ACCREDITATION_URL =
  'https://www.accessibility-services.co.uk/certificates/nihr-sponsor-engagement-tool/'
