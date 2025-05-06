import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'

const sponsorContactUserId = 6

test.describe('Sponsor Organisation Details Page for Sponsor Contacts - @se_248', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('As a Sponsor Contact associated to one organisation I can see the expected Organisation details Page Layouts - @se_248_ac1_one_organisation', async ({
    commonItemsPage,
    organisationDetailsPage,
  }) => {
    const result = await seDatabaseReq(`
      SELECT organisationId FROM UserOrganisation 
      WHERE userId = ${sponsorContactUserId} 
      AND isDeleted = 0
      LIMIT 1;
    `)

    const organisationId = result[0]?.organisationId
    if (!organisationId) {
      throw new Error('Test user is not associated to any organisations, check test data')
    }

    await test.step('Given I have navigated to the Study details Page', async () => {
      await commonItemsPage.goto()
    })
    await test.step('When I click on the manage sponsor contacts icon', async () => {
      await commonItemsPage.manageAbridgedContactsIcon.click()
    })
    await test.step('Then I am taken to the organisation details page, not the organisation list page', async () => {
      await organisationDetailsPage.assertOnOrganisationDetailsPage(organisationId.toString())
    })
  })

  test('As a Sponsor Contact associated to two or more organisations I can see the expected Organisation list Page Layouts - @se_248_ac2_multiple_organisations', async ({
    commonItemsPage,
    organisationsPage,
  }) => {
    const result = await seDatabaseReq(`
      SELECT id FROM UserOrganisation 
      WHERE userId = ${sponsorContactUserId} 
      AND isDeleted = 1 
      LIMIT 1;
    `)
    const userOrganisationId = result[0]?.id
    if (!userOrganisationId) {
      throw new Error('Expected a deleted UserOrganisation record for userID of 6, but none were found')
    }
    await seDatabaseReq(`
      UPDATE UserOrganisation 
      SET isDeleted = 0 
      WHERE id = ${userOrganisationId};
    `)
    await test.step('Given I have navigated to the Study details Page', async () => {
      await commonItemsPage.goto()
    })
    await test.step('When I click on the manage sponsor contacts icon', async () => {
      await commonItemsPage.manageAbridgedContactsIcon.click()
    })
    await test.step('Then I am taken to the organisation list page, not the organisation details page', async () => {
      await organisationsPage.assertOnOrganisationsPage()
    })
    await seDatabaseReq(`
      UPDATE UserOrganisation 
      SET isDeleted = 1 
      WHERE id = ${userOrganisationId};
    `)
  })
})
