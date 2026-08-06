import { test, expect } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'

const testUserId = 6
const startingOrgId = 12

test.describe('Mini dashboard Logic - @se_316', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('As a Sponsor Contact I can see a mini dashboard for a study that is In Setup - @Se_316_AC1', async ({
    studiesPage,
    studyDetailsPage,
  }) => {
    await seDatabaseReq(
      `UPDATE UserOrganisation SET organisationId = ${startingOrgId} WHERE userId = ${testUserId} AND isDeleted = 0`
    )
    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
    })

    await test.step('When I am on the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })

    await test.step('And I Filter for studies that are in set up', async () => {
      await studiesPage.filterByStatusInSetup()
    })

    await test.step(`When I click the View Study button of any Study on the Study List`, async () => {
      await studiesPage.viewStudyButton.nth(0).click()
    })

    await test.step(`Then I am taken to the Details page`, async () => {
      await studiesPage.viewStudyButton.nth(0).click()
      await expect(studyDetailsPage.pageTitle).toBeVisible()
    })

    await test.step('Then I should see the first box in the dashboard to say Study Status: In Set Up', async () => {
      await studyDetailsPage.assertMiniDashboardTitle('Study Status')
      await studyDetailsPage.assertMiniDashboardText('In setup')
    })

    await test.step('And the second box to have the planned UK target', async () => {
      await studyDetailsPage.assertMiniDashboardTitle('Planned UK target')
      await studyDetailsPage.assertPlannedUkTargetMatchesTableValue()
    })

    await test.step('And the third box to have the Planned Open to Recruitment Date', async () => {
      await studyDetailsPage.assertMiniDashboardTitle('Planned open to recruitment date')
      await studyDetailsPage.assertPlannedOpenDateMatchesTableValue()
    })
  })

  test('As a Sponsor Contact I can see a mini dashboard for a study that has a status of Open - @Se_316_AC1', async ({
    studiesPage,
    studyDetailsPage,
  }) => {
    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
    })

    await test.step('When I am on the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })

    await test.step('And I Filter for studies that are open', async () => {
      await studiesPage.filterByStatusOpen()
    })

    await test.step(`When I click the View Study button of any Study on the Study List`, async () => {
      await studiesPage.viewStudyButton.nth(0).click()
    })

    await test.step(`Then I am taken to the Details page`, async () => {
      await studiesPage.viewStudyButton.nth(0).click()
      await expect(studyDetailsPage.pageTitle).toBeVisible()
    })

    await test.step('Then I should see the first box in the dashboard to say Study Status: Open', async () => {
      await studyDetailsPage.assertMiniDashboardTitle('Study Status')
      await studyDetailsPage.assertMiniDashboardText('Open')
    })

    await test.step('And the second box to have the current Recruitment Numbers', async () => {
      await studyDetailsPage.assertMiniDashboardTitle('Recruitment numbers')
      await studyDetailsPage.assertRecruitmentNumbersMatchesTableValues()
    })

    await test.step('And the third box to have the Planned closure date', async () => {
      await studyDetailsPage.assertMiniDashboardTitle('Planned closure date')
      await studyDetailsPage.assertPlannedClosureDateMatchesTableValue()
    })
  })

  test('As a Sponsor Contact I can see a mini dashboard for a study that has a status of Suspended - @Se_316_AC1', async ({
    studiesPage,
    studyDetailsPage,
  }) => {
    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
    })

    await test.step('When I am on the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })

    await test.step('And I Filter for studies that are suspended', async () => {
      await studiesPage.filterByStatusSuspended()
    })

    await test.step(`When I click the View Study button of any Study on the Study List`, async () => {
      await studiesPage.viewStudyButton.nth(0).click()
    })

    await test.step(`Then I am taken to the Details page`, async () => {
      await studiesPage.viewStudyButton.nth(0).click()
      await expect(studyDetailsPage.pageTitle).toBeVisible()
    })

    await test.step('Then I should see the first box in the dashboard to say Study Status: Suspended', async () => {
      await studyDetailsPage.assertMiniDashboardTitle('Study Status')
      await studyDetailsPage.assertMiniDashboardText('Suspended')
    })

    await test.step('And the second box to have the Recruitment total', async () => {
      await studyDetailsPage.assertMiniDashboardTitle('Recruitment total')
      await studyDetailsPage.assertRecruitmentTotalMatchesTableValue()
    })

    await test.step('And the third box to have the estimated re-opening date', async () => {
      await studyDetailsPage.assertMiniDashboardTitle('Estimated reopening date')
      await studyDetailsPage.assertEstimatedReopenDateMatchesTableValue()
    })
  })
})
