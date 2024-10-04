import { RowDataPacket } from 'mysql2'
import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'
import { getStudyEngagementInfo } from '../../../utils/ApiRequests'

const testUserId = 6
const startingOrgId = 9

let startingStudyId = 0
let studyCoreDetails: RowDataPacket[]
let getStudyResponse: JSON
//Must ensure that specific SE study Id's below remain in the SE Tool on Test
const noProtocolRefNoStudyId = 17122

test.beforeAll('Setup Tests', async () => {
  await seDatabaseReq(`UPDATE UserOrganisation SET organisationId = ${startingOrgId} WHERE userId = ${testUserId}`)
  await seDatabaseReq(`UPDATE Study SET protocolReferenceNumber = NULL WHERE id = ${noProtocolRefNoStudyId};`)

  const randomStudyIdSelected = await seDatabaseReq(`
    SELECT Study.id FROM Study 
    INNER JOIN StudyOrganisation
    ON Study.id = StudyOrganisation.studyId
    WHERE StudyOrganisation.organisationId = ${startingOrgId} AND StudyOrganisation.isDeleted = 0 AND Study.isDeleted = 0
    AND Study.studyStatus = 'In Setup, Pending Approval'
    ORDER BY RAND() LIMIT 1;
  `)
  startingStudyId = randomStudyIdSelected[0].id

  studyCoreDetails = await seDatabaseReq(`
    SELECT cpmsId FROM sponsorengagement.Study where id = ${startingStudyId};`)

  getStudyResponse = await getStudyEngagementInfo(studyCoreDetails[0].cpmsId)
})

test.describe('Update study data page - @se_166', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('As a Sponsor I can see the page header, study information and guidance section - @se_166_ac1', async ({
    studyUpdatePage,
  }) => {
    await test.step(`Given I have navigated to the Update study data page for the Study with SE Id ${startingStudyId}`, async () => {
      await studyUpdatePage.goto(startingStudyId.toString())
    })
    await test.step(`Then I should see the Update study data page`, async () => {
      await studyUpdatePage.assertOnUpdateStudyPage(startingStudyId.toString())
    })

    await test.step(`And I see the Sponsor Organisation (or delegate CRO/CTU)`, async () => {
      await studyUpdatePage.assertSponsorOrg(getStudyResponse.StudySponsors)
      // looks for CRO first, then CTU, else Sponsor - see method
    })

    await test.step(`And I see the study short title`, async () => {
      await studyUpdatePage.assertStudyTitle(getStudyResponse.StudyShortName)
    })

    await test.step(`And I see introductory guidance copy explaining how the updates are going to be applied`, async () => {
      await studyUpdatePage.assertGuidanceText()
    })
  })

  test('As a Sponsor I can see the update study fields pre-populate current values - @se_166_ac2', async ({
    studyUpdatePage,
  }) => {
    await test.step(`Given I have navigated to the Update study data page for the Study with SE Id ${startingStudyId}`, async () => {
      await studyUpdatePage.goto(startingStudyId.toString())
    })
    await test.step(`Then I should see all of the values on the page are defaulted to their current study details values`, async () => {
      await studyUpdatePage.statusRadioClosed.click()
      await studyUpdatePage.assertStudyStatus(getStudyResponse.StudyStatus)
      await studyUpdatePage.assertStudyDate(getStudyResponse.PlannedOpeningDate, 'plannedOpening')
      await studyUpdatePage.assertStudyDate(getStudyResponse.ActualOpeningDate, 'actualOpening')
      await studyUpdatePage.assertStudyDate(getStudyResponse.PlannedClosureToRecruitmentDate, 'plannedClosure')
      await studyUpdatePage.assertStudyDate(getStudyResponse.ActualClosureToRecruitmentDate, 'actualClosure')
      await studyUpdatePage.assertRecruitmentTarget(getStudyResponse.SampleSize)
    })
  })

  test('As a Sponsor I can see and update the study status - @se_166_ac3 @se_200', async ({ studyUpdatePage }) => {
    await test.step(`Given I have navigated to the Update study data page for the Study with SE Id ${startingStudyId}`, async () => {
      await studyUpdatePage.goto(startingStudyId.toString())
    })
    await test.step(`Then I can see available statuses based on the current study status`, async () => {
      await studyUpdatePage.assertStudyStatusSection()
    })
    await test.step(`And I will be shown or hidden fields based on the selected status`, async () => {
      await studyUpdatePage.statusRadioInSetup.click()
      await studyUpdatePage.assertPlannedOpeningFieldsVisible()
      await studyUpdatePage.assertPlannedClosureFieldsVisible()
      await studyUpdatePage.statusRadioOpenRec.click()
      await studyUpdatePage.assertPlannedOpeningFieldsVisible()
      await studyUpdatePage.assertActualOpeningFieldsVisible()
      await studyUpdatePage.assertPlannedClosureFieldsVisible()
      await studyUpdatePage.statusRadioClosedInFollow.click()
      await studyUpdatePage.assertPlannedOpeningFieldsVisible()
      await studyUpdatePage.assertActualOpeningFieldsVisible()
      await studyUpdatePage.assertPlannedClosureFieldsVisible()
      await studyUpdatePage.assertActualClosureFieldsVisible()
      await studyUpdatePage.statusRadioClosed.click()
      await studyUpdatePage.assertPlannedOpeningFieldsVisible()
      await studyUpdatePage.assertActualOpeningFieldsVisible()
      await studyUpdatePage.assertPlannedClosureFieldsVisible()
      await studyUpdatePage.assertActualClosureFieldsVisible()
      await studyUpdatePage.statusRadioWithdrawn.click()
      await studyUpdatePage.assertPlannedOpeningFieldsVisible()
      await studyUpdatePage.assertPlannedClosureFieldsVisible()
      await studyUpdatePage.statusRadioSuspended.click()
      await studyUpdatePage.assertPlannedOpeningFieldsVisible()
      await studyUpdatePage.assertActualOpeningFieldsVisible()
      await studyUpdatePage.assertPlannedClosureFieldsVisible()
      await studyUpdatePage.assertEstimatedReopeningFieldsVisible()
    })
  })

  test('As a Sponsor I can see and update the study dates - @se_166_ac4 @se_200', async ({ studyUpdatePage }) => {
    await test.step(`Given I have navigated to the Update study data page for the Study with SE Id ${startingStudyId}`, async () => {
      await studyUpdatePage.goto(startingStudyId.toString())
    })
    await test.step(`Then I can see a date input fields based on the current study status`, async () => {
      await studyUpdatePage.assertStudyDateSelections(getStudyResponse.StudyRoute)
    })
    await test.step(`And I can update the available date values`, async () => {
      await studyUpdatePage.statusRadioClosed.click()
      await studyUpdatePage.fillStudyDates('plannedOpening', '12', '06', '2025')
      await studyUpdatePage.fillStudyDates('actualOpening', '12', '06', '2026')
      await studyUpdatePage.fillStudyDates('plannedClosure', '12', '06', '2027')
      await studyUpdatePage.fillStudyDates('actualClosure', '12', '06', '2028')
      await studyUpdatePage.statusRadioSuspended.click()
      await studyUpdatePage.fillStudyDates('estimatedReopening', '12', '06', '2028')
    })
  })

  test('As a Sponsor I can see and update the study recruitment target - @se_166_ac5', async ({ studyUpdatePage }) => {
    await test.step(`Given I have navigated to the Update study data page for the Study with SE Id ${startingStudyId}`, async () => {
      await studyUpdatePage.goto(startingStudyId.toString())
    })
    await test.step(`Then I can see an input for the study recruitment target`, async () => {
      await studyUpdatePage.assertRecruitmentTargetInput()
    })
    await test.step(`And I can update the study recruitment target figure`, async () => {
      await studyUpdatePage.ukRecruitmentTarget.fill('123')
    })
  })

  test('As a Sponsor I can see and update the study further information - @se_166_ac6', async ({ studyUpdatePage }) => {
    await test.step(`Given I have navigated to the Update study data page for the Study with SE Id ${startingStudyId}`, async () => {
      await studyUpdatePage.goto(startingStudyId.toString())
    })
    await test.step(`Then I can see an input for the study further information`, async () => {
      await studyUpdatePage.assertFurtherInfoInput()
    })
    await test.step(`And I can update the study further information text`, async () => {
      await studyUpdatePage.furtherInfo.fill('This is my lovely test text')
    })
  })

  test('As a Sponsor I Cancel and return to Study page - @se_166_ac9', async ({
    studyUpdatePage,
    studyDetailsPage,
  }) => {
    await test.step(`Given I have navigated to the Update study data page for the Study with SE Id ${startingStudyId}`, async () => {
      await studyUpdatePage.goto(startingStudyId.toString())
    })
    await test.step(`When I can press Cancel`, async () => {
      await studyUpdatePage.buttonCancel.click()
    })
    await test.step(`Then I return to the the Study page`, async () => {
      await studyDetailsPage.assertOnStudyDetailsPage(startingStudyId.toString())
    })
  })

  test('As a Sponsor I can see the Request NIHR RDN support box - @se_166_ac10', async ({ studyUpdatePage }) => {
    await test.step(`Given I have navigated to the Update study data page for the Study with SE Id ${startingStudyId}`, async () => {
      await studyUpdatePage.goto(startingStudyId.toString())
    })
    await test.step(`Then I will see a Request NIHR RDN support box in the top right corner of the page`, async () => {
      await studyUpdatePage.assertRdnSupport()
    })
  })
})
