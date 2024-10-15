import { RowDataPacket } from 'mysql2'
import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq, waitForSeDbRequest } from '../../../utils/DbRequests'
import { getStudyEngagementInfo } from '../../../utils/ApiRequests'

const testUserId = 6
const startingOrgId = 2
const timeStamp = new Date().toISOString()
let uniqueTarget = new Date().toISOString().slice(11, 19).replace(/:/g, '')
if (uniqueTarget.startsWith('0')) {
  uniqueTarget = uniqueTarget.slice(1)
}

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

  test('As a sponsor contact I can make proposed changed to the study data @se_184_proposed', async ({
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
      await studyUpdatePage.ukRecruitmentTarget.fill(uniqueTarget)
      await studyUpdatePage.furtherInfo.fill(`se e2e auto test - ${timeStamp}`)
      await studyUpdatePage.buttonUpdate.click()
      await studyUpdatePage.assertUpdatingMessage()
    })

    await test.step(`Then I should see that my changes have been saved as proposed changes`, async () => {
      const dbStudyUpdate = await waitForSeDbRequest(
        `SELECT * FROM sponsorengagement.StudyUpdates WHERE studyId = ${startingStudyId} ORDER by createdAt LIMIT 1;`
      )

      await studyUpdatePage.assertSeDbUpdateProposed(dbStudyUpdate[0], timeStamp)
      await studyDetailsPage.assertStudyUpdatedSuccess('proposed')
    })

    await test.step(`And I should see that my proposed changes are reflected on the study details page`, async () => {})
  })

  test('As a sponsor contact I can make direct changes to the study data @se_184_direct', async ({
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
      await studyUpdatePage.ukRecruitmentTarget.fill(uniqueTarget)
      await studyUpdatePage.furtherInfo.fill(`se e2e auto test - ${timeStamp}`)
      await studyUpdatePage.buttonUpdate.click()
      await studyUpdatePage.assertUpdatingMessage()
    })

    await test.step(`Then I should see that my changes have been saved as direct changes`, async () => {
      const dbStudyUpdate = await waitForSeDbRequest(
        `SELECT * FROM sponsorengagement.StudyUpdates WHERE studyId = ${startingStudyId} ORDER by createdAt LIMIT 1;`
      )

      await studyUpdatePage.assertSeDbUpdateDirect(dbStudyUpdate[0], timeStamp)
      await studyDetailsPage.assertStudyUpdatedSuccess('direct')
    })

    await test.step(`And I should see that my direct changes are reflected on the study details page`, async () => {})
  })
})
