import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'
import { RowDataPacket } from 'mysql2'

let response: RowDataPacket[]
let startingOrgId = 0
let startingUserId = 0
let startingStatusId = 0

test.beforeAll('Setup Test', async () => {
  const response = await seDatabaseReq(`
    SELECT UserOrganisation.organisationId, UserOrganisationInvitation.statusId, UserOrganisation.userId
    FROM UserOrganisationInvitation
    JOIN UserOrganisation ON UserOrganisationInvitation.userOrganisationId = UserOrganisation.id
    WHERE UserOrganisation.isDeleted = 0
    ORDER BY RAND();
  `)

  startingOrgId = response[0].organisationId
  startingStatusId = response[0].statusId
  startingUserId = response[0].userId
})

test.describe('Failed to deliver email tag validation for Organisation Details Page - @se_251', () => {
  test.use({ storageState: '.auth/contactManager.json' })
  test('As a Contact Manager I can see a failed to deliver tag when a sponsor contact invite has not been sent successfully on the Orgnisation Details Page - @se_251_ac1', async ({
    organisationDetailsPage,
  }) => {
    await test.step('Given I have navigated to the Organisation Details Page', async () => {
      await organisationDetailsPage.goto(startingOrgId.toString())
    })
    await test.step('Then I am taken to the organisation details page', async () => {
      await organisationDetailsPage.assertOnOrganisationDetailsPage(startingOrgId.toString())
    })
    await test.step('And it will contain a List of Contacts for that Organisation', async () => {
      await organisationDetailsPage.assertContactListDisplayed(true)
    })
    await test.step('And it will contain a List of Contacts for that Organisation', async () => {
      await organisationDetailsPage.assertContactListDisplayed(true)
    })
    if (startingStatusId === 3) {
      await test.step('And each contact that has not received an invite email will have a Failed to deliver email tag', async () => {
        await organisationDetailsPage.assertContactFailedToDeliverTag([{ userId: startingUserId } as RowDataPacket])
      })
    } else if (startingStatusId === 1 || startingStatusId === 2) {
      await test.step('And each contact that has received an invite email or it is still pending will not have a Failed to deliver email tag', async () => {
        await organisationDetailsPage.assertContactSuccessfulInvite([{ userId: startingUserId } as RowDataPacket])
      })
    }
  })
})
