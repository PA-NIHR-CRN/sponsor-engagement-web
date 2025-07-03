import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'

const testUserId = 24156
// should be last email in the list due to alphabetical order
const testUserEmail = 'zzzzsesponsorcontactmanagerCRNCC2630@test.id.nihr.ac.uk'
const invalidEmail = 'not.valid.com'

test.beforeAll('Setup Test Users', async () => {
  await seDatabaseReq(
    `UPDATE UserRole SET isDeleted = 1 WHERE UserRole.userId = ${testUserId} AND UserRole.roleId = 2;`
  )
})

test.describe('Add and Remove Contacts managers - @CRNCC_2630', () => {
  test.use({ storageState: '.auth/contactManager.json' })

  test('The Contact Managers Page Provides the Option to add New Contacts Managers - @CRNCC_2630_ac6', async ({
    contactManagerPage,
  }) => {
    await test.step('Given I have navigated to the Contact Managers Page', async () => {
      await contactManagerPage.goto()
    })
    await test.step('When I am on the Contact Managers Page', async () => {
      await contactManagerPage.assertOnManageContactManagersPage()
    })
    await test.step(`Then there is a Text Input Field Present`, async () => {
      await contactManagerPage.assertSearchFieldPresent()
    })
    await test.step(`And the Text Input Field is Labelled Email Address`, async () => {
      await contactManagerPage.assertSearchLabelPresent()
    })
    await test.step('And there is a `Send invite button` alongside', async () => {
      await contactManagerPage.assertSearchButtonPresent()
    })
  })

  test('The Email Address Input Validates the Email Address provided before Sending the Invite - @CRNCC_2630_ac7_validation', async ({
    contactManagerPage,
  }) => {
    await test.step('Given I have navigated to the Contact Managers Page', async () => {
      await contactManagerPage.goto()
    })
    await test.step('And I am on the Contact Managers Page', async () => {
      await contactManagerPage.assertOnManageContactManagersPage()
    })
    await test.step(`When I enter a invalid email address in the Text Field`, async () => {
      await contactManagerPage.searchInput.fill(invalidEmail)
    })
    await test.step(`And I click Send invite`, async () => {
      await contactManagerPage.searchButton.click()
    })
    await test.step('Then an `Enter a valid email address` Validation Error appears in a Summary box and above the Text Field', async () => {
      await contactManagerPage.assertValidationErrorsPresent()
    })
    await test.step('And clicking the Summary Box Error link', async () => {
      await contactManagerPage.errorSummaryAlertBoxLink.click()
    })
    await test.step('Then takes me to Email Input Text Field, highlighting it', async () => {
      await contactManagerPage.assertEmailInputFocused()
    })
  })

  test('As a Contact Manager I can add a New Contact Manager - @CRNCC_2630_ac6', async ({ contactManagerPage }) => {
    await test.step('Given I have navigated to the Contact Managers Page', async () => {
      await contactManagerPage.goto()
    })
    await test.step('And I am on the Contact Managers Page', async () => {
      await contactManagerPage.assertOnManageContactManagersPage()
    })
    await test.step(`When I enter a valid email address in the Text Field`, async () => {
      await contactManagerPage.searchInput.fill(testUserEmail)
    })
    await test.step(`And I click Send invite`, async () => {
      await contactManagerPage.searchButton.click()
    })
    await test.step('Then I will see a Success Confirmation Message on the Page', async () => {
      await contactManagerPage.assertOnManageContactManagersWithSuccess()
    })
    await test.step('And the new Contact will be added to the Top of the Contacts List', async () => {
      await contactManagerPage.assertNewEmailAdded(testUserEmail, true)
    })
    await test.step('And the new Contact shows the Date Added was todays date', async () => {
      await contactManagerPage.assertTodaysDateAdded()
    })
  })

  // The test rely on a previous test running before them
  test('As a Contact Manager I can Cancel the Remove Contact Action - @CRNCC_2630_ac5', async ({
    contactManagerPage,
    removeContactManagersPage,
  }) => {
    await test.step('Given I have navigated to the Contact Managers Page', async () => {
      await contactManagerPage.goto()
      await contactManagerPage.assertOnManageContactManagersPage()
    })
    await test.step(`And I View the list of contact Managers`, async () => {
      await contactManagerPage.assertNewEmailAdded(testUserEmail, true)
    })
    await test.step(`When I click the Remove Option`, async () => {
      await contactManagerPage.contactManagersListRow.last().locator('td').nth(2).locator('a').click()
    })
    await test.step(`Then I am taken to the Remove Contact Manager Screen`, async () => {
      const expectedUserId = await removeContactManagersPage.getUserId(`SELECT id FROM User WHERE Id = ${testUserId};`)
      await removeContactManagersPage.assertOnremoveContactManagersPage(expectedUserId)
    })
    await test.step('When I click the `Cancel` button', async () => {
      await removeContactManagersPage.cancelButton.click()
    })
    await test.step(`Then I am taken to back to the Contact Managers Screen`, async () => {
      await contactManagerPage.assertOnManageContactManagersPage()
    })
    await test.step(`And the Contact Remains on the Contact Managers List`, async () => {
      await contactManagerPage.assertNewEmailAdded(testUserEmail, true)
    })
  })

  test('As a Contact Manager I can Remove a Contact Manager - @CRNCC_2630_ac5', async ({
    contactManagerPage,
    removeContactManagersPage,
  }) => {
    await test.step('Given I have navigated to the Contact Managers Page', async () => {
      await contactManagerPage.goto()
      await contactManagerPage.assertOnManageContactManagersPage()
    })
    await test.step(`And I View the Most Recent Contact on the Contacts List`, async () => {
      await contactManagerPage.assertNewEmailAdded(testUserEmail, true)
    })
    await test.step(`When I click the Remove Option`, async () => {
      await contactManagerPage.contactManagersListRow.last().locator('td').nth(2).locator('a').click()
    })
    await test.step(`Then I am taken to the Remove Contact Screen`, async () => {
      const expectedUserId = await removeContactManagersPage.getUserId(`SELECT id FROM User WHERE Id = ${testUserId};`)
      await removeContactManagersPage.assertOnremoveContactManagersPage(expectedUserId)
    })
    await test.step('When I click the `Yes Im sure - remove this contact` button', async () => {
      await removeContactManagersPage.removeButton.click()
    })
    await test.step(`Then I am taken to back to the Contact Managers Screen`, async () => {
      await contactManagerPage.assertOnManageContactManagersWithRemove()
    })
    await test.step(`And the Contact has been removed from the Contact List`, async () => {
      await contactManagerPage.assertNewEmailAdded(testUserEmail, false)
    })
  })
})
