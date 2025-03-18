import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'

const testUserId = 8
const testUserEmail = 'sesponsorcontactmanager@test.id.nihr.ac.uk'
const orgIdWithContacts = 1072
const invalidEmail = 'not.valid.com'

test.beforeAll('Setup Test Users', async () => {
  await seDatabaseReq(
    `DELETE FROM UserOrganisation WHERE UserOrganisation.userId = ${testUserId} AND organisationId = ${orgIdWithContacts};`
  )
})

test.describe('Add and Remove Contacts for a Sponsor Organisation - @addRemoveContact', () => {
  test.use({ storageState: '.auth/contactManager.json' })

  test('The Organisation Details Page Provides the Option to add New Sponsor Contacts to the Organisation - @se_20 @se_20_options', async ({
    organisationDetailsPage,
  }) => {
    await test.step('Given I have navigated to the Organisation Details Page', async () => {
      await organisationDetailsPage.goto(orgIdWithContacts.toString())
    })
    await test.step('When I am on the Organisation Details Page', async () => {
      await organisationDetailsPage.assertOnOrganisationDetailsPage(orgIdWithContacts.toString())
    })
    await test.step(`Then there is a Text Input Field Present`, async () => {
      await organisationDetailsPage.assertSearchFieldPresent()
    })
    await test.step(`And the Text Input Field is Labelled Email Address`, async () => {
      await organisationDetailsPage.assertSearchLabelPresent()
    })
    await test.step('And there is a `Send invite button` alongside', async () => {
      await organisationDetailsPage.assertSearchButtonPresent()
    })
  })

  test('The Email Address Input Validates the Email Address provided before Sending the Invite - @se_20 @se_20_ac1_validation', async ({
    organisationDetailsPage,
  }) => {
    await test.step('Given I have navigated to the Organisation Details Page', async () => {
      await organisationDetailsPage.goto(orgIdWithContacts.toString())
    })
    await test.step('And I am on the Organisation Details Page', async () => {
      await organisationDetailsPage.assertOnOrganisationDetailsPage(orgIdWithContacts.toString())
    })
    await test.step('And I am on the Organisation Details Page', async () => {
      await organisationDetailsPage.assertOnOrganisationDetailsPage(orgIdWithContacts.toString())
    })
    await test.step(`When I enter a invalid email address in the Text Field`, async () => {
      await organisationDetailsPage.searchInput.fill(invalidEmail)
    })
    await test.step(`And I click Send invite`, async () => {
      await organisationDetailsPage.searchButton.click()
    })
    await test.step('Then an `Enter a valid email address` Validation Error appears in a Summary box and above the Text Field', async () => {
      await organisationDetailsPage.assertValidationErrorsPresent()
    })
    await test.step('And clicking the Summary Box Error link', async () => {
      await organisationDetailsPage.errorSummaryAlertBoxLink.click()
    })
    await test.step('Then takes me to Email Input Text Field, highlighting it', async () => {
      await organisationDetailsPage.assertEmailInputFocused()
    })
  })

  test('As a Contact Manager I can add a New Sponsor Contact to an Organisation - @se_20 @se_20_ac1_success se_62_addRemoveCombo', async ({
    organisationDetailsPage,
  }) => {
    await test.step('Given I have navigated to the Organisation Details Page', async () => {
      await organisationDetailsPage.goto(orgIdWithContacts.toString())
    })
    await test.step('And I am on the Organisation Details Page', async () => {
      await organisationDetailsPage.assertOnOrganisationDetailsPage(orgIdWithContacts.toString())
    })
    await test.step(`When I enter a valid email address in the Text Field`, async () => {
      await organisationDetailsPage.searchInput.fill(testUserEmail)
    })
    await test.step(`And I click Send invite`, async () => {
      await organisationDetailsPage.searchButton.click()
    })
    await test.step('Then I will see a Success Confirmation Message on the Page', async () => {
      await organisationDetailsPage.assertOnOrganisationDetailsPageWithSuccess(orgIdWithContacts.toString())
    })
    await test.step('And the new Contact will be added to the Top of the Contacts List', async () => {
      await organisationDetailsPage.assertNewEmailAdded(testUserEmail, true)
    })
    await test.step('And the new Contact shows the Date Added was todays date', async () => {
      await organisationDetailsPage.assertTodaysDateAdded()
    })
  })

  //The SE-62 tests rely on a previous test running before them @se_20_ac1_success - use tag @se_62_addRemoveCombo to test if needed
  test('As a Contact Manager I can Cancel the Remove Contact Action - @se_62_addRemoveCombo', async ({
    organisationDetailsPage,
    removeContactPage,
  }) => {
    await test.step('Given I have navigated to the Organisation Details Page', async () => {
      await organisationDetailsPage.goto(orgIdWithContacts.toString())
      await organisationDetailsPage.assertOnOrganisationDetailsPage(orgIdWithContacts.toString())
    })
    await test.step(`And I View the Most Recent Contact on the Contacts List`, async () => {
      await organisationDetailsPage.assertNewEmailAdded(testUserEmail, true)
    })
    await test.step(`When I click the Remove Option`, async () => {
      await organisationDetailsPage.contactListRow.nth(0).locator('td').nth(3).locator('a').click()
    })
    await test.step(`Then I am taken to the Remove Contact Screen`, async () => {
      const expectedUserOrgId = await removeContactPage.getUserOrgId(
        `SELECT id FROM UserOrganisation WHERE userId = ${testUserId} AND organisationId = ${orgIdWithContacts};`
      )
      await removeContactPage.assertOnRemoveContactPage(expectedUserOrgId)
    })
    await test.step('When I click the `Cancel` button', async () => {
      await removeContactPage.cancelButton.click()
    })
    await test.step(`Then I am taken to back to the Org Details Screen`, async () => {
      await organisationDetailsPage.assertOnOrganisationDetailsPage(orgIdWithContacts.toString())
    })
    await test.step(`And the Contact Remains on the Contact List`, async () => {
      await organisationDetailsPage.assertNewEmailAdded(testUserEmail, true)
    })
  })

  test('As a Contact Manager I can Remove a Contact From an Organisation - @se_62_addRemoveCombo', async ({
    organisationDetailsPage,
    removeContactPage,
  }) => {
    await test.step('Given I have navigated to the Organisation Details Page', async () => {
      await organisationDetailsPage.goto(orgIdWithContacts.toString())
      await organisationDetailsPage.assertOnOrganisationDetailsPage(orgIdWithContacts.toString())
    })
    await test.step(`And I View the Most Recent Contact on the Contacts List`, async () => {
      await organisationDetailsPage.assertNewEmailAdded(testUserEmail, true)
    })
    await test.step(`When I click the Remove Option`, async () => {
      await organisationDetailsPage.contactListRow.nth(0).locator('td').nth(3).locator('a').click()
    })
    await test.step(`Then I am taken to the Remove Contact Screen`, async () => {
      const expectedUserOrgId = await removeContactPage.getUserOrgId(
        `SELECT id FROM UserOrganisation WHERE userId = ${testUserId} AND organisationId = ${orgIdWithContacts};`
      )
      await removeContactPage.assertOnRemoveContactPage(expectedUserOrgId)
    })
    await test.step('When I click the `Yes Im sure - remove this contact` button', async () => {
      await removeContactPage.removeButton.click()
    })
    await test.step(`Then I am taken to back to the Org Details Screen`, async () => {
      await organisationDetailsPage.assertOnOrganisationDetailsPageWithRemove(orgIdWithContacts.toString())
    })
    await test.step(`And the Contact has been removed from the Contact List`, async () => {
      await organisationDetailsPage.assertNewEmailAdded(testUserEmail, false)
    })
  })
})
