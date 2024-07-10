import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'
import { RowDataPacket } from 'mysql2'

const sponsorContactTestUserId = 6
const contactManagerTestUserId = 7
let currentSponsorLastLogin: RowDataPacket[]
let formattedCurrentSponsorLastLogin: string
let currentManagerLastLogin: RowDataPacket[]
let formattedCurrentManagerLastLogin: string

test.beforeAll('Setup Tests', async () => {
  currentSponsorLastLogin = await seDatabaseReq(`SELECT lastLogin FROM User WHERE id = ${sponsorContactTestUserId};`)
  currentManagerLastLogin = await seDatabaseReq(`SELECT lastLogin FROM User WHERE id = ${contactManagerTestUserId};`)
})

test.describe('Capture Last Login Date - @se_146', () => {
  test('When I login as a Sponsor Contact my Last Login Date is updated - @se_146_lastLogin_sponsor_contact', async ({
    commonItemsPage,
    signedOutPage,
    studiesPage,
    loginPage,
  }) => {
    let updatedLastLogin: RowDataPacket[]
    let formattedUpdatedLastLogin: string = ''
    await test.step('Given I am on the Signed Out page as an unauthenticated user', async () => {
      formattedCurrentSponsorLastLogin = await loginPage.getLastLoginFormattedDate(currentSponsorLastLogin)
      await commonItemsPage.goto()
      await signedOutPage.assertOnSignedOutPage()
    })
    await test.step(`And the Sponsor Contact User has a Current Last Login date of '${formattedCurrentSponsorLastLogin}'`, async () => {
      commonItemsPage.assertCogIconPresent(false)
    })
    await test.step('When I successfully login as a Sponsor Contact', async () => {
      await signedOutPage.btnSignIn.click()
      await loginPage.assertOnLoginPage()
      await loginPage.loginWithUserCreds('Sponsor Contact')
      await studiesPage.assertOnStudiesPage()
      updatedLastLogin = await seDatabaseReq(`SELECT lastLogin FROM User WHERE id = ${sponsorContactTestUserId};`)
      formattedUpdatedLastLogin = await loginPage.getLastLoginFormattedDate(updatedLastLogin)
    })
    await test.step(`Then the Sponsor Contact User now has an Updated Last Login date of '${formattedUpdatedLastLogin}'`, async () => {
      commonItemsPage.assertCogIconPresent(true)
    })
    await test.step(`And the Updated Last Login Value is more recent than the Previous Last Login Value`, async () => {
      loginPage.assertLastLoginUpdated(currentSponsorLastLogin, updatedLastLogin)
    })
  })

  test('When I login as a Contact Manager my Last Login Date is updated - @se_146_lastLogin_contact_manager', async ({
    commonItemsPage,
    signedOutPage,
    organisationsPage,
    loginPage,
  }) => {
    let updatedLastLogin: RowDataPacket[]
    let formattedUpdatedLastLogin: string = ''
    await test.step('Given I am on the Signed Out page as an unauthenticated user', async () => {
      formattedCurrentManagerLastLogin = await loginPage.getLastLoginFormattedDate(currentManagerLastLogin)
      await commonItemsPage.goto()
      await signedOutPage.assertOnSignedOutPage()
    })
    await test.step(`And the Contact Manager User has a Current Last Login date of '${formattedCurrentManagerLastLogin}'`, async () => {
      commonItemsPage.assertCogIconPresent(false)
    })
    await test.step('When I successfully login as a Contact Manager', async () => {
      await signedOutPage.btnSignIn.click()
      await loginPage.assertOnLoginPage()
      await loginPage.loginWithUserCreds('Contact Manager')
      await organisationsPage.assertOnOrganisationsPage()
      updatedLastLogin = await seDatabaseReq(`SELECT lastLogin FROM User WHERE id = ${contactManagerTestUserId};`)
      formattedUpdatedLastLogin = await loginPage.getLastLoginFormattedDate(updatedLastLogin)
    })
    await test.step(`Then the Contact Manager User now has an Updated Last Login date of '${formattedUpdatedLastLogin}'`, async () => {
      commonItemsPage.assertCogIconPresent(true)
    })
    await test.step(`And the Updated Last Login Value is more recent than the Previous Last Login Value`, async () => {
      loginPage.assertLastLoginUpdated(currentManagerLastLogin, updatedLastLogin)
    })
  })
})
