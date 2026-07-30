import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'

const testUserId = 6
const startingOrgId = 12

test.describe('Data Updates Required Chip Logic - @se_315', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('As a Sponsor Contact I can see Data Updates Required for studies that have risk indicators - @Se_315_AC2', async ({
    studiesPage,
  }) => {
    await seDatabaseReq(
      `UPDATE UserOrganisation SET organisationId = ${startingOrgId} WHERE userId = ${testUserId} AND isDeleted = 0`
    )
    const dataUpdatesRequiredQuery = `
  SELECT DISTINCT
    Study.id,
    Study.cpmsId
  FROM UserOrganisation
  JOIN StudyOrganisation
    ON StudyOrganisation.organisationId = UserOrganisation.organisationId
  JOIN Study
    ON Study.id = StudyOrganisation.studyId
  JOIN StudyEvaluationCategory
    ON Study.id = StudyEvaluationCategory.studyId
  WHERE UserOrganisation.userId = ${testUserId}
    AND UserOrganisation.organisationId = ${startingOrgId}
    AND StudyEvaluationCategory.isDeleted = 0
    AND StudyEvaluationCategory.indicatorValue NOT IN (
      'Recruiting at a lower rate than expected (RTT)',
      'No recruitment in past 6 months'
    )
    AND UserOrganisation.isDeleted = 0
    AND StudyOrganisation.isDeleted = 0
    AND Study.isDeleted = 0
  ORDER BY RAND()
  LIMIT 1;
`
    const response = await seDatabaseReq(dataUpdatesRequiredQuery)

    if (!response.length) {
      throw new Error(
        `No study with qualifying risk indicators found for userId ${testUserId} and organisationId ${startingOrgId}`
      )
    }

    const cpmsId = response[0].cpmsId

    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
    })

    await test.step('When I am on the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })

    await test.step('And I search for a study that has actionable risk indicators', async () => {
      await studiesPage.enterSearchPhrase(cpmsId.toString())
    })

    await test.step('Then I can see a Data Updates Required Chip', async () => {
      await studiesPage.assertDataUpdatesRequiredChipDisplayed()
    })
  })

  test('As a Sponsor Contact I cannot see Data Updates Required when only performance risk indicators are present - @Se_315_AC2', async ({
    studiesPage,
  }) => {
    const noDataUpdatesRequiredQuery = `
    SELECT DISTINCT
      Study.id,
      Study.cpmsId
    FROM UserOrganisation
    JOIN StudyOrganisation
      ON StudyOrganisation.organisationId = UserOrganisation.organisationId
    JOIN Study
      ON Study.id = StudyOrganisation.studyId
    WHERE UserOrganisation.userId = ${testUserId}
      AND UserOrganisation.organisationId = ${startingOrgId}
      AND UserOrganisation.isDeleted = 0
      AND StudyOrganisation.isDeleted = 0
      AND Study.isDeleted = 0
      AND EXISTS (
        SELECT 1
        FROM StudyEvaluationCategory
        WHERE StudyEvaluationCategory.studyId = Study.id
          AND StudyEvaluationCategory.isDeleted = 0
          AND StudyEvaluationCategory.indicatorValue IN (
            'Recruiting at a lower rate than expected (RTT)',
            'No recruitment in past 6 months'
          )
      )
      AND NOT EXISTS (
        SELECT 1
        FROM StudyEvaluationCategory
        WHERE StudyEvaluationCategory.studyId = Study.id
          AND StudyEvaluationCategory.isDeleted = 0
          AND StudyEvaluationCategory.indicatorValue NOT IN (
            'Recruiting at a lower rate than expected (RTT)',
            'No recruitment in past 6 months'
          )
      )
    ORDER BY RAND()
    LIMIT 1;
  `

    const response = await seDatabaseReq(noDataUpdatesRequiredQuery)

    if (!response.length) {
      throw new Error(
        `No study found with only performance risk indicators for userId ${testUserId} and organisationId ${startingOrgId}`
      )
    }

    const cpmsId = response[0].cpmsId

    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
    })

    await test.step('When I am on the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })

    await test.step('And I search for a study that only has performance risk indicators', async () => {
      await studiesPage.enterSearchPhrase(cpmsId.toString())
    })

    await test.step('Then I cannot see a Data Updates Required Chip', async () => {
      await studiesPage.assertDataUpdatesRequiredChipNotDisplayed()
    })
  })
})
