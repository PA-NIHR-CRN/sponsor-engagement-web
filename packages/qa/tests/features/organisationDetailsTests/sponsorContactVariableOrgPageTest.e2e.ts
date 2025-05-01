import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'

const organisationId = 9

test.describe('Sponsor Organisation Details Page for Sponsor Contacts - @se_248', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('As a Sponsor Contact associated to one organisation I can see the expected Organisation details Page Layouts - @se_248_ac1_one_organisation', async ({
    commonItemsPage,
    organisationDetailsPage,
  }) => {
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
})

test.describe('Sponsor Organisation List Page for Sponsor Contacts - @se_248', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test.beforeEach(async () => {
    await seDatabaseReq(`
      UPDATE sponsorengagement.UserOrganisation 
      SET isDeleted = 0 
      WHERE id = 3311;
    `)
  })

  test('As a Sponsor Contact associated to two or more organisations I can see the expected Organisation list Page Layouts - @se_248_ac2_multiple_organisations', async ({
    commonItemsPage,
    organisationsPage,
  }) => {
    await test.step('Given I have navigated to the Study details Page', async () => {
      await commonItemsPage.goto()
    })
    await test.step('When I click on the manage sponsor contacts icon', async () => {
      await commonItemsPage.manageAbridgedContactsIcon.click()
    })
    await test.step('Then I am taken to the organisation list page, not the organisation details page', async () => {
      await organisationsPage.assertOnOrganisationsPage()
    })
  })

  test.afterEach(async () => {
    await seDatabaseReq(`
      UPDATE sponsorengagement.UserOrganisation 
      SET isDeleted = 1 
      WHERE id = 3311;
    `)
  })
})
