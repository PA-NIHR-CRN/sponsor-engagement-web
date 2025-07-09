import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'
import { RowDataPacket } from 'mysql2'

let expectedContactManagerDetails: RowDataPacket[]

test.beforeAll('Setup Test Users', async () => {
  const ContactManagerDetails = await seDatabaseReq(`
    SELECT User.email, UserRole.updatedAt FROM User
    INNER JOIN UserRole ON User.id = UserRole.userId
    WHERE UserRole.roleID = 2 AND UserRole.isDeleted = 0 AND User.isDeleted = 0
    ORDER BY User.email`)
  expectedContactManagerDetails = ContactManagerDetails
})

test.describe('Display Contact Manager Lst and Contact Manager page - @CRNCC_2630', () => {
  test.use({ storageState: '.auth/contactManager.json' })

  test('As a Contact Manager I can see the expected Contact Manager Details - @CRNCC_2630_ac1', async ({
    contactManagerPage,
  }) => {
    await test.step('Given I have navigated to the Contact Managers Page', async () => {
      await contactManagerPage.goto()
    })
    await test.step('When I am on the contact managers Page', async () => {
      await contactManagerPage.assertOnManageContactManagersPage()
    })
    await test.step(`Then it will have a Page Title`, async () => {
      await contactManagerPage.assertContactManagersPageTitle()
    })
  })

  test('As a Contact Manager I can see the Expected Existing Contact Managers - @CRNCC_2630_ac4', async ({
    contactManagerPage,
  }) => {
    await test.step('Given I have navigated to the Contact Managers Page', async () => {
      await contactManagerPage.goto()
    })
    await test.step('And I am on the contact Managers Page', async () => {
      await contactManagerPage.assertOnManageContactManagersPage()
    })
    await test.step(`When I View the section titled 'Add or remove Contact Managers'`, async () => {
      await contactManagerPage.assertAddRemoveSectionPresent()
    })
    await test.step('Then it will contain some Introductory Guidance Text', async () => {
      await contactManagerPage.assertAddRemoveGuidanceTxt()
    })
    await test.step('And it will contain a List of contacts Managers', async () => {
      await contactManagerPage.assertContactListHeadersDisplayed()
    })
    await test.step('And the expected Number of contacts managers are displayed', async () => {
      await contactManagerPage.assertTotalNumberOfContacts(`SELECT COUNT(DISTINCT UserRole.UserId) as count
        FROM UserRole
        WHERE UserRole.roleId = 2 AND UserRole.isDeleted = 0`)
    })
    await test.step('And each Contact displays the correct Email Address', async () => {
      await contactManagerPage.assertContactEmail(expectedContactManagerDetails)
    })
    await test.step('And each Contact displays the correct Date Added', async () => {
      await contactManagerPage.assertContactDateAdded(expectedContactManagerDetails)
    })
    await test.step('And each Contact displays an Option to Remove', async () => {
      await contactManagerPage.assertContactActions()
    })
  })
})
