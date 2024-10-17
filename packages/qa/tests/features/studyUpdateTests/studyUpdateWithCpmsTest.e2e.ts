import { RowDataPacket } from 'mysql2'
import { test, expect } from '../../../hooks/CustomFixtures'
import { seDatabaseReq, waitForSeDbRequest } from '../../../utils/DbRequests'
import { convertIsoDateToDisplayDateV2, splitIsoDate } from '../../../utils/UtilFunctions'

const testUserId = 6
const startingOrgId = 2
const timeStamp = new Date().toISOString()
let uniqueTarget = new Date().toISOString().slice(11, 19).replace(/:/g, '')
if (uniqueTarget.startsWith('0')) {
  uniqueTarget = uniqueTarget.slice(1)
}

let startingStudyId = 0
let studyCoreDetails: RowDataPacket[]

const plannedOpen = '2025-06-12'
const plannedClose = '2027-06-12'
const po = splitIsoDate(plannedOpen)
const pc = splitIsoDate(plannedClose)
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
})

// note: this test is cumbersome due to the page object model not playing well with multiple auth user roles roles
test.describe('Sponsor engagement study update with CPMS study validation @se_to_cpms', () => {
  test.describe.configure({ timeout: 99000 }) // generous timeout as CPMS is slow!

  test('direct SE change with CPMS validation @se_to_cpms_1', async ({ browser }) => {
    await seDatabaseReq(`
      DELETE FROM sponsorengagement.StudyUpdates WHERE studyId = ${startingStudyId};
    `) // reset test data

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

    await test.step(`And I see that my changes have been saved as direct changes`, async () => {
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

      await cpmsPage.goto(`https://test.cpms.crncc.nihr.ac.uk/Base/StudyRecord/Edit/${id}?selectedTab=1`)
      await expect(cpmsPage.locator('.breadcrumbs')).toBeVisible()
      await expect(cpmsPage.locator('.breadcrumbs')).toContainText(`CPMS ID: ${id}`)
    })

    await test.step(`And I see my expected study details in CPMS`, async () => {
      await expect(cpmsPage.locator('#CurrentStudyRecord_UkRecruitmentSampleSize')).toHaveValue(uniqueTarget)
      await expect(cpmsPage.locator('#CurrentStudyRecord_PlannedRecruitmentStartDate')).toHaveAttribute(
        'value',
        // /12\/06\/2025/
        new RegExp(`${po.d}\/${po.m}\/${po.y}`)
      )
      await expect(cpmsPage.locator('#CurrentStudyRecord_PlannedRecruitmentEndDate')).toHaveAttribute(
        'value',
        // /12\/06\/2027/
        new RegExp(`${pc.d}\/${pc.m}\/${pc.y}`)
      )
    })

    await test.step(`And I save the study in CPMS`, async () => {
      await cpmsPage.locator('#btnSaveStudy').click()
      await cpmsPage.waitForTimeout(15000) // explicity as unable to await request on save
    })

    await test.step(`Then I should not see any save errors`, async () => {
      await expect(cpmsPage.locator('#failuremessage')).not.toBeVisible
    })

    // close cpms context
    await cpmsPage.close()
    await cpmsContext.close()
  })

  test.skip('proposed SE change with CPMS validation', async ({ browser }) => {
    await seDatabaseReq(`
      DELETE FROM sponsorengagement.StudyUpdates WHERE studyId = ${startingStudyId};
    `) // reset test data

    // use se sponsor contact context
    const seContext = await browser.newContext({ storageState: '.auth/sponsorContact.json' })
    const sePage = await seContext.newPage()

    await test.step(`Given I have navigated to the Update study data page for the Study with SE Id ${startingStudyId}`, async () => {
      await sePage.goto(`studies/${startingStudyId}/edit`)
      await expect(sePage.locator('.govuk-inset-text')).toBeVisible()
    })

    await test.step(`And I update the study details with proposed changes`, async () => {
      async function fillStudyDates(dateType: string, dd: string, mm: string, yyyy: string) {
        await sePage.locator(`#${dateType}Date-day`).fill(dd)
        await sePage.locator(`#${dateType}Date-month`).fill(mm)
        await sePage.locator(`#${dateType}Date-year`).fill(yyyy)
      }

      // await sePage.locator('#status-3').click()
      await fillStudyDates('plannedOpening', '12', '06', '2025')
      await fillStudyDates('actualOpening', '12', '06', '2024')
      await fillStudyDates('plannedClosure', '12', '06', '2027')
      await fillStudyDates('actualClosure', '12', '06', '2024')
      await sePage.locator('#recruitmentTarget').fill(uniqueTarget)
      await sePage.locator('#furtherInformation').fill(`se e2e auto test - ${timeStamp}`)
      await sePage.locator('button.govuk-button:has-text("Update")').click()
      await expect(sePage.locator('.govuk-warning-text__text')).toHaveText(
        'It may take a few seconds for the record to update. Please stay on this page until redirected.'
      )
    })

    await test.step(`And I see the study is successfully updated in SE`, async () => {
      const dbStudyUpdate = await waitForSeDbRequest(
        `SELECT * FROM sponsorengagement.StudyUpdates WHERE studyId = ${startingStudyId} ORDER by createdAt LIMIT 2;`
      )

      await expect(sePage.locator('.govuk-notification-banner__heading')).toHaveText(
        'Your study data changes have been accepted.'
      )

      await expect(dbStudyUpdate[1].studyStatus).toBeNull()
      await expect(dbStudyUpdate[1].comment).toBe(`se e2e auto test - ${timeStamp}`)
      await expect(dbStudyUpdate[1].studyStatusGroup).toBe('Closed')
    })

    // close se context
    await sePage.close()
    await seContext.close()

    // use cpms npm context
    const cpmsContext = await browser.newContext({ storageState: '.auth/nationalPortfolioManager.json' })
    const cpmsPage = await cpmsContext.newPage()

    await test.step(`When I navigate to the edit view for the study in CPMS`, async () => {
      const id = studyCoreDetails[0].cpmsId

      await cpmsPage.goto(`https://test.cpms.crncc.nihr.ac.uk/Base/StudyRecord/Edit/${id}?selectedTab=1`)
      await expect(cpmsPage.locator('.breadcrumbs')).toBeVisible()
      await expect(cpmsPage.locator('.breadcrumbs')).toContainText(`CPMS ID: ${id}`)
    })

    await test.step(`And I see my expected study details in CPMS`, async () => {
      await expect(cpmsPage.locator('#CurrentStudyRecord_UkRecruitmentSampleSize')).toHaveValue(uniqueTarget)
      await expect(cpmsPage.locator('#CurrentStudyRecord_PlannedRecruitmentStartDate')).toHaveAttribute(
        'value',
        /12\/06\/2025/
      )
      await expect(cpmsPage.locator('#CurrentStudyRecord_ActualOpeningDate')).toHaveAttribute('value', /12\/06\/2024/)
      await expect(cpmsPage.locator('#CurrentStudyRecord_PlannedRecruitmentEndDate')).toHaveAttribute(
        'value',
        /12\/06\/2022/
      )
      await expect(cpmsPage.locator('#CurrentStudyRecord_ActualRecruitmentEndDate')).toHaveAttribute(
        'value',
        /12\/06\/2025/
      )
    })

    await test.step(`And I save the study in CPMS`, async () => {
      await cpmsPage.locator('#btnSaveStudy').click()
      await cpmsPage.waitForTimeout(15000) // unable to await request on save
    })

    await test.step(`Then I should not see any save errors`, async () => {
      await expect(cpmsPage.locator('#failuremessage')).not.toBeVisible
    })

    // close cpms context
    await cpmsPage.close()
    await cpmsContext.close()
  })
})
