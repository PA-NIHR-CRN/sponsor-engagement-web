import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'
import { RowDataPacket } from 'mysql2'

let response: RowDataPacket[]

test.beforeAll('Setup Test', async () => {
  response = await seDatabaseReq(`
    SELECT UserOrganisation.organisationId, User.email, UserOrganisationInvitation.statusId FROM UserOrganisationInvitation
    JOIN UserOrganisation ON UserOrganisation.id = UserOrganisationInvitation.userOrganisationId
    JOIN User ON User.id = UserOrganisation.userId
    WHERE UserOrganisationInvitation.isDeleted = 0 AND UserOrganisation.isDeleted = 0
    AND UserOrganisation.organisationId = (select uo.organisationId FROM UserOrganisationInvitation uoi
    JOIN UserOrganisation uo ON uo.id = uoi.userOrganisationId
    JOIN Organisation o ON o.id = uo.organisationId
    WHERE uoi.statusId = 3 AND uoi.isDeleted = 0 AND uo.isDeleted = 0
    GROUP BY organisationId LIMIT 1)
    ORDER BY UserOrganisationInvitation.timestamp DESC;
  `)
  if (response.length === 0) {
    throw new Error(
      'No invitations emails returned from the database for an organisation with at least one failed invite email.'
    )
  }
})

test.describe('Failed to deliver email tag validation for Organisation Details Page - @se_251', () => {
  test.use({ storageState: '.auth/contactManager.json' })
  test('As a Contact Manager I can see a failed to deliver tag when a sponsor contact invite has not been sent successfully on the Orgnisation Details Page - @se_251_ac1', async ({
    organisationDetailsPage,
  }) => {
    await test.step('Given I have navigated to the organisation Details Page', async () => {
      await organisationDetailsPage.goto(response[0].organisationId.toString())
    })
    await test.step('Then I am taken to the organisation details page', async () => {
      await organisationDetailsPage.assertOnOrganisationDetailsPage(response[0].organisationId.toString())
    })
    await test.step('And it will contain a List of Contacts for that organisation', async () => {
      await organisationDetailsPage.assertContactListDisplayed(true)
    })
    await test.step('And each contact that has not received an invite email will have a Failed to deliver email tag', async () => {
      await organisationDetailsPage.assertContactFailedToDeliverTag(response)
    })
  })
})
