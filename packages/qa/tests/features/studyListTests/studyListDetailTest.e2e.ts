import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'

const testUserId = 6
const startingOrgId = 9

test.beforeAll('Setup Test Users', async () => {
  await seDatabaseReq(`UPDATE UserOrganisation SET organisationId = ${startingOrgId} WHERE userId = ${testUserId}`)
})

test.describe('Details on Study List Items - @se_22 @se_22_detail', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('I can see High Level Details about a Specific Study (first page) - @se_22_detail_ac3_first', async ({
    studiesPage,
  }) => {
    let studyListItemIndex: number = 0
    let studyIdFromList: string = ''
    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
      await studiesPage.assertOnStudiesPage()
    })
    await test.step('When I view a Study on the list', async () => {
      studyListItemIndex = await studiesPage.selectRandomStudyListItemIndex()
      studyIdFromList = await studiesPage.getStudyIdFromListViewButton(studyListItemIndex)
    })
    await test.step('Then the Study Title and Sponsor Organisation(s) match the Expected Values', async () => {
      await studiesPage.assertTitleAndSponsors(
        `SELECT Study.shortTitle, Organisation.name AS orgName, organisationRoleId 
            FROM StudyOrganisation
            INNER JOIN Study ON Study.id = StudyOrganisation.studyId
            INNER JOIN Organisation ON Organisation.id = StudyOrganisation.organisationId
            WHERE StudyOrganisation.studyId = ${studyIdFromList};`,
        studyListItemIndex
      )
    })
    await test.step('And the `Last sponsor assessment` matches the Expected Value', async () => {
      await studiesPage.assertLastAssessmentLbl(studyListItemIndex)
      await studiesPage.assertLastAssessmentValue(
        `SELECT statusId, createdAt FROM Assessment 
            WHERE studyId = ${studyIdFromList} ORDER BY createdAt desc LIMIT 1;`,
        studyListItemIndex
      )
    })
    await test.step('And the `Study data indicates` matches the Expected Value', async () => {
      await studiesPage.assertDataIndicatesLbl(studyListItemIndex)
      await studiesPage.assertDataIndicatesValue(
        `SELECT indicatorType FROM StudyEvaluationCategory 
            WHERE studyId = ${studyIdFromList};`,
        studyListItemIndex
      )
    })
  })

  test('I can see High Level Details about a Specific Study (last page) - @se_22_detail_ac3_last', async ({
    studiesPage,
  }) => {
    let studyListItemIndex: number = 0
    let studyIdFromList: string = ''
    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
    })
    await test.step('When I am on the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })
    await test.step('And I navigate to the Last Page of Results', async () => {
      await studiesPage.paginationPageList.locator('li').last().click()
      await studiesPage.assertPrevNextOptions('last')
    })
    await test.step('When I view a Study on the list', async () => {
      studyListItemIndex = await studiesPage.selectRandomStudyListItemIndex()
      studyIdFromList = await studiesPage.getStudyIdFromListViewButton(studyListItemIndex)
    })
    await test.step('Then the Study Title and Sponsor Organisation(s) match the Expected Values', async () => {
      await studiesPage.assertTitleAndSponsors(
        `SELECT Study.shortTitle, Organisation.name AS orgName, organisationRoleId 
            FROM StudyOrganisation
            INNER JOIN Study ON Study.id = StudyOrganisation.studyId
            INNER JOIN Organisation ON Organisation.id = StudyOrganisation.organisationId
            WHERE StudyOrganisation.studyId = ${studyIdFromList};`,
        studyListItemIndex
      )
    })
    await test.step('And the `Last sponsor assessment` matches the Expected Value', async () => {
      await studiesPage.assertLastAssessmentLbl(studyListItemIndex)
      await studiesPage.assertLastAssessmentValue(
        `SELECT statusId, createdAt FROM Assessment 
            WHERE studyId = ${studyIdFromList} ORDER BY createdAt desc LIMIT 1;`,
        studyListItemIndex
      )
    })
    await test.step('And the `Study data indicates` matches the Expected Value', async () => {
      await studiesPage.assertDataIndicatesLbl(studyListItemIndex)
      await studiesPage.assertDataIndicatesValue(
        `SELECT indicatorType FROM StudyEvaluationCategory 
            WHERE studyId = ${studyIdFromList} AND isDeleted = 0;`,
        studyListItemIndex
      )
    })
  })
})
