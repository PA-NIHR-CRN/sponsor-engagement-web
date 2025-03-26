import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'
import { convertIsoDateToDisplayDate } from '../../../utils/UtilFunctions'

const testUserId = 6
const startingOrgId = 21
const noAssessmentStudyId = 16958
const dueAssessmentAtDate = '2025-03-25 11:23:14.227'

test.beforeEach('Setup Tests', async () => {
  await seDatabaseReq(`UPDATE UserOrganisation SET organisationId = ${startingOrgId} WHERE userId = ${testUserId}`)
  const allAssessmentIdsForStudy = await seDatabaseReq(
    `SELECT id FROM Assessment WHERE studyId = ${noAssessmentStudyId};`
  )
  for (let index = 0; index < allAssessmentIdsForStudy.length; index++) {
    const assessmentId = allAssessmentIdsForStudy[index].id
    await seDatabaseReq(`DELETE FROM AssessmentFurtherInformation WHERE assessmentId = ${assessmentId};`)
    await seDatabaseReq(`DELETE FROM Assessment WHERE id = ${assessmentId};`)
  }
  await seDatabaseReq(`UPDATE Study SET dueAssessmentAt = '${dueAssessmentAtDate}' WHERE id = ${noAssessmentStudyId};`)
})

test.describe('Submit a Study Assessment and Validate Form Inputs - @se_38', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('Submit Assessment Form without required field, Validation fails - @se_38_ac1', async ({ assessmentPage }) => {
    await test.step('Given I have navigated to the Assessment Page', async () => {
      await assessmentPage.goto(noAssessmentStudyId.toString())
      await assessmentPage.assertOnAssessmentPage(noAssessmentStudyId.toString())
    })
    await test.step('When I submit the form without selecting either of the On/Off track options', async () => {
      await assessmentPage.submitButton.click()
      await assessmentPage.assertValidationErrorsPresent()
    })
    await test.step('Then a `Select how the study is progressing` Validation Error appears in a Summary box and above the On/Off track options', async () => {
      await assessmentPage.assertValidationErrorsPresent()
    })
    await test.step('And clicking the Summary Box Error link', async () => {
      await assessmentPage.errorSummaryAlertBoxLink.click()
    })
    await test.step('Then takes me to the On/Off track options, highlighting On', async () => {
      await assessmentPage.assertOnTrackFocused()
    })
  })

  test('Submit Assessment Form via Study Details, with required field only, Submission is Successful - @se_38_ac2_details', async ({
    studyDetailsPage,
    assessmentPage,
  }) => {
    await test.step(`Given I have navigated to the Study Details Page for Study with SE Id ${noAssessmentStudyId}`, async () => {
      await studyDetailsPage.goto(noAssessmentStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(noAssessmentStudyId.toString())
    })
    await test.step(`And the Study has had No Previous Assessment`, async () => {
      await studyDetailsPage.assertNoAssessmentProvided()
    })
    await test.step(`And I click the Assess button`, async () => {
      await studyDetailsPage.assessButton.click()
    })
    await test.step(`And I am taken to the Assessment page for Study with SE Id ${noAssessmentStudyId}`, async () => {
      await assessmentPage.assertOnAssessmentPage(noAssessmentStudyId.toString())
    })
    await test.step(`When I select the 'On Track' option`, async () => {
      await assessmentPage.radioButtonOnTrack.check()
    })
    await test.step(`And I click the Submit button`, async () => {
      await assessmentPage.submitButton.click()
    })
    await test.step(`Then I am returned to the Study Details Page, with a Success notification`, async () => {
      await studyDetailsPage.assertOnStudyDetailsPageWithSuccess(noAssessmentStudyId.toString())
    })
    await test.step(`And there is now a Sponsor Assessment populating the 'Sponsor assessment history' table`, async () => {
      await studyDetailsPage.assertSponsorAssessmentPresent(0)
    })
    await test.step(`And it is in a Collapsed State by Default`, async () => {
      await studyDetailsPage.assertSponsorAssessmentCollapsed(0, true)
    })
    await test.step(`And the Assessment Date is todays date`, async () => {
      await studyDetailsPage.assertSponsorAssessmentDate()
    })
    await test.step(`And the Assessment has been recorded as On Track`, async () => {
      await studyDetailsPage.assertSponsorAssessmentOnOffTrack('On')
    })
    await test.step(`And the Assessment has been assessed by sesponsorcontact@test.id.nihr.ac.uk`, async () => {
      await studyDetailsPage.assertAssessedBy()
    })
    await test.step(`When I Expand the Assessment`, async () => {
      await studyDetailsPage.firstSponsorAssessmentRow.click()
      await studyDetailsPage.assertSponsorAssessmentCollapsed(0, false)
    })
    await test.step(`Then I can see that No Further Info has been recorded`, async () => {
      await studyDetailsPage.assertAssessmentHasNoFurtherInfo()
    })
  })

  test('Submit Assessment Form with Further Information which displays on Study Details - @se_38_ac2_furtherInfo', async ({
    studyDetailsPage,
    assessmentPage,
  }) => {
    await test.step(`Given I have navigated to the Study Details Page for Study with SE Id ${noAssessmentStudyId}`, async () => {
      await studyDetailsPage.goto(noAssessmentStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(noAssessmentStudyId.toString())
    })
    await test.step(`And the Study has had No Previous Assessment`, async () => {
      await studyDetailsPage.assertNoAssessmentProvided()
    })
    await test.step(`And I click the Assess button`, async () => {
      await studyDetailsPage.assessButton.click()
    })
    await test.step(`And I am taken to the Assessment page for Study with SE Id ${noAssessmentStudyId}`, async () => {
      await assessmentPage.assertOnAssessmentPage(noAssessmentStudyId.toString())
    })
    await test.step(`When I select the 'On Track' option`, async () => {
      await assessmentPage.radioButtonOnTrack.check()
    })
    await test.step(`And I select the 'In discussion with stakeholders to agree next steps' Further Info option`, async () => {
      await assessmentPage.discussionStakeholdersInput.check()
    })
    await test.step(`And I select the 'Follow up complete or none required' Further info option`, async () => {
      await assessmentPage.followUpCompleteInput.check()
    })
    await test.step(`And I enter 'TESTING' in the Further Info Text Area`, async () => {
      await assessmentPage.furtherInfoTextArea.fill('TESTING')
    })
    await test.step(`And I click the Submit button`, async () => {
      await assessmentPage.submitButton.click()
    })
    await test.step(`Then I am returned to the Study Details Page, with a Success notification`, async () => {
      await studyDetailsPage.assertOnStudyDetailsPageWithSuccess(noAssessmentStudyId.toString())
    })
    await test.step(`And there is now a Sponsor Assessment populating the 'Sponsor assessment history' table`, async () => {
      await studyDetailsPage.assertSponsorAssessmentPresent(0)
    })
    await test.step(`And it is in an Open State by Default`, async () => {
      await studyDetailsPage.assertSponsorAssessmentCollapsed(0, false)
    })
    await test.step(`And I can see that my Further Info Selections have been recorded`, async () => {
      await studyDetailsPage.assertAssessmentFurtherInfoSelections(
        0,
        0,
        'In discussion with stakeholders to agree next steps'
      )
      await studyDetailsPage.assertAssessmentFurtherInfoSelections(0, 1, 'Follow up complete or none required')
    })
    await test.step(`And I can see that my Further Info Text has been recorded`, async () => {
      await studyDetailsPage.assertAssessmentFurtherInfoText(0, 'TESTING')
    })
  })

  test('Submit Assessment Form with Further Information which displays on Last Assessment Panel - @se_38_ac2_last_assessment_single', async ({
    studyDetailsPage,
    assessmentPage,
  }) => {
    await test.step(`Given I have navigated to the Assessment Page for a Study with no Assessment - SE Id ${noAssessmentStudyId}`, async () => {
      await assessmentPage.goto(noAssessmentStudyId.toString())
      await assessmentPage.assertOnAssessmentPage(noAssessmentStudyId.toString())
    })
    await test.step('And I see the `Last sponsor assessment` section', async () => {
      await assessmentPage.assertLastSponsorSectionPresent()
    })
    await test.step('And the text `This study has not had any assessments provided` appears', async () => {
      await assessmentPage.assertNoPreviousAssessment()
    })
    await test.step(`When I select the 'Off Track' option`, async () => {
      await assessmentPage.radioButtonOffTrack.check()
    })
    await test.step(`And I select the 'Waiting for HRA or MHRA approvals' Further Info option`, async () => {
      await assessmentPage.waitingForHraInput.check()
    })
    await test.step(`And I select the 'Study closed to recruitment, in follow up' Further info option`, async () => {
      await assessmentPage.closedToRecruitmentInput.check()
    })
    await test.step(`And I enter 'TESTING' in the Further Info Text Area`, async () => {
      await assessmentPage.furtherInfoTextArea.fill('TESTING')
    })
    await test.step(`And I click the Submit button`, async () => {
      await assessmentPage.submitButton.click()
    })
    await test.step(`And I am returned to the Study Details Page, with a Success notification`, async () => {
      await studyDetailsPage.assertOnStudyDetailsPageWithSuccess(noAssessmentStudyId.toString())
    })
    await test.step(`And I click the Assess button`, async () => {
      await studyDetailsPage.assessButton.click()
      await assessmentPage.assertOnAssessmentPage(noAssessmentStudyId.toString())
    })
    await test.step(`Then there is now a Sponsor Assessment populating the 'Last sponsor assessment' panel`, async () => {
      await assessmentPage.assertLastSponsorAssessmentPresent()
    })
    await test.step(`And it is in a Closed State by Default`, async () => {
      await assessmentPage.assertLastSponsorAssessmentCollapsed(true)
    })
    await test.step(`And the Assessment Date is todays date`, async () => {
      await assessmentPage.assertlastSponsorAssessmentDate()
    })
    await test.step(`And the Assessment has been recorded as Off Track`, async () => {
      await assessmentPage.assertLastSponsorAssessmentOnOffTrack('Off')
    })
    await test.step(`And the Assessment has been assessed by sesponsorcontact@test.id.nihr.ac.uk`, async () => {
      await assessmentPage.assertAssessedBy()
    })
    await test.step(`When I Expand the Assessment`, async () => {
      await assessmentPage.lastSponsorAssessmentRow.click()
      await assessmentPage.assertLastSponsorAssessmentCollapsed(false)
    })
    await test.step(`And I can see that my Further Info Selections have been recorded`, async () => {
      await assessmentPage.assertAssessmentFurtherInfoSelections(0, 'Waiting for HRA or MHRA approvals')
      await assessmentPage.assertAssessmentFurtherInfoSelections(1, 'Study closed to recruitment, in follow up')
    })
    await test.step(`And I can see that my Further Info Text has been recorded`, async () => {
      await assessmentPage.assertAssessmentFurtherInfoText('TESTING')
    })
  })

  test('Assesment Form Page will show only the Most Recent Assessment on Last Assessment Panel - @se_38_ac2_last_assessment_multi', async ({
    studyDetailsPage,
    assessmentPage,
  }) => {
    await test.step(`Given I have navigated to the Assessment Page for a Study with no Assessment - SE Id ${noAssessmentStudyId}`, async () => {
      await assessmentPage.goto(noAssessmentStudyId.toString())
      await assessmentPage.assertOnAssessmentPage(noAssessmentStudyId.toString())
    })
    await test.step(`When I select the 'Off Track' option`, async () => {
      await assessmentPage.radioButtonOffTrack.check()
    })
    await test.step(`And I click the Submit button`, async () => {
      await assessmentPage.submitButton.click()
    })
    await test.step(`And I am returned to the Study Details Page, with a Success notification`, async () => {
      await studyDetailsPage.assertOnStudyDetailsPageWithSuccess(noAssessmentStudyId.toString())
    })
    await test.step(`And I click the Assess button`, async () => {
      await studyDetailsPage.assessButton.click()
      await assessmentPage.assertOnAssessmentPage(noAssessmentStudyId.toString())
    })
    await test.step(`When I select the 'On Track' option`, async () => {
      await assessmentPage.radioButtonOnTrack.check()
    })
    await test.step(`And I click the Submit button`, async () => {
      await assessmentPage.submitButton.click()
    })
    await test.step(`And I am returned to the Study Details Page, with a Success notification`, async () => {
      await studyDetailsPage.assertOnStudyDetailsPageWithSuccess(noAssessmentStudyId.toString())
      await studyDetailsPage.goto(`${noAssessmentStudyId.toString()}`)
    })
    await test.step(`And I click the Assess button`, async () => {
      await studyDetailsPage.assessButton.click()
      await assessmentPage.assertOnAssessmentPage(noAssessmentStudyId.toString())
    })
    await test.step(`Then there is now a Sponsor Assessment populating the 'Last sponsor assessment' panel`, async () => {
      await assessmentPage.assertLastSponsorAssessmentPresent()
    })
    await test.step(`And the Assessment has been recorded as On Track`, async () => {
      await assessmentPage.assertLastSponsorAssessmentOnOffTrack('On')
    })
  })
})
