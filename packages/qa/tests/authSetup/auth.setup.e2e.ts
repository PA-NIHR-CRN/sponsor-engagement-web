import { test as setup } from '../../hooks/CustomFixtures'

const authSponsorContactFile = '.auth/sponsorContact.json'
const authContactManagerFile = '.auth/contactManager.json'
const authNpmFile = '.auth/nationalPortfolioManager.json'
const cookieOnlyFile = '.auth/consentCookie.json'

const cookieConfig = {
  name: 'SEConsentGDPR',
  value: 'Reject',
  domain: 'test.assessmystudy.nihr.ac.uk',
  path: '/',
  expires: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60, // sets one year from today
  httpOnly: false,
  secure: true,
  sameSite: undefined,
}

setup(
  'Authenticate the Sponsor Contact User',
  async ({ commonItemsPage, signedOutPage, loginPage, studiesPage, page }) => {
    await page.context().addCookies([cookieConfig])
    await commonItemsPage.goto()
    await signedOutPage.assertOnSignedOutPage()
    await signedOutPage.btnSignIn.click()
    await loginPage.assertOnLoginPage()
    await loginPage.loginWithUserCreds('Sponsor Contact')
    await studiesPage.assertOnStudiesPage()
    await page.context().storageState({ path: authSponsorContactFile })
  }
)

setup(
  'Authenticate the Contact Manager User',
  async ({ commonItemsPage, signedOutPage, loginPage, organisationsPage, page }) => {
    await page.context().addCookies([cookieConfig])
    await commonItemsPage.goto()
    await signedOutPage.assertOnSignedOutPage()
    await signedOutPage.btnSignIn.click()
    await loginPage.assertOnLoginPage()
    await loginPage.loginWithUserCreds('Contact Manager')
    await organisationsPage.assertOnOrganisationsPage()
    await page.context().storageState({ path: authContactManagerFile })
  }
)

setup('Authenticate the CPMS NPM User', async ({ cpmsStudiesPage, loginPage, page }) => {
  await page.context().addCookies([cookieConfig])
  await cpmsStudiesPage.goToCpmsStudies()
  await cpmsStudiesPage.assertOnSignInPage()
  await cpmsStudiesPage.btnNext.click()
  await loginPage.loginWithUserCreds('National Portfolio Manager')
  await cpmsStudiesPage.assertOnCpmsStudiesPage()
  await page.context().storageState({ path: authNpmFile })
})

setup('Create a SEConsentGDPR cookie context without auth', async ({ page }) => {
  await page.context().addCookies([cookieConfig])
  await page.context().storageState({ path: cookieOnlyFile })
}) // used for tests the don't require authentication
