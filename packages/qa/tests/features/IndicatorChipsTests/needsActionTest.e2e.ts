import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'

const testUserId = 6
const startingOrgId = 12

let dueAssessmentCpmsId: number

let riskIndicatorCpmsId: number

let needsActionCpmsId: number

test.describe('Need Action Chip Logic - @se_315', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('As a Sponsor Contact I can see Needs Action for studies that are due assessment - @Se_315_AC3', async ({
    studiesPage,
  }) => {
    await seDatabaseReq(
      `UPDATE UserOrganisation SET organisationId = ${startingOrgId} WHERE userId = ${testUserId} AND isDeleted = 0`
    )
    const dueAssessmentQuery = `
      SELECT StudyOrganisation.studyId, Study.cpmsId, Study.dueAssessmentAt
      FROM UserOrganisation
      JOIN StudyOrganisation
        ON StudyOrganisation.organisationId = UserOrganisation.organisationId
      JOIN Study
        ON Study.id = StudyOrganisation.studyId
      WHERE UserOrganisation.userId = ${testUserId}
        AND UserOrganisation.organisationId = ${startingOrgId}
        AND Study.dueAssessmentAt IS NOT NULL
        AND UserOrganisation.isDeleted = 0
        AND StudyOrganisation.isDeleted = 0
        AND Study.isDeleted = 0
      ORDER BY RAND()
      LIMIT 1;
    `

    const response = await seDatabaseReq(dueAssessmentQuery)

    if (!response.length) {
      throw new Error(`No due assessment study found for userId ${testUserId} and organisationId ${startingOrgId}`)
    }

    dueAssessmentCpmsId = response[0].cpmsId

    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
    })

    await test.step('When I am on the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })

    await test.step('And I search for a study that is due Assessment', async () => {
      await studiesPage.enterSearchPhrase(dueAssessmentCpmsId.toString())
    })

    await test.step('Then I can see a Needs Action Chip', async () => {
      await studiesPage.assertNeedsActionChipDisplayed()
    })
  })

  test('As a Sponsor Contact I can see Needs Action for studies that are not due assessment but have specific risk indicators- @Se_315_AC3', async ({
    studiesPage,
  }) => {
    const needsActionQuery = `
  SELECT DISTINCT
    Study.id,
    Study.cpmsId,
    Study.dueAssessmentAt
  FROM UserOrganisation
  JOIN StudyOrganisation
    ON StudyOrganisation.organisationId = UserOrganisation.organisationId
  JOIN Study
    ON Study.id = StudyOrganisation.studyId
  JOIN StudyEvaluationCategory
    ON Study.id = StudyEvaluationCategory.studyId
  WHERE UserOrganisation.userId = ${testUserId}
    AND UserOrganisation.organisationId = ${startingOrgId}
    AND Study.dueAssessmentAt IS NULL
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

    const response = await seDatabaseReq(needsActionQuery)

    if (!response.length) {
      throw new Error(
        `No assessments found with correct risk indicators for userId ${testUserId} and organisationId ${startingOrgId}`
      )
    }

    riskIndicatorCpmsId = response[0].cpmsId

    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
    })

    await test.step('When I am on the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })

    await test.step('And I search for a study that is not due Assessment but has risk indicators other than, "No Recruitment in past 6 months", and "Recruiting at a lower rate than expected (RTT)" ', async () => {
      await studiesPage.enterSearchPhrase(riskIndicatorCpmsId.toString())
    })

    await test.step('Then I can see a Needs Action Chip', async () => {
      await studiesPage.assertNeedsActionChipDisplayed()
    })
  })

  test('As a Sponsor Contact I can see Needs Action for studies that are due assessment and has specific risk indicators- @Se_315_AC3', async ({
    studiesPage,
  }) => {
    const needsActionAndDueAssessmentQuery = `
  SELECT DISTINCT
    Study.id,
    Study.cpmsId,
    Study.dueAssessmentAt
  FROM UserOrganisation
  JOIN StudyOrganisation
    ON StudyOrganisation.organisationId = UserOrganisation.organisationId
  JOIN Study
    ON Study.id = StudyOrganisation.studyId
  JOIN StudyEvaluationCategory
    ON Study.id = StudyEvaluationCategory.studyId
  WHERE UserOrganisation.userId = ${testUserId}
    AND UserOrganisation.organisationId = ${startingOrgId}
    AND Study.dueAssessmentAt IS NOT NULL
    AND StudyEvaluationCategory.isDeleted = 0
    AND StudyEvaluationCategory.indicatorValue NOT IN (
      'Recruiting at a lower rate than expected (RTT)',
      'No Recruitment in past 6 months'
    )
    AND UserOrganisation.isDeleted = 0
    AND StudyOrganisation.isDeleted = 0
    AND Study.isDeleted = 0
  ORDER BY RAND()
  LIMIT 1;
`

    const response = await seDatabaseReq(needsActionAndDueAssessmentQuery)

    if (!response.length) {
      throw new Error(
        `No due assessment study found with risk indicators for ${testUserId} and organisationId ${startingOrgId}`
      )
    }

    needsActionCpmsId = response[0].cpmsId

    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
    })

    await test.step('When I am on the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })

    await test.step('And I search for a study that is due Assessment and has risk indicators other than, "No Recruitment in past 6 months", and "Recruiting at a lower rate than expected (RTT)" ', async () => {
      await studiesPage.enterSearchPhrase(needsActionCpmsId.toString())
    })

    await test.step('Then I can see a Needs Action Chip', async () => {
      await studiesPage.assertNeedsActionChipDisplayed()
    })
  })

  test('As a Sponsor Contact I should not see Needs Action for studies that are not due assessment and have no actionable risk indicators- @Se_315_AC3', async ({
    studiesPage,
  }) => {
    const noNeedsActionQuery = `
  SELECT DISTINCT
    Study.id,
    Study.cpmsId,
    Study.dueAssessmentAt
  FROM UserOrganisation
  JOIN StudyOrganisation
    ON StudyOrganisation.organisationId = UserOrganisation.organisationId
  JOIN Study
    ON Study.id = StudyOrganisation.studyId
  WHERE UserOrganisation.userId = ${testUserId}
    AND UserOrganisation.organisationId = ${startingOrgId}
    AND Study.dueAssessmentAt IS NULL
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
          'No Recruitment in past 6 months'
        )
    )
    AND NOT EXISTS (
      SELECT 1
      FROM StudyEvaluationCategory
      WHERE StudyEvaluationCategory.studyId = Study.id
        AND StudyEvaluationCategory.isDeleted = 0
        AND StudyEvaluationCategory.indicatorValue NOT IN (
          'Recruiting at a lower rate than expected (RTT)',
          'No Recruitment in past 6 months'
        )
    )
  ORDER BY RAND()
  LIMIT 1;
`

    const response = await seDatabaseReq(noNeedsActionQuery)

    if (!response.length) {
      throw new Error(
        `No assessment found that is not due assessment and has non-actionable indicator for ${testUserId} and organisationId ${startingOrgId}`
      )
    }

    needsActionCpmsId = response[0].cpmsId

    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
    })

    await test.step('When I am on the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })

    await test.step('And I search for a study that is not due Assessment and has risk indicators, "No Recruitment in past 6 months", or "Recruiting at a lower rate than expected (RTT)" ', async () => {
      await studiesPage.enterSearchPhrase(needsActionCpmsId.toString())
    })

    await test.step('Then I cannot see a Needs Action Chip', async () => {
      await studiesPage.assertNeedsActionChipNotDisplayed()
    })
  })

  test('As a Sponsor Contact I should see the total number of studies that need action- @Se_315_AC4', async ({
    studiesPage,
  }) => {
    const needsActionCountQuery = `
    SELECT COUNT(DISTINCT Study.id) AS needsActionCount
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
      AND (
        Study.dueAssessmentAt IS NOT NULL
        OR EXISTS (
          SELECT 1
          FROM StudyEvaluationCategory
          WHERE StudyEvaluationCategory.studyId = Study.id
            AND StudyEvaluationCategory.isDeleted = 0
           AND StudyEvaluationCategory.indicatorValue NOT IN (
              'Recruiting at a lower rate than expected (RTT)',
              'No Recruitment in past 6 months'
        )
      )
     );
  `
    const needsActionCountResponse = await seDatabaseReq(needsActionCountQuery)

    const needsActionCount = Number(needsActionCountResponse[0].needsActionCount)

    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
    })

    await test.step('When I am on the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })

    await test.step('Then the Needs Action banner count is correct', async () => {
      await studiesPage.assertNeedsActionBannerCount(needsActionCount)
    })

    await test.step('And the Studies Found label count is correct', async () => {
      await studiesPage.assertNeedsActionStudiesFoundBannerCount(needsActionCount)
    })
  })
})
