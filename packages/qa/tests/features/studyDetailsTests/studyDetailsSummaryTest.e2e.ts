import { RowDataPacket } from 'mysql2'
import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'
import { getStudyEngagementInfo } from '../../../utils/ApiRequests'

const testUserId = 6
const startingOrgId = 9
const nonCommOrgId = 21
let startingStudyId = 0
let nonCommStudyId = 0
let croCtuOrgRelationshipStudyId = 0
let studyProgressDetails: RowDataPacket[]
let nonCommStudyProgressDetails: RowDataPacket[]
let croCtuStudySponsorName: RowDataPacket[]
let croCtuStudyCroCtuName: RowDataPacket[]
let getStudyResponse: JSON
//Must ensure that specific SE study Id's below remain in the SE Tool on Test
const nullValuesStudyId = 17103
const noConcernsStudyId = 17122
const estimatedReopenStudyId = 10692

test.beforeAll('Setup Tests', async () => {
  await seDatabaseReq(`UPDATE UserOrganisation SET organisationId = ${startingOrgId} WHERE userId = ${testUserId}`)
  const randomStudyIdSelected = await seDatabaseReq(`SELECT Study.id FROM Study 
    INNER JOIN StudyOrganisation
    ON Study.id = StudyOrganisation.studyId
    WHERE StudyOrganisation.organisationId = ${startingOrgId} AND StudyOrganisation.isDeleted = 0 AND Study.isDeleted = 0
    ORDER BY RAND() LIMIT 1;`)
  startingStudyId = randomStudyIdSelected[0].id

  studyProgressDetails =
    await seDatabaseReq(`SELECT studyStatus, Study.plannedOpeningDate, Study.actualOpeningDate, Study.plannedClosureDate, Study.cpmsId,
    Study.actualClosureDate, Study.sampleSize, Study.totalRecruitmentToDate, StudyEvaluationCategory.indicatorValue, StudyEvaluationCategory.isDeleted 
    FROM Study 
    LEFT JOIN StudyEvaluationCategory
    ON StudyEvaluationCategory.studyId = Study.id
    WHERE Study.id = ${startingStudyId};`)

  const randomNonCommStudyIdSelected = await seDatabaseReq(`SELECT Study.id FROM Study 
    INNER JOIN StudyOrganisation
    ON Study.id = StudyOrganisation.studyId
    WHERE StudyOrganisation.organisationId = ${nonCommOrgId} AND Study.route LIKE '%Non-commercial%' AND StudyOrganisation.isDeleted = 0 AND Study.isDeleted = 0
    ORDER BY RAND() LIMIT 1;`)
  nonCommStudyId = randomNonCommStudyIdSelected[0].id

  nonCommStudyProgressDetails =
    await seDatabaseReq(`SELECT studyStatus, Study.route, Study.sampleSize, Study.totalRecruitmentToDate
    FROM Study WHERE Study.id = ${nonCommStudyId};`)

  const randomCroCtuStudyIdSelected = await seDatabaseReq(`SELECT DISTINCT studyId FROM StudyOrganisation
  INNER JOIN Study ON Study.id = StudyOrganisation.studyId
  WHERE StudyOrganisation.organisationId = ${startingOrgId} AND StudyOrganisation.organisationRoleId = 1 AND StudyOrganisation.isDeleted = 0
  AND studyId in (SELECT DISTINCT studyId FROM StudyOrganisation 
  WHERE ((StudyOrganisation.organisationRoleId = 3 OR StudyOrganisation.organisationRoleId = 4) AND StudyOrganisation.isDeleted = 0))
  AND Study.isDeleted = 0
  ORDER BY RAND() LIMIT 1;`)
  croCtuOrgRelationshipStudyId = randomCroCtuStudyIdSelected[0].studyId

  croCtuStudySponsorName = await seDatabaseReq(`SELECT Organisation.name FROM Organisation
    INNER JOIN StudyOrganisation
    ON StudyOrganisation.organisationId = Organisation.id
    WHERE StudyOrganisation.studyId = ${croCtuOrgRelationshipStudyId}
    AND StudyOrganisation.organisationRoleId = 1;`)

  croCtuStudyCroCtuName = await seDatabaseReq(`SELECT Organisation.name FROM Organisation
    INNER JOIN StudyOrganisation
    ON StudyOrganisation.organisationId = Organisation.id
    WHERE StudyOrganisation.studyId = ${croCtuOrgRelationshipStudyId}
    AND StudyOrganisation.organisationRoleId IN (3,4);`)

  getStudyResponse = await getStudyEngagementInfo(studyProgressDetails[0].cpmsId)
})

test.describe('Access Study Details Page and view Summary - @se_26', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('As a Sponsor I can access the Study Details page  - @se_26_ac1, @se_180_ac3, @se_181_ac3', async ({
    studiesPage,
    studyDetailsPage,
  }) => {
    let studyListItemToClick: number
    let studyIdSelected: string = ''
    let studyDetails: RowDataPacket[]

    await test.step(`Given I have navigated to the Study List Page`, async () => {
      await studiesPage.goto()
      await studiesPage.assertOnStudiesPage()
    })
    await test.step(`When I click the View Study button of any Study on the Study List`, async () => {
      studyListItemToClick = await studiesPage.selectRandomStudyListItemIndex()
      studyIdSelected = await studiesPage.getStudyIdFromListViewButton(studyListItemToClick)
      studyDetails = await seDatabaseReq(`SELECT Study.shortTitle, Organisation.name AS sponsorName FROM Study
            INNER JOIN StudyOrganisation
            ON StudyOrganisation.studyId = Study.id 
            INNER JOIN Organisation
            ON StudyOrganisation.organisationId = Organisation.id 
            WHERE Study.id = ${studyIdSelected} AND StudyOrganisation.organisationRoleId = 1;`)
      studiesPage.viewStudyButton.nth(studyListItemToClick).click()
    })
    await test.step(`Then I am taken to the Details page for Study with SE Id ${studyIdSelected}`, async () => {
      await studyDetailsPage.assertOnStudyDetailsPage(studyIdSelected)
    })
    await test.step('And the Page Title is the Study Short Title', async () => {
      await studyDetailsPage.assertStudyShortTitle(studyDetails[0].shortTitle)
    })
    await test.step('And I can see Study Sponsor beneath the Study Short Title', async () => {
      await studyDetailsPage.assertStudySponsorSubTitle(studyDetails[0].sponsorName)
    })
    await test.step('And I am shown Introductory Guidance Text for the Details Page', async () => {
      await studyDetailsPage.assertGuidanceText()
    })
  })

  test('The Study Details page displays the Sponsor and any CRO/CTU Names in Page Sub-Title - @se_26_subtitle', async ({
    studyDetailsPage,
  }) => {
    await test.step(`Given I have navigated to the Study Details Page for the Study with SE Id ${croCtuOrgRelationshipStudyId}`, async () => {
      await studyDetailsPage.goto(croCtuOrgRelationshipStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(croCtuOrgRelationshipStudyId.toString())
    })
    await test.step('When I can see Study Sponsor beneath the Study Short Title', async () => {
      await studyDetailsPage.assertStudySponsorSubTitle(croCtuStudySponsorName[0].name)
    })
    await test.step('Then I can see the CRO/CTU displayed in Brackets alongside the Sponsor', async () => {
      await studyDetailsPage.assertStudyCroCtuSubTitle(croCtuStudyCroCtuName[0].name)
    })
  })

  test('As a Sponsor I can see the Summary of study’s progress (UK) of a Specific Study - @se_26_ac2, @se_181_ac4', async ({
    studyDetailsPage,
  }) => {
    await test.step(`Given I have navigated to the Study Details Page for a Commercial Study with SE Id ${startingStudyId}`, async () => {
      await studyDetailsPage.goto(startingStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(startingStudyId.toString())
    })
    await test.step(`When I view the Section titled 'Summary of study’s progress (UK)'`, async () => {
      await studyDetailsPage.assertProgressSummarySectionPresent()
      await studyDetailsPage.assertProgressSummarySectionSubtitle()
    })
    await test.step('Then I can see the Studies Status', async () => {
      await studyDetailsPage.assertStudyStatus(getStudyResponse.StudyStatus)
    })
    await test.step('And I can see the latest Study Data Indicators', async () => {
      await studyDetailsPage.assertDataIndicators(studyProgressDetails)
    })
    await test.step('And I can see the Studies Planned Opening Date', async () => {
      await studyDetailsPage.assertPlannedOpeningDate(studyProgressDetails)
    })
    await test.step('And I can see the Studies Actual Opening Date', async () => {
      await studyDetailsPage.assertActualOpeningDate(studyProgressDetails)
    })
    await test.step('And I can see the Studies Planned Closure Date', async () => {
      await studyDetailsPage.assertPlannedClosureDate(studyProgressDetails)
    })
    await test.step('And I can see the Studies Actual Closure Date', async () => {
      await studyDetailsPage.assertActualClosureDate(studyProgressDetails)
    })
    await test.step('And I can see the Studies UK Recruitment Target', async () => {
      await studyDetailsPage.assertUkTarget(studyProgressDetails[0].sampleSize, studyProgressDetails[0].route)
    })
    await test.step('And I can see the Studies UK Recruitment Total', async () => {
      await studyDetailsPage.assertUkTotal(studyProgressDetails[0].totalRecruitmentToDate)
    })
  })

  test('`This study is progressing as planned` displays when Study has No Concerns - @se_26_noConcerns', async ({
    studyDetailsPage,
  }) => {
    const noConcernsStudyDetails =
      await seDatabaseReq(`SELECT studyStatus, StudyEvaluationCategory.indicatorValue, StudyEvaluationCategory.isDeleted 
    FROM Study 
    LEFT JOIN StudyEvaluationCategory
    ON StudyEvaluationCategory.studyId = Study.id
    WHERE Study.id = ${noConcernsStudyId} AND StudyEvaluationCategory.isDeleted = 0;`)
    await test.step(`Given I have navigated to the Study Details Page for the Study with SE Id ${noConcernsStudyId}`, async () => {
      await studyDetailsPage.goto(noConcernsStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(noConcernsStudyId.toString())
    })
    await test.step(`When I view the Section titled 'Summary of study’s progress (UK)'`, async () => {
      await studyDetailsPage.assertProgressSummarySectionPresent()
      await studyDetailsPage.assertProgressSummarySectionSubtitle()
    })
    await test.step(`And the study has No Concerns`, async () => {
      await studyDetailsPage.checkStudyHasNoConcerns(noConcernsStudyDetails)
    })
    await test.step('Then I can see that Study data indicates `This study is progressing as planned`', async () => {
      await studyDetailsPage.assertDataIndicators(noConcernsStudyDetails)
    })
  })

  test('A `-` Icon is Displayed in Place of NULL Values, where Applicable - @se_26_nullValues', async ({
    studyDetailsPage,
  }) => {
    const nullStudyProgressValues =
      await seDatabaseReq(`SELECT Study.actualOpeningDate, Study.actualClosureDate, Study.sampleSize 
    FROM Study WHERE Study.id = ${nullValuesStudyId};`)
    await test.step(`Given I have navigated to the Study Details Page for a Commercial Study with SE Id ${nullValuesStudyId}`, async () => {
      await studyDetailsPage.goto(nullValuesStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(nullValuesStudyId.toString())
    })
    await test.step(`When I view the Section titled 'Summary of study’s progress (UK)'`, async () => {
      await studyDetailsPage.assertProgressSummarySectionPresent()
      await studyDetailsPage.assertProgressSummarySectionSubtitle()
    })
    await test.step(`And the study has NULL Values for Recruitment and Date fields`, async () => {
      await studyDetailsPage.checkStudyHasNullValues(nullStudyProgressValues)
    })
    await test.step('Then I can see the Studies Actual Opening Date has a `-` icon', async () => {
      await studyDetailsPage.assertActualOpeningDate(nullStudyProgressValues)
    })
    await test.step('And I can see the Studies Actual Closure Date has a `-` icon', async () => {
      await studyDetailsPage.assertActualClosureDate(nullStudyProgressValues)
    })
    await test.step('And I can see the Studies UK Recruitment Target has a `-` icon', async () => {
      await studyDetailsPage.assertUkTarget(nullStudyProgressValues[0].sampleSize, studyProgressDetails[0].route)
    })
  })

  test('Estimated reopening date is only Displayed for Suspended Studies - @se_26_estimated', async ({
    studyDetailsPage,
  }) => {
    const estimatedStudyProgressValues =
      await seDatabaseReq(`SELECT Study.studyStatus, Study.route, StudyEvaluationCategory.expectedReopenDate
    FROM Study 
    LEFT JOIN StudyEvaluationCategory
    ON StudyEvaluationCategory.studyId = Study.id
    WHERE Study.id = ${estimatedReopenStudyId};`)
    await test.step(`Given I have navigated to the Study Details Page for a Suspended Study with SE Id ${estimatedReopenStudyId}`, async () => {
      await studyDetailsPage.goto(estimatedReopenStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(estimatedReopenStudyId.toString())
    })
    await test.step(`When I view the Section titled 'Summary of study’s progress (UK)'`, async () => {
      await studyDetailsPage.assertProgressSummarySectionPresent()
      await studyDetailsPage.assertProgressSummarySectionSubtitle()
    })
    await test.step('And the Studies Status is Suspended', async () => {
      await studyDetailsPage.assertStudyStatusSuspended(estimatedStudyProgressValues[0].studyStatus)
    })
    await test.step('Then I can see the Studies Estimated Reopening Date', async () => {
      await studyDetailsPage.assertEstimatedReopenDatePresent(estimatedStudyProgressValues)
    })
    await test.step(`Given I have navigated to the Study Details Page for a Non-Suspended Study with SE Id ${noConcernsStudyId}`, async () => {
      await studyDetailsPage.goto(noConcernsStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(noConcernsStudyId.toString())
    })
    await test.step(`When I view the Section titled 'Summary of study’s progress (UK)'`, async () => {
      await studyDetailsPage.assertProgressSummarySectionPresent()
      await studyDetailsPage.assertProgressSummarySectionSubtitle()
    })
    await test.step('Then I cannot see the Studies Estimated Reopening Date', async () => {
      await studyDetailsPage.assertEstimatedReopenDateNotPresent()
    })
  })

  test('As a Sponsor I see UK Recruitment data for Non-Commercial Studies - @se_26_ukRecruit', async ({
    studyDetailsPage,
  }) => {
    await seDatabaseReq(`UPDATE UserOrganisation SET organisationId = ${nonCommOrgId} WHERE userId = ${testUserId}`)
    await test.step(`Given I have navigated to the Study Details Page for a Non-Commercial Study with SE Id ${nonCommStudyId}`, async () => {
      await studyDetailsPage.goto(nonCommStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(nonCommStudyId.toString())
    })
    await test.step(`When I view the Section titled 'Summary of study’s progress (UK)'`, async () => {
      await studyDetailsPage.assertProgressSummarySectionPresent()
      await studyDetailsPage.assertProgressSummarySectionSubtitle()
    })
    await test.step(`And the Study is Non-Commercial`, async () => {
      await studyDetailsPage.assertStudyRoute('Non-Commercial', nonCommStudyProgressDetails[0].route)
    })
    await test.step('Then I can see the Studies Network Recruitment Target', async () => {
      await studyDetailsPage.assertUkTarget(
        nonCommStudyProgressDetails[0].sampleSize,
        nonCommStudyProgressDetails[0].route
      )
    })
    await test.step('And I can see the Studies Network Recruitment Total', async () => {
      await studyDetailsPage.assertUkTotal(nonCommStudyProgressDetails[0].totalRecruitmentToDate)
    })
  })
})
