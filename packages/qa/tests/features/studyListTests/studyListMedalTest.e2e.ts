import { test } from '../../../hooks/CustomFixtures'
const firstMedalStudySearchTerm = '3808'

test.describe('Study List First Medal Display - @SE_332', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })
  test('As a Sponsor Contact I can see the European first label on the Studies page - @SE_332_ac1', async ({
    studiesPage,
  }) => {
    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
    })
    await test.step('When I am on the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })
    await test.step('And I search for a study with a European first medal', async () => {
      await studiesPage.enterSearchPhrase(firstMedalStudySearchTerm)
    })
    await test.step('Then I can see the European first label', async () => {
      await studiesPage.assertEuropeanFirstLabelVisible()
    })
  })
})
