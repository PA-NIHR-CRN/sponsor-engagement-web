import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'
import { RowDataPacket } from 'mysql2'

let expectedResponse: RowDataPacket[]
let randomOrganisationId: RowDataPacket[]

test.beforeAll('Setup Test', async () => {
  const randomOrganisationIdResponse = await seDatabaseReq(`
     SELECT organisationId FROM UserOrganisationInvitation
     JOIN UserOrganisation ON UserOrganisationInvitation.userOrganisationId = UserOrganisation.id
     WHERE UserOrganisationInvitation.isDeleted = 0 AND UserOrganisation.isDeleted = 0
     ORDER BY RAND()
     LIMIT 1;`)

  if (!randomOrganisationIdResponse) {
    throw new Error('No organisationId was returned from the database')
  }
  randomOrganisationId = randomOrganisationIdResponse[0]?.organisationId

  const response = await seDatabaseReq(`
    SELECT UserOrganisation.organisationId, UserOrganisationInvitation.statusId, UserOrganisation.userId, User.email
    FROM UserOrganisationInvitation
    JOIN UserOrganisation ON UserOrganisationInvitation.userOrganisationId = UserOrganisation.id
    JOIN User ON UserOrganisation.userId = User.id
    WHERE UserOrganisation.isDeleted = 0 
    AND UserOrganisationInvitation.isDeleted = 0 
    AND UserOrganisation.organisationId = ${randomOrganisationId}
    ORDER BY UserOrganisationInvitation.timestamp`)

  if (!response || response.length === 0) {
    throw new Error('No users returned from the database.')
  }
  expectedResponse = response
})

test.describe('Failed to deliver email tag validation for Organisation Details Page - @se_251', () => {
  test.use({ storageState: '.auth/contactManager.json' })
  test('As a Contact Manager I can see a failed to deliver tag when a sponsor contact invite has not been sent successfully on the Orgnisation Details Page - @se_251_ac1', async ({
    organisationDetailsPage,
  }) => {
    await test.step('Given I have navigated to the Organisation Details Page', async () => {
      await organisationDetailsPage.goto(expectedResponse[0].organisationId.toString())
    })
    await test.step('Then I am taken to the organisation details page', async () => {
      await organisationDetailsPage.assertOnOrganisationDetailsPage(expectedResponse[0].organisationId.toString())
    })
    await test.step('And it will contain a List of Contacts for that Organisation', async () => {
      await organisationDetailsPage.assertContactListDisplayed(true)
    })
    await test.step('And it will contain a List of Contacts for that Organisation', async () => {
      await organisationDetailsPage.assertContactListDisplayed(true)
    })
    await test.step('And each contact that has not received an invite email will have a Failed to deliver email tag', async () => {
      await organisationDetailsPage.assertContactFailedToDeliverTag(
        expectedResponse[0].email,
        expectedResponse[0].statusId
      )
    })
  })
})
