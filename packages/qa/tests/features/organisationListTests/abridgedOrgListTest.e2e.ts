import { test } from '../../../hooks/CustomFixtures'

test.describe('Sponsor Organisation Details Page for Sponsor Contacts - @se_248', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('As a Sponsor Contact associated to one organisation I can see the expected Organisation details Page Layouts - @se_248_ac1_one_organisation', async ({
    commonItemsPage,
    organisationDetailsPage,
  }) => {
    let orgId: string = ''
    await test.step('Given I have navigated to the Study deatils Page', async () => {
      await commonItemsPage.goto()
    })
    await test.step('When I click on the manage sponsor contacts icon', async () => {
      await commonItemsPage.manageAbridgedContactsIcon.click()
    })
    await test.step('Then I am taken to the orgnasiation details page, not the orgnanisation list page', async () => {
      await organisationDetailsPage.assertOnOrganisationDetailsPage(orgId, '2')
    })
  })
})

test.describe('Sponsor Organisation List Page for Sponsor Contacts - @se_248', () => {
  test('As a Sponsor Contact associated to two or more organisations I can see the expected Organisation list Page Layouts - @se_248_ac2_multiple_organisations', async ({
    commonItemsPage,
    signedOutPage,
    loginPage,
    organisationsPage,
  }) => {
    await test.step('Given I have navigated to the Home Page', async () => {
      await commonItemsPage.goto()
    })
    await test.step('And I have been be re-directed to the Signed Out Page', async () => {
      await signedOutPage.assertOnSignedOutPage()
    })
    await test.step('And I click the `Sign in` button', async () => {
      await signedOutPage.btnSignIn.click()
    })
    await test.step('And I enter my credentials hitting continue', async () => {
      await loginPage.usernameInput.fill('sesponsorcontact2@nihr.ac.uk')
      await loginPage.btnNext.click()
      await loginPage.passwordInput.fill('ylT75gESldLRI8Abrumu')
      await loginPage.btnContinue.click()
    })
    await test.step('Given I have navigated to the Study deatils Page', async () => {
      await commonItemsPage.goto()
    })
    await test.step('When I click on the manage sponsor contacts icon', async () => {
      await commonItemsPage.manageAbridgedContactsIcon.click()
    })
    await test.step('Then I am taken to the the orgnanisation list page, not the orgnasiation details page, ', async () => {
      await organisationsPage.assertOnOrganisationsPage()
    })
  })
})
