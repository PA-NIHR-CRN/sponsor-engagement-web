import { unlinkSync } from 'fs'

async function globalTeardown() {
  //removing files generated during setup
  unlinkSync('.auth/sponsorContact.json')
  unlinkSync('.auth/contactManager.json')
  unlinkSync('.auth/nationalPortfolioManager.json')
  unlinkSync('.auth/consentCookie.json')
}

export default globalTeardown
