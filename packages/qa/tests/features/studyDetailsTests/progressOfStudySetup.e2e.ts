import { test, expect } from '../../../hooks/CustomFixtures'
import { cpmsDatabaseReq } from '../../../utils/DbRequests'

const cpmsStudyId = 50617

type ProgressScenario = {
  name: string
  daysAgo: number
  expectedStatusText: string
  expectedFractionText: string
}

const progressScenarios: ProgressScenario[] = [
  {
    name: '10 days elapsed',
    daysAgo: 10,
    expectedStatusText: '79 days remaining',
    expectedFractionText: '11 / 90 Days',
  },
  {
    name: '89 days elapsed',
    daysAgo: 89,
    expectedStatusText: 'Over target by 0 days',
    expectedFractionText: '90 / 90 Days',
  },
  {
    name: '90 days elapsed',
    daysAgo: 90,
    expectedStatusText: 'Over target by 1 day',
    expectedFractionText: '91 / 90 Days',
  },
  {
    name: '100 days elapsed',
    daysAgo: 100,
    expectedStatusText: 'Over target by 11 days',
    expectedFractionText: '101 / 90 Days',
  },
]

async function setNhsApprovalDateDaysAgo(daysAgo: number) {
  await cpmsDatabaseReq(`
    UPDATE [NIHR.CRN.CPMS.OperationalDatabase].[dbo].[Study]
    SET [NHSPermissionHRAApprovalDate] =
      DATEADD(day, -${daysAgo}, CAST(GETDATE() AS date))
    WHERE [Id] = ${cpmsStudyId};
  `)
}

test.describe('90-day study setup progress', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  for (const scenario of progressScenarios) {
    test(`${scenario.name}`, async ({ studiesPage, studyDetailsPage }) => {
      await setNhsApprovalDateDaysAgo(scenario.daysAgo)

      await test.step('Given I have navigated to the Studies Page', async () => {
        await studiesPage.goto()
      })

      await test.step('When I am on the Studies Page', async () => {
        await studiesPage.assertOnStudiesPage()
      })

      await test.step('And I search for a study that is over target or has days remaining for first recruitment', async () => {
        await studiesPage.enterSearchPhrase(cpmsStudyId.toString())
      })

      await test.step(`When I click the View Study button of any Study on the Study List`, async () => {
        await studiesPage.viewStudyButton.nth(0).click()
      })

      await test.step(`Then I am taken to the Details page`, async () => {
        await expect(studyDetailsPage.pageTitle).toBeVisible()
      })

      await test.step(`Where I can see days remaining and over target by days`, async () => {
        await studyDetailsPage.assertStudySetupProgress(scenario.expectedStatusText, scenario.expectedFractionText)
      })

      await test.step(`When I click on 'All studies' link`, async () => {
        await studyDetailsPage.allStudiesLink.click()
      })

      await test.step('And I search for a study that is over target or has days remaining for first recruitment', async () => {
        await studiesPage.enterSearchPhrase(cpmsStudyId.toString())
      })

      await test.step(`Then I should be able to see the studies setup progress bar`, async () => {
        if (scenario.daysAgo < 89) {
          await expect(studyDetailsPage.studySetUpProgressBarWarning).toBeVisible()
        } else {
          await expect(studyDetailsPage.studySetUpProgressBarError).toBeVisible()
        }
      })
    })
  }
})
