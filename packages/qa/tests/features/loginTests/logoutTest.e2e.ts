import { test } from '../../../hooks/CustomFixtures'

test.describe('Logout as a Sponsor Contact - @se_74', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('As an authenticated Sponsor Contact I am able to Logout of the SE Tool - @se_74_logout_sponsor_contact', async ({
    commonItemsPage,
    studiesPage,
    signedOutPage,
  }) => {
    await test.step('Given I have navigated to the Studies Page as sesponsorcontact@test.id.nihr.ac.uk', async () => {
      await studiesPage.goto()
      await studiesPage.assertOnStudiesPage()
    })
    await test.step('And there is a Cog Icon next to my Username in the Page Banner', async () => {
      await commonItemsPage.assertUsernamePresent(true, 'sesponsorcontact@test.id.nihr.ac.uk')
      await commonItemsPage.assertCogIconPresent(true)
    })
    await test.step('And clicking the Cog Icon displays a `Logout` option', async () => {
      await commonItemsPage.cogIcon.click()
      await commonItemsPage.assertLogoutOptionVisible()
    })
    await test.step('When I click the `Logout` option', async () => {
      await commonItemsPage.logoutOption.click()
    })
    await test.step('Then I am taken to the Signed Out Page', async () => {
      await signedOutPage.assertOnSignedOutPage()
    })
    await test.step('And the Cog icon and my Username no longer appear in the Page Banner', async () => {
      await commonItemsPage.assertUsernamePresent(false, 'sesponsorcontact@test.id.nihr.ac.uk')
      await commonItemsPage.assertCogIconPresent(false)
    })
  })
})

test.describe('Logout as a Contact Manager - @se_74', () => {
  test.use({ storageState: '.auth/contactManager.json' })

  test('As an authenticated Contact Manager I am able to Logout of the SE Tool - @se_74_logout_contact_manager', async ({
    commonItemsPage,
    organisationsPage,
    signedOutPage,
  }) => {
    await test.step('Given I have navigated to the Organisation Page as secontactmanager@test.id.nihr.ac.uk', async () => {
      await organisationsPage.goto()
      await organisationsPage.assertOnOrganisationsPage()
    })
    await test.step('And there is a Cog Icon next to my Username in the Page Banner', async () => {
      await commonItemsPage.assertUsernamePresent(true, 'secontactmanager@test.id.nihr.ac.uk')
      await commonItemsPage.assertCogIconPresent(true)
    })
    await test.step('And clicking the Cog Icon displays a `Logout` option', async () => {
      await commonItemsPage.cogIcon.click()
      await commonItemsPage.assertLogoutOptionVisible()
    })
    await test.step('When I click the `Logout` option', async () => {
      await commonItemsPage.logoutOption.click()
    })
    await test.step('Then I am taken to the Signed Out Page', async () => {
      await signedOutPage.assertOnSignedOutPage()
    })
    await test.step('And the Cog icon and my Username no longer appear in the Page Banner', async () => {
      await commonItemsPage.assertUsernamePresent(false, 'secontactmanager@test.id.nihr.ac.uk')
      await commonItemsPage.assertCogIconPresent(false)
    })
  })
})
