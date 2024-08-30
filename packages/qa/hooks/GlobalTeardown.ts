import { unlinkSync } from 'fs'
async function globalTeardown() {
  //removing files generated during setup
  unlinkSync('.auth/sponsorContact.json')
  unlinkSync('.auth/contactManager.json')
}
export default globalTeardown
