import { test as setup } from '../../hooks/CustomFixtures'

const authSponsorContactFile = '.auth/sponsorContact.json'
const authContactManagerFile = '.auth/contactManager.json'
const authNpmFile = '.auth/nationalPortfolioManager.json'
const cookieConfig = {
  name: 'SEConsentGDPR',
  value: 'Reject',
  domain: 'test.assessmystudy.nihr.ac.uk',
  path: '/',
  expires: Math.floor(new Date('2028-10-17T09:09:17.000Z').getTime() / 1000),
  httpOnly: false,
  secure: true,
}

setup(
  'Authenticate the Sponsor Contact User',
  async ({ commonItemsPage, signedOutPage, loginPage, studiesPage, page }) => {
    await commonItemsPage.goto()
    await signedOutPage.assertOnSignedOutPage()
    await signedOutPage.btnSignIn.click()
    await loginPage.assertOnLoginPage()
    await loginPage.loginWithUserCreds('Sponsor Contact')
    await studiesPage.assertOnStudiesPage()
    await page.context().addCookies([cookieConfig])
    await page.context().storageState({ path: authSponsorContactFile })
  }
)

setup(
  'Authenticate the Contact Manager User',
  async ({ commonItemsPage, signedOutPage, loginPage, organisationsPage, page }) => {
    await commonItemsPage.goto()
    await signedOutPage.assertOnSignedOutPage()
    await signedOutPage.btnSignIn.click()
    await loginPage.assertOnLoginPage()
    await loginPage.loginWithUserCreds('Contact Manager')
    await organisationsPage.assertOnOrganisationsPage()
    await page.context().addCookies([cookieConfig])
    await page.context().storageState({ path: authContactManagerFile })
  }
)

setup('Authenticate the CPMS NPM User', async ({ cpmsStudiesPage, loginPage, page }) => {
  await cpmsStudiesPage.goToCpmsStudies()
  await cpmsStudiesPage.assertOnSignInPage()
  await cpmsStudiesPage.btnNext.click()
  await loginPage.loginWithUserCreds('National Portfolio Manager')
  await cpmsStudiesPage.assertOnCpmsStudiesPage()
  await page.context().addCookies([cookieConfig])
  await page.context().storageState({ path: authNpmFile })
})
