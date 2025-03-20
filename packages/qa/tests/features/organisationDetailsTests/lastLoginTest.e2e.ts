import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'
import { RowDataPacket } from 'mysql2'

const orgIdWithContacts = 2
let expectedContactDetails: RowDataPacket[]

test.beforeAll('Setup Test Users', async () => {
  const contactDetails = await seDatabaseReq(`SELECT User.lastLogin FROM UserOrganisation
      INNER JOIN User ON User.id = UserOrganisation.userId
      WHERE UserOrganisation.organisationId = ${orgIdWithContacts} AND UserOrganisation.isDeleted = 0
      ORDER BY UserOrganisation.updatedAt desc;`)
  expectedContactDetails = contactDetails
})

test.describe('Last login column validation for Orgnasiation Details Page - @se_250', () => {
  test.use({ storageState: '.auth/contactManager.json' })
  test('As a Contact Manager I can see the last login column on the Orgnisation Details Page - @se_250_ac1', async ({
    organisationDetailsPage,
  }) => {
    await test.step('Given I have navigated to the Organisation Details Page', async () => {
      await organisationDetailsPage.goto(orgIdWithContacts.toString())
    })
    await test.step('Then I am taken to the orgnasiation details page', async () => {
      await organisationDetailsPage.assertOnOrganisationDetailsPage(orgIdWithContacts.toString())
    })
    await test.step('And it will contain a List of Contacts for that Organisation', async () => {
      await organisationDetailsPage.assertContactListDisplayed(true)
    })
    await test.step('And each contact displays the correct date of last login', async () => {
      await organisationDetailsPage.assertContactDateOfLastLogin(expectedContactDetails)
    })
  })
})
