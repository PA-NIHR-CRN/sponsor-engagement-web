import { test } from '../../../hooks/CustomFixtures'
import { cpmsDatabaseReq } from '../../../utils/dbConfig'

test.describe('Log in as a Sponsor Contact - @se_21', () => {
  test('As a Sponsor Contact upon Login I am taken to the Studies Page - @se_21_login_sponsor_contact', async ({
    commonItemsPage,
    loginPage,
    studiesPage,
  }) => {
    await test.step('Given I have navigated to the Home Page', async () => {
      await commonItemsPage.goto()
    })
    await test.step('And I have been be re-directed to the Login Page', async () => {
      await loginPage.assertOnLoginPage()
    })
    await test.step('When I successfully login as a Sponsor Contact', async () => {
      await loginPage.loginWithUserCreds('Sponsor Contact')
    })
    await test.step('Then I am taken to the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })
    await test.step('And I have access to the Study List', async () => {
      await commonItemsPage.assertSponsorContactPermissions(true)
    })
    await test.step('And I do not have access to the Manage Contacts Page', async () => {
      await commonItemsPage.assertManageContactsPermissions(false)
    })
  })

  test('As a Sponsor Contact and Contact Manager upon Login I am taken to the Studies Page - @se_21_login_sponsor_contact_manager', async ({
    commonItemsPage,
    loginPage,
    studiesPage,
  }) => {
    await test.step('Given I have navigated to the Home Page', async () => {
      console.log((await cpmsDatabaseReq()).recordset)
      await commonItemsPage.goto()
    })
    await test.step('And I have been be re-directed to the Login Page', async () => {
      await loginPage.assertOnLoginPage()
    })
    await test.step('When I successfully login as a Sponsor Contact & Contact Manager', async () => {
      await loginPage.loginWithUserCreds('Sponsor Contact Manager')
    })
    await test.step('Then I am taken to the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })
    await test.step('And I have access to the Study List', async () => {
      await commonItemsPage.assertSponsorContactPermissions(true)
    })
    await test.step('And I have access to the Manage Contacts Page', async () => {
      await commonItemsPage.assertManageContactsPermissions(true)
    })
  })

  test('As a Contact Manager upon Login I am taken to the Mange Contacts Page - @se_21_login_contact_manager', async ({
    commonItemsPage,
    loginPage,
    contactsPage,
  }) => {
    await test.step('Given I have navigated to the Home Page', async () => {
      await commonItemsPage.goto()
    })
    await test.step('And I have been be re-directed to the Login Page', async () => {
      await loginPage.assertOnLoginPage()
    })
    await test.step('When I successfully login as a Contact Manager', async () => {
      await loginPage.loginWithUserCreds('Contact Manager')
    })
    await test.step('Then I am taken to the Manage Contacts Page', async () => {
      await contactsPage.assertOnContactsPage()
    })
    await test.step('And I do not have access to the Studies Page', async () => {
      await commonItemsPage.homeIcon.click()
      await contactsPage.assertOnContactsPage()
    })
  })

  test('As a user with no Sponsor Engagement role, upon Login I am shown an error message - @se_21_login_no_account', async ({
    commonItemsPage,
    loginPage,
  }) => {
    await test.step('Given I have navigated to the Home Page', async () => {
      await commonItemsPage.goto()
    })
    await test.step('And I have been be re-directed to the Login Page', async () => {
      await loginPage.assertOnLoginPage()
    })
    await test.step('When I successfully login as a user with a Sponsor Engagement Role', async () => {
      await loginPage.loginWithUserCreds('No Local Account')
    })
    await test.step('Then the Home Page has an Error Message with Contact Info', async () => {
      await commonItemsPage.assertOnHomePageNoAccount()
    })
    await test.step('And I do not have access to the Study List', async () => {
      await commonItemsPage.assertSponsorContactPermissions(false)
    })
    await test.step('And I do not have access to the Manage Contacts Page', async () => {
      await commonItemsPage.assertManageContactsPermissions(false)
    })
  })
})
