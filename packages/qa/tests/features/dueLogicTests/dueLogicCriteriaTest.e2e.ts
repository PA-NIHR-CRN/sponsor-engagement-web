import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'

const testUserId = 6
const startingOrgId = 9
const nullOpeningDateStudyId = 12546
const nullOpeningDateCpmsId = 40196
const hasOpeningDateStudyId = 14785
const hasOpeningDateCpmsId = 45802
const noPrevAssessmentStudyId = 15273
const noPrevAssessmentCpmsId = 46553
const noRisksStudyId = 17122
const noRisksCpmsId = 50574
const provideAssessmentStudyId = 10692
const provideAssessmentCpmsId = 37196

test.beforeAll('Setup Tests', async () => {
  await seDatabaseReq(`UPDATE UserOrganisation SET organisationId = ${startingOrgId} WHERE userId = ${testUserId}`)
  const allAssessmentIdsForStudy = await seDatabaseReq(
    `SELECT id FROM Assessment WHERE studyId = ${provideAssessmentStudyId};`
  )
  for (let index = 0; index < allAssessmentIdsForStudy.length; index++) {
    const assessmentId = allAssessmentIdsForStudy[index].id
    await seDatabaseReq(`DELETE FROM AssessmentFurtherInformation WHERE assessmentId = ${assessmentId};`)
    await seDatabaseReq(`DELETE FROM Assessment WHERE id = ${assessmentId};`)
  }
  await seDatabaseReq(`UPDATE Study SET isDueAssessment = 1 WHERE id = ${provideAssessmentStudyId};`)
})

test.describe('Criteria for Determining if a Study is `Due` and Assessment - @se_68', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('The `Due` icon appears appears for a Study, when the study meets the Due criteria, with null opening date - @se_68_nullOpen', async ({
    studiesPage,
    commonItemsPage,
    studyDetailsPage,
  }) => {
    await test.step(`Given I have navigated to the Study List Page`, async () => {
      await studiesPage.goto()
      await studiesPage.assertOnStudiesPage()
    })
    await test.step('And I have identified a study with no Actual Opening Date', async () => {
      await commonItemsPage.assertStudyHasNullOpeningDate(
        `SELECT actualOpeningDate FROM Study WHERE id = ${nullOpeningDateStudyId};`,
        true
      )
    })
    await test.step('And the study has 1 or more risk indicators', async () => {
      await commonItemsPage.assertStudyHasRisksInDb(
        `SELECT indicatorType FROM StudyEvaluationCategory 
            WHERE studyId = ${nullOpeningDateStudyId};`,
        true
      )
    })
    await test.step('And the studies Last Assessment was 3 months ago, or longer', async () => {
      await commonItemsPage.assertLastAssessmentLongerThanThreeMonths(`SELECT createdAt FROM Assessment WHERE studyId = ${nullOpeningDateStudyId}
            ORDER BY createdAt desc LIMIT 1;`)
    })
    await test.step(`When I Enter the CPMS Id of this study - '${nullOpeningDateCpmsId}' - as the Search Phrase`, async () => {
      await studiesPage.enterSearchPhrase(nullOpeningDateCpmsId.toString())
    })
    await test.step('And only 1 study is found', async () => {
      await studiesPage.assertSpecificNumberStudies(1)
    })
    await test.step('Then the Study List item will display a `Due` indicator', async () => {
      await studiesPage.assertDueIndicatorDisplayed(0, true)
    })
    await test.step('And if I enter the Study Details page for the Study', async () => {
      await studiesPage.viewStudyButton.nth(0).click()
      await studyDetailsPage.assertOnStudyDetailsPage(nullOpeningDateStudyId.toString())
    })
    await test.step('Then the Study Details page will also display a `Due` indicator', async () => {
      await studyDetailsPage.assertDueIndicatorDisplayed(true)
    })
  })

  test('The `Due` icon appears appears for a Study, when the study meets the Due criteria, with opening date - @se_68_withOpen', async ({
    studiesPage,
    commonItemsPage,
    studyDetailsPage,
  }) => {
    await seDatabaseReq(`
      UPDATE sponsorengagement.Study SET actualOpeningDate = '2024-06-12 00:00:00.000', isDueAssessment = '1' WHERE (id = ${hasOpeningDateStudyId});
    `) // restores any changes to test data

    await test.step(`Given I have navigated to the Study List Page`, async () => {
      await studiesPage.goto()
      await studiesPage.assertOnStudiesPage()
    })
    await test.step('And I have identified a study with an Actual Opening Date', async () => {
      await commonItemsPage.assertStudyHasNullOpeningDate(
        `SELECT actualOpeningDate FROM Study WHERE id = ${hasOpeningDateStudyId};`,
        false
      )
    })
    await test.step('And the study has 1 or more risk indicators', async () => {
      await commonItemsPage.assertStudyHasRisksInDb(
        `SELECT indicatorType FROM StudyEvaluationCategory WHERE studyId = ${hasOpeningDateStudyId};`,
        true
      )
    })
    await test.step('And the studies Last Assessment was 3 months ago, or longer', async () => {
      await commonItemsPage.assertLastAssessmentLongerThanThreeMonths(
        `SELECT createdAt FROM Assessment WHERE studyId = ${hasOpeningDateStudyId} ORDER BY createdAt desc LIMIT 1;`
      )
    })
    await test.step('And the studies Actual Opening Date is 3 months ago, or longer', async () => {
      await commonItemsPage.assertActualOpeningDateLongerThanThreeMonths(
        `SELECT actualOpeningDate FROM Study WHERE id = ${hasOpeningDateStudyId};`
      )
    })
    await test.step(`When I Enter the CPMS Id of this study - '${hasOpeningDateCpmsId}' - as the Search Phrase`, async () => {
      await studiesPage.enterSearchPhrase(hasOpeningDateCpmsId.toString())
    })
    await test.step('And only 1 study is found', async () => {
      await studiesPage.assertSpecificNumberStudies(1)
    })
    await test.step('Then the Study List item will display a `Due` indicator', async () => {
      await studiesPage.assertDueIndicatorDisplayed(0, true)
    })
    await test.step('And if I enter the Study Details page for the Study', async () => {
      await studiesPage.viewStudyButton.nth(0).click()
      await studyDetailsPage.assertOnStudyDetailsPage(hasOpeningDateStudyId.toString())
    })
    await test.step('Then the Study Details page will also display a `Due` indicator', async () => {
      await studyDetailsPage.assertDueIndicatorDisplayed(true)
    })
  })

  test('The `Due` icon appears for a Study, when the study has Risks, but no previous Assessment - @se_68_noAssess', async ({
    studiesPage,
    commonItemsPage,
    studyDetailsPage,
  }) => {
    await test.step(`Given I have navigated to the Study List Page`, async () => {
      await studiesPage.goto()
      await studiesPage.assertOnStudiesPage()
    })
    await test.step('And I have identified a study with no Previous Assessment', async () => {
      await commonItemsPage.assertStudyHasNoPrevAssessment(
        `SELECT * FROM Assessment WHERE studyId = ${noPrevAssessmentStudyId};`
      )
    })
    await test.step('And the study has 1 or more risk indicators', async () => {
      await commonItemsPage.assertStudyHasRisksInDb(
        `SELECT indicatorType FROM StudyEvaluationCategory 
            WHERE studyId = ${noPrevAssessmentStudyId};`,
        true
      )
    })
    await test.step(`When I Enter the CPMS Id of this study - '${noPrevAssessmentCpmsId}' - as the Search Phrase`, async () => {
      await studiesPage.enterSearchPhrase(noPrevAssessmentCpmsId.toString())
    })
    await test.step('And only 1 study is found', async () => {
      await studiesPage.assertSpecificNumberStudies(1)
    })
    await test.step('Then the Study List item will display a `Due` indicator', async () => {
      await studiesPage.assertDueIndicatorDisplayed(0, true)
    })
    await test.step('And if I enter the Study Details page for the Study', async () => {
      await studiesPage.viewStudyButton.nth(0).click()
      await studyDetailsPage.assertOnStudyDetailsPage(noPrevAssessmentStudyId.toString())
    })
    await test.step('Then the Study Details page will also display a `Due` indicator', async () => {
      await studyDetailsPage.assertDueIndicatorDisplayed(true)
    })
  })

  test('No `Due` icon appears for a Study, when the study has no Risk Indicators - @se_68_noRisks', async ({
    studiesPage,
    commonItemsPage,
    studyDetailsPage,
  }) => {
    await test.step(`Given I have navigated to the Study List Page`, async () => {
      await studiesPage.goto()
      await studiesPage.assertOnStudiesPage()
    })
    await test.step('And I have identified a study with no Risk Indicators', async () => {
      await commonItemsPage.assertStudyHasNoRisks(
        `SELECT * FROM StudyEvaluationCategory WHERE studyId = ${noRisksStudyId} AND isDeleted = 0;`
      )
    })
    await test.step(`When I Enter the CPMS Id of this study - '${noPrevAssessmentCpmsId}' - as the Search Phrase`, async () => {
      await studiesPage.enterSearchPhrase(noRisksCpmsId.toString())
    })
    await test.step('And only 1 study is found', async () => {
      await studiesPage.assertSpecificNumberStudies(1)
    })
    await test.step('Then the Study List item will not display a `Due` indicator', async () => {
      await studiesPage.assertDueIndicatorDisplayed(0, false)
    })
    await test.step('And if I enter the Study Details page for the Study', async () => {
      await studiesPage.viewStudyButton.nth(0).click()
      await studyDetailsPage.assertOnStudyDetailsPage(noRisksStudyId.toString())
    })
    await test.step('Then the Study Details page will also not display a `Due` indicator', async () => {
      await studyDetailsPage.assertDueIndicatorDisplayed(false)
    })
  })

  test('The `Due` icon is removed for a Study, when a New Assessment is submitted - @se_68_submitAssess', async ({
    studiesPage,
    studyDetailsPage,
    assessmentPage,
  }) => {
    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
      await studiesPage.assertOnStudiesPage()
    })
    await test.step(`And I Enter the Search Phrase: '${provideAssessmentCpmsId}'`, async () => {
      await studiesPage.enterSearchPhrase(provideAssessmentCpmsId.toString())
    })
    await test.step('And only 1 study is found', async () => {
      await studiesPage.assertSpecificNumberStudies(1)
    })
    await test.step('And it has a Last Assessment value of `None`', async () => {
      await studiesPage.assertSpecificLastAssessmentValue('None', 0)
    })
    await test.step('And the Study List item displays a `Due` indicator', async () => {
      await studiesPage.assertDueIndicatorDisplayed(0, true)
    })
    await test.step('And if I enter the Study Details page for the Study', async () => {
      await studiesPage.viewStudyButton.nth(0).click()
      await studyDetailsPage.assertOnStudyDetailsPage(provideAssessmentStudyId.toString())
    })
    await test.step('And the Study Details page also displays a `Due` indicator', async () => {
      await studyDetailsPage.assertDueIndicatorDisplayed(true)
    })
    await test.step(`And I click the Assess button`, async () => {
      await studyDetailsPage.assessButton.click()
    })
    await test.step(`And I am taken to the Assessment page for Study with SE Id ${provideAssessmentStudyId}`, async () => {
      await assessmentPage.assertOnAssessmentPage(provideAssessmentStudyId.toString())
    })
    await test.step(`When I select the 'On Track' option`, async () => {
      await assessmentPage.radioButtonOnTrack.check()
    })
    await test.step(`And I click the Submit button`, async () => {
      await assessmentPage.submitButton.click()
    })
    await test.step(`And I am returned to the Study Details Page, with a Success notification`, async () => {
      await studyDetailsPage.assertOnStudyDetailsPageWithSuccess(provideAssessmentStudyId.toString())
    })
    await test.step('Then the Study Details page will not display a `Due` indicator', async () => {
      await studyDetailsPage.assertDueIndicatorDisplayed(false)
    })
    await test.step(`And if return to the Study List Page`, async () => {
      await studiesPage.goto()
      await studiesPage.assertOnStudiesPage()
    })
    await test.step(`And I Enter the Search Phrase: '${provideAssessmentCpmsId}'`, async () => {
      await studiesPage.enterSearchPhrase(provideAssessmentCpmsId.toString())
    })
    await test.step('And only 1 study is found', async () => {
      await studiesPage.assertSpecificNumberStudies(1)
    })
    await test.step('Then the Study List item will also not display a `Due` indicator', async () => {
      await studiesPage.assertDueIndicatorDisplayed(0, false)
    })
  })
})
