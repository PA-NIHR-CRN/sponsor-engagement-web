// import { test as setup, expect } from '@playwright/test';
import { test as setup } from '../../hooks/CustomFixtures'

const authSponsorContactFile = '.auth/sponsorContact.json'
const authContactManagerFile = '.auth/contactManager.json'

setup(
  'Authenticate the Sponsor Contact User',
  async ({ commonItemsPage, signedOutPage, loginPage, studiesPage, page }) => {
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
    await commonItemsPage.goto()
    await signedOutPage.assertOnSignedOutPage()
    await signedOutPage.btnSignIn.click()
    await loginPage.assertOnLoginPage()
    await loginPage.loginWithUserCreds('Contact Manager')
    await organisationsPage.assertOnOrganisationsPage()
    await page.context().storageState({ path: authContactManagerFile })
  }
)
