import { RowDataPacket } from 'mysql2'
import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq, waitForSeDbRequest } from '../../../utils/DbRequests'
import { getStudyEngagementInfo } from '../../../utils/ApiRequests'

const testUserId = 6
const startingOrgId = 2
const timeStamp = new Date().toISOString()

let startingStudyId = 0
let studyCoreDetails: RowDataPacket[]

test.beforeAll('Setup Tests', async () => {
  await seDatabaseReq(`UPDATE UserOrganisation SET organisationId = ${startingOrgId} WHERE userId = ${testUserId}`)

  const randomStudyIdSelected = await seDatabaseReq(`
    SELECT Study.id FROM Study 
    INNER JOIN StudyOrganisation ON Study.id = StudyOrganisation.studyId
    WHERE StudyOrganisation.organisationId = ${startingOrgId} AND StudyOrganisation.isDeleted = 0 AND Study.isDeleted = 0
    AND Study.studyStatus = 'In Setup, Pending Approval'
    ORDER BY RAND() LIMIT 1;
  `)
  startingStudyId = randomStudyIdSelected[0].id

  studyCoreDetails = await seDatabaseReq(`
    SELECT cpmsId FROM sponsorengagement.Study where id = ${startingStudyId};
  `)
})

test.describe('Update study and save changes locally in SE @se_184', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('As a sponsor contact I can make proposed changed to the study data @se_185_proposed', async ({
    studyUpdatePage,
    studyDetailsPage,
  }) => {
    await seDatabaseReq(`
      DELETE FROM sponsorengagement.StudyUpdates WHERE studyId = ${startingStudyId};
    `)

    await test.step(`Given I have navigated to the Update study data page for the Study with SE Id ${startingStudyId}`, async () => {
      await studyUpdatePage.goto(startingStudyId.toString())
    })

    await test.step(`When I update the study details with a proposed status change`, async () => {
      await studyUpdatePage.statusRadioClosed.click()
      await studyUpdatePage.fillStudyDates('plannedOpening', '12', '06', '2025')
      await studyUpdatePage.fillStudyDates('actualOpening', '12', '06', '2024')
      await studyUpdatePage.fillStudyDates('plannedClosure', '12', '06', '2027')
      await studyUpdatePage.fillStudyDates('actualClosure', '12', '06', '2024')
      await studyUpdatePage.ukRecruitmentTarget.fill('101')
      await studyUpdatePage.furtherInfo.fill(`se e2e auto test - ${timeStamp}`)
      await studyUpdatePage.buttonUpdate.click()
    })

    await test.step(`Then I should see that my changes have been saved as proposed changes`, async () => {
      const dbStudyUpdate = await waitForSeDbRequest(
        `SELECT * FROM sponsorengagement.StudyUpdates WHERE studyId = ${startingStudyId} ORDER by createdAt LIMIT 1;`
      )

      await studyUpdatePage.assertSeDbUpdateProposed(dbStudyUpdate[0], timeStamp)
      await studyDetailsPage.assertStudyUpdatedSuccess('proposed')
    })
  })

  test('As a sponsor contact I can make direct changes to the study data @se_185_direct', async ({
    studyUpdatePage,
    studyDetailsPage,
  }) => {
    await seDatabaseReq(`
      DELETE FROM sponsorengagement.StudyUpdates WHERE studyId = ${startingStudyId};
    `)

    await test.step(`Given I have navigated to the Update study data page for the Study with SE Id ${startingStudyId}`, async () => {
      await studyUpdatePage.goto(startingStudyId.toString())
    })

    await test.step(`When I update the study details without changing the status`, async () => {
      const today = timeStamp.split('T')[0].split('-')

      await studyUpdatePage.fillStudyDates('plannedOpening', '12', '06', '2025')
      await studyUpdatePage.fillStudyDates('plannedClosure', '12', '06', '2027')
      await studyUpdatePage.ukRecruitmentTarget.fill('101')
      await studyUpdatePage.furtherInfo.fill(`se e2e auto test - ${timeStamp}`)
      await studyUpdatePage.buttonUpdate.click()
    })

    await test.step(`Then I should see that my changes have been saved as direct changes`, async () => {
      const dbStudyUpdate = await waitForSeDbRequest(
        `SELECT * FROM sponsorengagement.StudyUpdates WHERE studyId = ${startingStudyId} ORDER by createdAt LIMIT 1;`
      )

      await studyUpdatePage.assertSeDbUpdateDirect(dbStudyUpdate[0], timeStamp)
      await studyDetailsPage.assertStudyUpdatedSuccess('direct')
    })
  })
})
