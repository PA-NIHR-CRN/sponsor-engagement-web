import { test } from '../../../hooks/CustomFixtures'

test.describe('SE Page Structure and Navigation Smoke Tests - @se_1_structure', () => {
  test.only('As a User I Can Navigate to the Home Page', async ({ homePage }) => {
    await test.step('Given I have navigated to the HomePage', async () => {
      await homePage.goto()
    })
    await test.step('Then I should see the Home Page', async () => {
      await homePage.assertOnHomePage()
    })
  })
})
