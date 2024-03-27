import { test } from '../../../hooks/CustomFixtures'

test.describe('View Download Study Data - @crncc_1946', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('As a Sponsor I see the Download Study Data section on the Study List page - @crncc_1946_ac2', async ({
    studiesPage,
    commonItemsPage,
  }) => {
    await test.step(`Given I have navigated to the Study List Page`, async () => {
      await studiesPage.goto()
      await studiesPage.assertOnStudiesPage()
    })
    await test.step(`When I view the section titled 'Download study data'`, async () => {
      await commonItemsPage.assertDownloadStudyDataPresent()
    })
    await test.step(`Then the expected Guidance Text is provided`, async () => {
      await commonItemsPage.assertDownloadStudyDataGuidanceText()
    })
    await test.step(`And I am provided with a Download button`, async () => {
      await commonItemsPage.assertDownloadStudyDataButtonPresent()
    })
  })
})
