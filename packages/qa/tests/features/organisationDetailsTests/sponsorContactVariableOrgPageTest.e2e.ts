import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'

const userId = 6
const organisationId = 9
const newOrganisationId = 1
let testUserOrganisationId: number

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
    const result = await seDatabaseReq(`SELECT MAX(id) + 1 AS newId FROM sponsorengagement.UserOrganisation;`)
    testUserOrganisationId = result[0].newId || 9999

    await seDatabaseReq(`
      INSERT INTO sponsorengagement.UserOrganisation 
      (id, userId, organisationId, createdById, updatedById, createdAt, updatedAt, isDeleted) 
      VALUES 
      (${testUserOrganisationId}, ${userId}, ${newOrganisationId}, 21208, 21208, '2023-12-04 16:55:12.920', '2023-12-04 16:55:12.920', 0);
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

    await seDatabaseReq(`
      UPDATE sponsorengagement.UserOrganisation 
      SET isDeleted = 1 
      WHERE id = ${testUserOrganisationId};
    `)
  })

  test.afterEach(async () => {
    await seDatabaseReq(`
      DELETE FROM sponsorengagement.UserOrganisation 
      WHERE id = ${testUserOrganisationId};
    `)
  })
})
