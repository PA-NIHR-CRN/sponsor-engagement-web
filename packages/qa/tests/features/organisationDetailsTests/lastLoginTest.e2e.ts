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
