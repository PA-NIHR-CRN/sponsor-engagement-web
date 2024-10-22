import { RowDataPacket } from 'mysql2'
import { test, expect } from '../../../hooks/CustomFixtures'
import { seDatabaseReq, waitForSeDbRequest, cpmsDatabaseReq } from '../../../utils/DbRequests'
import { convertIsoDateToDisplayDateV2, splitIsoDate } from '../../../utils/UtilFunctions'

const testUserId = 6
const startingOrgId = 2

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

const pOpen = new Date(plannedOpen)
const pClose = new Date(plannedClose)

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

  await cpmsDatabaseReq(`
    UPDATE [NIHR.CRN.CPMS.OperationalDatabase].[dbo].[StudyStatusAudit]
    SET 
      [StatusId] = 3,
      [DetailId] = 1,
      [ReasonNote] = NULL,
      [ModifiedDate] = '2020-01-01'
    WHERE [Id] = ${studyCoreDetails[0].cpmsId};  
  `) // reset status in cpms
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
  `) // reset test data
})

// note: this test is cumbersome due to the page object model not playing well with multiple auth user roles roles
test.describe('Sponsor engagement study update with CPMS study update and SE validation @se_to_cpms_to_se', () => {
  test.describe.configure({ timeout: 99000 }) // generous timeout as CPMS is slow!

  test('direct SE change with CPMS validation then CPMS change with SE validation @se_to_cpms_to_se', async ({
    browser,
  }) => {
    // use se sponsor contact context
    const seContext = await browser.newContext({ storageState: '.auth/sponsorContact.json' })
    const sePage = await seContext.newPage()

    await test.step(`Given I have navigated to the Update study data page for the Study with SE Id ${startingStudyId}`, async () => {
      await sePage.goto(`studies/${startingStudyId}/edit`)
      await expect(sePage.locator('.govuk-inset-text')).toBeVisible()
    })

    await test.step(`And I update the study details with direct changes`, async () => {
      async function fillStudyDates(dateType: string, dd: string, mm: string, yyyy: string) {
        await sePage.locator(`#${dateType}Date-day`).fill(dd)
        await sePage.locator(`#${dateType}Date-month`).fill(mm)
        await sePage.locator(`#${dateType}Date-year`).fill(yyyy)
      }

      await fillStudyDates('plannedOpening', po.d, po.m, po.y)
      await fillStudyDates('plannedClosure', pc.d, pc.m, pc.y)
      await sePage.locator('#recruitmentTarget').fill(uniqueTarget)
      await sePage.locator('#furtherInformation').fill(`se e2e auto test - ${timeStamp}`)
      await sePage.locator('button.govuk-button:has-text("Update")').click()
    })

    await test.step(`And I see that my changes have been saved successfully as direct changes`, async () => {
      const dbStudyUpdate = await waitForSeDbRequest(
        `SELECT * FROM sponsorengagement.StudyUpdates WHERE studyId = ${startingStudyId} ORDER by createdAt LIMIT 2;`
      )
      const updateSuccessContent = sePage.locator('.govuk-notification-banner__heading')
      const studyDetailTable = sePage.locator('.govuk-table__body').first()
      const studyDetailPlannedOpen = studyDetailTable.locator('tr > td').nth(2)
      const studyDetailPlannedClose = studyDetailTable.locator('tr > td').nth(4)
      const studyDetailUkTarget = studyDetailTable.locator('tr > td').nth(6)

      await expect(updateSuccessContent).toHaveText('Your study data changes have been accepted.')
      await expect(studyDetailPlannedOpen).toHaveText(convertIsoDateToDisplayDateV2(pOpen))
      await expect(studyDetailPlannedClose).toHaveText(convertIsoDateToDisplayDateV2(pClose))
      await expect(studyDetailUkTarget).toHaveText(uniqueTarget)
      await expect(dbStudyUpdate[1].comment).toBe(`se e2e auto test - ${timeStamp}`)
    })

    // close se context
    await sePage.close()
    await seContext.close()

    // use cpms npm context
    const cpmsContext = await browser.newContext({ storageState: '.auth/nationalPortfolioManager.json' })
    const cpmsPage = await cpmsContext.newPage()

    await test.step(`When I navigate to the edit view for the study in CPMS with the CPMS Id ${studyCoreDetails[0].cpmsId}`, async () => {
      const id = studyCoreDetails[0].cpmsId

      await cpmsPage.goto(`https://test.cpms.crncc.nihr.ac.uk/Base/StudyRecord/Edit/${id}?selectedTab=4`)
      await expect(cpmsPage.locator('li[data-tabid="4"]')).toHaveAttribute('class', 'active', { timeout: 15000 })
      await expect(cpmsPage.locator('.breadcrumbs')).toBeVisible()
      await expect(cpmsPage.locator('.breadcrumbs')).toContainText(`CPMS ID: ${id}`)
    })

    await test.step(`And I see that the study has my direct changes from SE`, async () => {
      await expect(cpmsPage.locator('#CurrentStudyRecord_UkRecruitmentSampleSize')).toHaveValue(uniqueTarget)
      await expect(cpmsPage.locator('#CurrentStudyRecord_PlannedRecruitmentStartDate')).toHaveAttribute(
        'value',
        new RegExp(`${po.d}\/${po.m}\/${po.y}`)
      )
      await expect(cpmsPage.locator('#CurrentStudyRecord_PlannedRecruitmentEndDate')).toHaveAttribute(
        'value',
        new RegExp(`${pc.d}\/${pc.m}\/${pc.y}`)
      )
    })

    await test.step(`And I update the study details in CPMS with new values`, async () => {
      await cpmsPage.locator('#CurrentStudyRecord_EnglandRecruitmentSampleSize').fill('10101')
      await cpmsPage.locator('#CurrentStudyRecord_GlobalRecruitmentSampleSize').fill('')
      await cpmsPage.locator('#CurrentStudyRecord_ScotlandRecruitmentSampleSize').fill('')
      await cpmsPage.locator('#CurrentStudyRecord_WalesRecruitmentSampleSize').fill('')
      await cpmsPage.locator('#CurrentStudyRecord_NiRecruitmentSampleSize').fill('')
      await cpmsPage.locator('#CurrentStudyRecord_EnglandRecruitmentSampleSize').click()
      await cpmsPage.locator('#CurrentStudyRecord_PlannedRecruitmentStartDate').fill('12/06/2030')
      await cpmsPage.locator('#CurrentStudyRecord_PlannedRecruitmentEndDate').fill('25/12/2030')
    })

    await test.step(`And I save the study in CPMS`, async () => {
      await cpmsPage.locator('#btnSaveStudy').click()
      await cpmsPage.waitForTimeout(15000) // explicity as unable to await request on save
    })

    await test.step(`And I do not see any save errors`, async () => {
      await expect(cpmsPage.locator('#failuremessage')).not.toBeVisible
    })

    // close cpms context
    await cpmsPage.close()
    await cpmsContext.close()

    // use se sponsor contact context
    const seContext2 = await browser.newContext({ storageState: '.auth/sponsorContact.json' })
    const sePage2 = await seContext2.newPage()

    await test.step(`When I have navigated to the study details page for the Study with SE Id ${startingStudyId}`, async () => {
      await sePage2.goto(`studies/${startingStudyId}`)
      await expect(sePage2.locator('.govuk-inset-text')).toBeVisible()
    })

    await test.step(`Then I should see study details updated with my new values from CPMS`, async () => {
      const studyDetailTable = sePage2.locator('.govuk-table__body').first()
      const studyDetailPlannedOpen = studyDetailTable.locator('tr > td').nth(2)
      const studyDetailPlannedClose = studyDetailTable.locator('tr > td').nth(4)
      const studyDetailUkTarget = studyDetailTable.locator('tr > td').nth(6)

      await expect(studyDetailPlannedOpen).toHaveText('12 June 2030')
      await expect(studyDetailPlannedClose).toHaveText('25 December 2030')
      await expect(studyDetailUkTarget).toHaveText('10101')
    })

    // close se context
    await sePage2.close()
    await seContext2.close()
  })
})
