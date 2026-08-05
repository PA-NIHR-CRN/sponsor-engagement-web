import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'

const studyName = 'AML18'
const reportFirstStudyId = 5172
const consentDate = '01/07/2026'
const siteName = 'Test Site'
const principalInvestigatorTitle = 'Mr'
const principalInvestigatorName = 'Adam Chambers'
const principalInvestigatorEmail = 'adam.chambers@example.com'

async function cleanUpReportFirstTestData() {
  await seDatabaseReq(`
    DELETE FROM StudyFirst
    WHERE studyId = ${reportFirstStudyId}
      AND type = 'european'
      AND siteName = '${siteName}'
      AND piTitle = '${principalInvestigatorTitle}'
      AND piFullName = '${principalInvestigatorName}'
      AND piEmail = '${principalInvestigatorEmail}'
  `)
}

test.describe('Study List First Medal Display - @SE_332', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test.beforeEach('Clean up existing Report a First test data', async () => {
    await cleanUpReportFirstTestData()
  })

  test.afterEach('Clean up Report a First test data', async () => {
    await cleanUpReportFirstTestData()
  })

  test('As a Sponsor Contact I can report a European first and see the medal on the Studies page - @SE_332_ac2', async ({
    studiesPage,
    reportFirstPage,
  }) => {
    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
      await studiesPage.assertOnStudiesPage()
    })

    await test.step('When I open the Report a first page', async () => {
      await studiesPage.assertClickReportAFirstLink()
      await reportFirstPage.assertOnReportAFirstPage()
    })

    await test.step('And I complete the Report a first form for a European first', async () => {
      await reportFirstPage.completeEuropeanFirstForm(
        studyName,
        consentDate,
        siteName,
        principalInvestigatorTitle,
        principalInvestigatorName,
        principalInvestigatorEmail
      )
    })

    await test.step('Then I see a success message', async () => {
      await reportFirstPage.assertSuccessMessageVisible()
    })

    await test.step('And I can see the European first label on the Studies page', async () => {
      await studiesPage.goto()
      await studiesPage.assertOnStudiesPage()
      await studiesPage.enterSearchPhrase(studyName)
      await studiesPage.assertEuropeanFirstLabelVisible()
    })
  })
})
