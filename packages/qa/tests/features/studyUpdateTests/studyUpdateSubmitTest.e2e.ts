import { RowDataPacket } from 'mysql2'
import { test, expect } from '../../../hooks/CustomFixtures'
import { cpmsDatabaseReq, seDatabaseReq, waitForSeDbRequest } from '../../../utils/DbRequests'
import { convertIsoDateToDisplayDateV2, splitIsoDate } from '../../../utils/UtilFunctions'

const testUserId = 6
const startingOrgId = 2
const user = 'sesponsorcontact@test.id.nihr.ac.uk'

// date variables for updating study dates and creating unique values
const today = new Date()
const timeStamp = today.toISOString()
const yy = today.getFullYear()
const mm = String(today.getMonth() + 1).padStart(2, '0')
const dd = String(today.getDate()).padStart(2, '0')
// creating iso date strings
const plannedOpen = `${yy}-${mm}-${dd}`
const actualOpen = `${yy}-${mm}-${dd}`
const plannedClose = `${yy + 1}-${mm}-${dd}` // +1 year
const actualClose = `${yy}-${mm}-${dd}`
// splitting iso dates
const po = splitIsoDate(plannedOpen)
const ao = splitIsoDate(actualOpen)
const pc = splitIsoDate(plannedClose)
const ac = splitIsoDate(actualClose)
// unique target values based on current hhmmss
let uniqueTarget = timeStamp.slice(11, 19).replace(/:/g, '')
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
    SELECT cpmsId, route FROM sponsorengagement.Study where id = ${startingStudyId};
  `)
})

test.describe('Update study and save changes locally in SE @se_184', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('As a sponsor contact I can make proposed changed to the study data @se_184_proposed', async ({
    studyUpdatePage,
    studyDetailsPage,
  }) => {
    await cpmsDatabaseReq(`
      UPDATE [NIHR.CRN.CPMS.OperationalDatabase].[dbo].[Study]
      SET 
        [PlannedRecruitmentStartDate] = NULL,
        [PlannedRecruitmentEndDate] = NULL,
        [ActualOpeningDate] = NULL,
        [ActualClosureDate] = NULL,
        [UkRecruitmentSampleSize] = NULL,
        [NetworkRecruitmentSampleSize] = NULL
      WHERE [Id] = ${studyCoreDetails[0].cpmsId};  
    `) // resets values in cpms to null
    await seDatabaseReq(`
      DELETE FROM sponsorengagement.StudyUpdates WHERE studyId = ${startingStudyId};
    `) // resets study updates in se

    await test.step(`Given I have navigated to the Update study data page for the Study with SE Id ${startingStudyId}`, async () => {
      await studyUpdatePage.goto(startingStudyId.toString())
    })

    await test.step(`When I update the study details with a proposed status change`, async () => {
      await studyUpdatePage.statusRadioClosed.click()
      await studyUpdatePage.fillStudyDates('plannedOpening', po.d, po.m, po.y)
      await studyUpdatePage.fillStudyDates('actualOpening', ao.d, ao.m, ao.y)
      await studyUpdatePage.fillStudyDates('plannedClosure', pc.d, pc.m, pc.y)
      await studyUpdatePage.fillStudyDates('actualClosure', ac.d, ac.m, ac.y)
      await studyUpdatePage.ukRecruitmentTarget.fill(uniqueTarget)
      await studyUpdatePage.furtherInfo.fill(`se e2e auto test - ${timeStamp}`)
      await studyUpdatePage.buttonUpdate.click()
      await studyUpdatePage.assertUpdatingMessage()
    })

    await test.step(`Then I should see that my changes have been saved as proposed changes`, async () => {
      const dbStudyUpdate = await waitForSeDbRequest(
        `SELECT * FROM sponsorengagement.StudyUpdates WHERE studyId = ${startingStudyId} ORDER by createdAt LIMIT 2;`
      )

      await studyUpdatePage.assertSeDbUpdateProposed(dbStudyUpdate[1], timeStamp)
      await studyDetailsPage.assertStudyUpdatedSuccess('proposed')
    })

    await test.step(`And I should see my proposed changes study details edit history`, async () => {
      const added = true

      await expect(studyDetailsPage.proposedChangeEditHistory).toBeVisible()
      await expect(studyDetailsPage.proposedChangeUser).toContainText(`Proposed change submitted by ${user}`)

      await studyDetailsPage.assertStudyDetailsEditHistory('status', 'Closed', added)
      await studyDetailsPage.assertStudyDetailsEditHistory(
        'plannedOpening',
        convertIsoDateToDisplayDateV2(new Date(plannedOpen)),
        added
      )
      await studyDetailsPage.assertStudyDetailsEditHistory(
        'actualOpening',
        convertIsoDateToDisplayDateV2(new Date(actualOpen)),
        added
      )
      await studyDetailsPage.assertStudyDetailsEditHistory(
        'plannedClosure',
        convertIsoDateToDisplayDateV2(new Date(plannedClose)),
        added
      )
      await studyDetailsPage.assertStudyDetailsEditHistory(
        'actualClosure',
        convertIsoDateToDisplayDateV2(new Date(actualClose)),
        added
      )
      await studyDetailsPage.assertStudyDetailsEditHistory('ukTarget', uniqueTarget, added)
    })
  })

  test('As a sponsor contact I can make direct changes to the study data @se_184_direct', async ({
    studyUpdatePage,
    studyDetailsPage,
  }) => {
    await cpmsDatabaseReq(`
      UPDATE [NIHR.CRN.CPMS.OperationalDatabase].[dbo].[Study]
      SET 
        [PlannedRecruitmentStartDate] = NULL,
        [PlannedRecruitmentEndDate] = NULL,
        [ActualOpeningDate] = NULL,
        [ActualClosureDate] = NULL,
        [UkRecruitmentSampleSize] = NULL,
        [NetworkRecruitmentSampleSize] = NULL
      WHERE [Id] = ${studyCoreDetails[0].cpmsId};  
    `)
    await seDatabaseReq(`
      DELETE FROM sponsorengagement.StudyUpdates WHERE studyId = ${startingStudyId};
    `)

    await test.step(`Given I have navigated to the Update study data page for the Study with SE Id ${startingStudyId}`, async () => {
      await studyUpdatePage.goto(startingStudyId.toString())
    })

    await test.step(`When I update the study details without changing the status`, async () => {
      await studyUpdatePage.fillStudyDates('plannedOpening', po.d, po.m, po.y)
      await studyUpdatePage.fillStudyDates('plannedClosure', pc.d, pc.m, pc.y)
      await studyUpdatePage.ukRecruitmentTarget.fill(uniqueTarget)
      await studyUpdatePage.furtherInfo.fill(`se e2e auto test - ${timeStamp}`)
      await studyUpdatePage.buttonUpdate.click()
      await studyUpdatePage.assertUpdatingMessage()
    })

    await test.step(`Then I should see that my changes have been saved as direct changes`, async () => {
      const dbStudyUpdate = await waitForSeDbRequest(
        `SELECT * FROM sponsorengagement.StudyUpdates WHERE studyId = ${startingStudyId} ORDER by createdAt LIMIT 2;`
      )

      await studyUpdatePage.assertSeDbUpdateDirect(dbStudyUpdate[1], timeStamp)
      await studyDetailsPage.assertStudyUpdatedSuccess('direct')
    })

    await test.step(`And I should see that my direct changes are reflected on the study details page`, async () => {
      await studyDetailsPage.assertPlannedOpeningDateV2(new Date(plannedOpen))
      await studyDetailsPage.assertPlannedClosureDateV2(new Date(plannedClose))
      await studyDetailsPage.assertUkTarget(parseInt(uniqueTarget), studyCoreDetails[0].route)
    })

    await test.step(`And I should see my changes under View edit history`, async () => {
      // await studyDetailsPage.directChangeEditHistory.click()
      // await expect(studyDetailsPage.proposedChangeEditHistory).toBeVisible()
      // await expect(studyDetailsPage.directChangeUser).toContainText(`Change made by ${user}`)
    })
  })
})
