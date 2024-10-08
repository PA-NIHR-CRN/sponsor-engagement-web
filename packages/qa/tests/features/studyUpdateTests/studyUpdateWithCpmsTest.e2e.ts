import { RowDataPacket } from 'mysql2'
import { test, expect } from '../../../hooks/CustomFixtures'
import { seDatabaseReq, waitForSeDbRequest } from '../../../utils/DbRequests'

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
  test.skip('As a sponsor contact I can make proposed changed to the study data @se_185_proposed @wip', async ({
    browser,
  }) => {
    // use se sponsor contact context
    const seContext = await browser.newContext({ storageState: '.auth/sponsorContact.json' })
    const sePage = await seContext.newPage()

    await test.step(`Given I have navigated to the Update study data page for the Study with SE Id ${startingStudyId}`, async () => {
      await sePage.goto(`studies/${startingStudyId}/edit`)
      await expect(sePage.locator('.govuk-inset-text')).toBeVisible()
    })

    await test.step(`And I update the study details with proposed changes`, async () => {})

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

    await test.step(`And I save the study in CPMS`, async () => {
      await cpmsPage.locator('button', { hasText: 'EDIT' }).click()
    })

    await test.step(`Then I should not see any errors`, async () => {})

    // close cpms context
    await cpmsPage.close()
    await cpmsContext.close()
  })
})
