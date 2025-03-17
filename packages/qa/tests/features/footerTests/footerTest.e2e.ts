import { test } from '../../../hooks/CustomFixtures'

test.describe('Footer validation - @se_255', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('As a user I can see and use the Footer - @se_255_Footer_validation', async ({
    commonItemsPage,
    studiesPage,
  }) => {
    await test.step('When I am taken to the Studies Page', async () => {
      await studiesPage.goto()
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
