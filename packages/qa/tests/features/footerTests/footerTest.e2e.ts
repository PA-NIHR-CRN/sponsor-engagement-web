import { test } from '../../../hooks/CustomFixtures'

test.describe('Footer validation - @se_255', () => {
  test('As a user I can see and use the Footer - @se_255_Footer_validation', async ({
    commonItemsPage,
    signedOutPage,
    loginPage,
    studiesPage,
  }) => {
    await test.step('Given I have navigated to the Home Page and succesfully sign in as a Sponsor Contact', async () => {
      await commonItemsPage.goto()
      await signedOutPage.assertOnSignedOutPage()
      await signedOutPage.btnSignIn.click()
      await loginPage.assertOnLoginPage()
      await loginPage.loginWithUserCreds('Sponsor Contact')
    })
    await test.step('When I am taken to the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })
    /*
    await test.step('Then I am able to see the Footer and its links on the Studies Page', async () => {
      commonItemsPage.assertFooterPresent()
      commonItemsPage.assertFooterLinksPresent()
    })
    Once the footer has been created then un-comment
    */
    await test.step('When I click the cog Icon and select the logout option', async () => {
      await commonItemsPage.cogIcon.click()
      await commonItemsPage.assertLogoutOptionVisible()
      await commonItemsPage.logoutOption.click()
    })
    /*
    await test.step('Then I am able to see the Footer and its links while logged out', async () => {
      commonItemsPage.assertFooterPresent()
      commonItemsPage.assertFooterLinksPresent()
    })
    */
  })
})
