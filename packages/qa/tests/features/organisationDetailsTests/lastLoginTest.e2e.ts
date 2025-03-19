import { test } from '../../../hooks/CustomFixtures'

test.describe('Last login column validation for Orgnasiation Details Page - @se_250', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })
  test('As a Sponsor Contact I can see the last login column on the Orgnisation Details Page - @se_250_ac1', async ({
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
    await test.step('Then I am taken to the orgnasiation details page', async () => {
      await organisationDetailsPage.assertOnOrganisationDetailsPage(orgId, '2')
    })
    await test.step('And it will contain a List of Contacts for that Organisation', async () => {
      await organisationDetailsPage.assertContactListDisplayed(true)
    })
    await test.step('And each contact displays the correct date of last login', async () => {
      await organisationDetailsPage.assertContactDateOfLastLogin()
    })
  })
})
