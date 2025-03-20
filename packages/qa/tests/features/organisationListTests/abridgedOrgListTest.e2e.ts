import { test } from '../../../hooks/CustomFixtures'

const orgIdWithContacts = 2

test.describe('Sponsor Organisation Details Page for Sponsor Contacts - @se_248', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('As a Sponsor Contact associated to one organisation I can see the expected Organisation details Page Layouts - @se_248_ac1_one_organisation', async ({
    commonItemsPage,
    organisationDetailsPage,
  }) => {
    await test.step('Given I have navigated to the Study deatils Page', async () => {
      await commonItemsPage.goto()
    })
    await test.step('When I click on the manage sponsor contacts icon', async () => {
      await commonItemsPage.manageAbridgedContactsIcon.click()
    })
    await test.step('Then I am taken to the orgnasiation details page, not the orgnanisation list page', async () => {
      await organisationDetailsPage.assertOnOrganisationDetailsPage(orgIdWithContacts.toString())
    })
  })
})

/*
Requires a database change
test.describe('Sponsor Organisation List Page for Sponsor Contacts - @se_248', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })
  test('As a Sponsor Contact associated to two or more organisations I can see the expected Organisation list Page Layouts - @se_248_ac2_multiple_organisations', async ({
    commonItemsPage,
    organisationsPage,
  }) => {
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
*/
