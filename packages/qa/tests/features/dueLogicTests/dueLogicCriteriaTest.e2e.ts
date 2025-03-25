import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'

const testUserId = 6
const startingOrgId = 9

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
    studyDetailsPage,
  }) => {
    const testStudy = await seDatabaseReq(`
      SELECT s.id, s.cpmsId FROM Study s
      JOIN StudyOrganisation so ON s.id = so.studyId
      JOIN StudyEvaluationCategory sec ON s.id = sec.studyId
      JOIN Assessment a ON s.id = a.studyId
      WHERE s.actualOpeningDate IS NULL
        AND so.organisationId = ${startingOrgId}
        AND sec.isDeleted = 0
        AND a.createdAt <= NOW() - INTERVAL 90 DAY
      GROUP BY s.id ORDER BY RAND() LIMIT 1;
    `)

    if (testStudy[0] == null) {
      throw new Error('no studies with the required criteria available in the given org, check the test data!')
    }

    await test.step(`Given I have navigated to the Study List Page`, async () => {
      await studiesPage.goto()
      await studiesPage.assertOnStudiesPage()
    })

    await test.step(`When I Enter the CPMS Id of this study - '${testStudy[0].cpmsId}' - as the Search Phrase`, async () => {
      await studiesPage.enterSearchPhrase(testStudy[0].cpmsId.toString())
    })

    await test.step('And only 1 study is found', async () => {
      await studiesPage.assertSpecificNumberStudies(1)
    })

    await test.step('Then the Study List item will display a `Due` indicator', async () => {
      await studiesPage.assertDueIndicatorDisplayed(0, true)
    })

    await test.step('And if I enter the Study Details page for the Study', async () => {
      await studiesPage.viewStudyButton.nth(0).click()
      await studyDetailsPage.assertOnStudyDetailsPage(testStudy[0].id.toString())
    })

    await test.step('Then the Study Details page will also display a `Due` indicator', async () => {
      await studyDetailsPage.assertDueIndicatorDisplayed(true)
    })
  })

  test('The `Due` icon appears appears for a Study, when the study meets the Due criteria, with actual opening date >= 90 days ago - @se_68_withOpen', async ({
    studiesPage,
    studyDetailsPage,
  }) => {
    const testStudy = await seDatabaseReq(`
      SELECT s.id, s.cpmsId FROM Study s
      JOIN StudyOrganisation so ON s.id = so.studyId
      JOIN StudyEvaluationCategory sec ON s.id = sec.studyId
      JOIN Assessment a ON s.id = a.studyId
      WHERE s.actualOpeningDate <= NOW() - INTERVAL 90 DAY
        AND so.organisationId = ${startingOrgId}
        AND sec.isDeleted = 0
        AND a.createdAt <= NOW() - INTERVAL 90 DAY
      GROUP BY s.id ORDER BY RAND() LIMIT 1;
    `)

    if (testStudy[0] == null) {
      throw new Error('no studies with the required criteria available in the given org, check the test data!')
    }

    await test.step(`Given I have navigated to the Study List Page`, async () => {
      await studiesPage.goto()
      await studiesPage.assertOnStudiesPage()
    })

    await test.step(`When I Enter the CPMS Id of this study - '${testStudy[0].cpmsId}' - as the Search Phrase`, async () => {
      await studiesPage.enterSearchPhrase(testStudy[0].cpmsId.toString())
    })

    await test.step('And only 1 study is found', async () => {
      await studiesPage.assertSpecificNumberStudies(1)
    })

    await test.step('Then the Study List item will display a `Due` indicator', async () => {
      await studiesPage.assertDueIndicatorDisplayed(0, true)
    })

    await test.step('And if I enter the Study Details page for the Study', async () => {
      await studiesPage.viewStudyButton.nth(0).click()
      await studyDetailsPage.assertOnStudyDetailsPage(testStudy[0].id.toString())
    })

    await test.step('Then the Study Details page will also display a `Due` indicator', async () => {
      await studyDetailsPage.assertDueIndicatorDisplayed(true)
    })
  })

  test('The `Due` icon appears for a Study, when the study meets the Due criteria, with no previous Assessment - @se_68_noAssess', async ({
    studiesPage,
    studyDetailsPage,
  }) => {
    const testStudy = await seDatabaseReq(`
      SELECT s.id, s.cpmsId FROM Study s
      JOIN StudyOrganisation so ON s.id = so.studyId
      JOIN StudyEvaluationCategory sec ON s.id = sec.studyId
      LEFT JOIN Assessment a ON s.id = a.studyId
      WHERE s.actualOpeningDate <= NOW() - INTERVAL 90 DAY
        AND so.organisationId = ${startingOrgId}
        AND sec.isDeleted = 0
        AND a.studyId IS NULL
      GROUP BY s.id 
      ORDER BY RAND() LIMIT 1;
    `)

    if (testStudy[0] == null) {
      throw new Error('no studies with the required criteria available in the given org, check the test data!')
    }

    await test.step(`Given I have navigated to the Study List Page`, async () => {
      await studiesPage.goto()
      await studiesPage.assertOnStudiesPage()
    })

    await test.step(`When I Enter the CPMS Id of this study - '${testStudy[0].cpmsId}' - as the Search Phrase`, async () => {
      await studiesPage.enterSearchPhrase(testStudy[0].cpmsId.toString())
    })

    await test.step('And only 1 study is found', async () => {
      await studiesPage.assertSpecificNumberStudies(1)
    })

    await test.step('Then the Study List item will display a `Due` indicator', async () => {
      await studiesPage.assertDueIndicatorDisplayed(0, true)
    })

    await test.step('And if I enter the Study Details page for the Study', async () => {
      await studiesPage.viewStudyButton.nth(0).click()
      await studyDetailsPage.assertOnStudyDetailsPage(testStudy[0].id.toString())
    })

    await test.step('Then the Study Details page will also display a `Due` indicator', async () => {
      await studyDetailsPage.assertDueIndicatorDisplayed(true)
    })
  })

  test('No `Due` icon appears for a Study, when the study does not meet the Due criteria (no Risk Indicators) - @se_68_noRisks', async ({
    studiesPage,
    studyDetailsPage,
  }) => {
    const testStudy = await seDatabaseReq(`
      SELECT s.id, s.cpmsId FROM Study s
      JOIN StudyOrganisation so ON s.id = so.studyId
      JOIN StudyEvaluationCategory sec ON s.id = sec.studyId
        WHERE so.organisationId = ${startingOrgId}
        AND sec.isDeleted = 1
      GROUP BY s.id ORDER BY RAND() LIMIT 1;
    `)

    if (testStudy[0] == null) {
      throw new Error('no studies with the required criteria available in the given org, check the test data!')
    }

    await test.step(`Given I have navigated to the Study List Page`, async () => {
      await studiesPage.goto()
      await studiesPage.assertOnStudiesPage()
    })

    await test.step(`When I Enter the CPMS Id of this study - '${testStudy[0].cpmsId}' - as the Search Phrase`, async () => {
      await studiesPage.enterSearchPhrase(testStudy[0].cpmsId.toString())
    })

    await test.step('And only 1 study is found', async () => {
      await studiesPage.assertSpecificNumberStudies(1)
    })

    await test.step('Then the Study List item will not display a `Due` indicator', async () => {
      await studiesPage.assertDueIndicatorDisplayed(0, false)
    })

    await test.step('And if I enter the Study Details page for the Study', async () => {
      await studiesPage.viewStudyButton.nth(0).click()
      await studyDetailsPage.assertOnStudyDetailsPage(testStudy[0].id.toString())
    })

    await test.step('Then the Study Details page will also not display a `Due` indicator', async () => {
      await studyDetailsPage.assertDueIndicatorDisplayed(false)
    })
  })

  test.skip('The `Due` icon is removed for a Study, when a New Assessment is submitted - @se_68_submitAssess', async ({
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
