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
    let getStudyInCpms: JSON

    await test.step(`Given I have navigated to the Study List Page`, async () => {
      await studiesPage.goto()
      await studiesPage.assertOnStudiesPage()
    })
    await test.step(`When I click the View Study button of any Study on the Study List`, async () => {
      studyListItemToClick = await studiesPage.selectRandomStudyListItemIndex()
      studyIdSelected = await studiesPage.getStudyIdFromListViewButton(studyListItemToClick)
      studiesPage.viewStudyButton.nth(studyListItemToClick).click()

      studyDetails = await seDatabaseReq(`
        SELECT cpmsId FROM sponsorengagement.Study where id = ${studyIdSelected};`)
      getStudyInCpms = await getStudyEngagementInfo(studyDetails[0].cpmsId)
    })
    await test.step(`Then I am taken to the Details page for Study with SE Id ${studyIdSelected}`, async () => {
      await studyDetailsPage.assertOnStudyDetailsPage(studyIdSelected)
    })
    await test.step('And the Page Title is the Study Short Title', async () => {
      await studyDetailsPage.assertStudyShortTitleV2(getStudyInCpms.ShortName)
    })
    await test.step('And I can see Study Sponsor beneath the Study Short Title', async () => {
      await studyDetailsPage.assertStudySponsorSubTitleV2(getStudyInCpms.StudySponsors)
    })
    await test.step('And I am shown Introductory Guidance Text for the Details Page', async () => {
      await studyDetailsPage.assertGuidanceText()
    })
  })

  test('The Study Details page displays the Sponsor and any CRO/CTU Names in Page Sub-Title - @se_26_subtitle', async ({
    studyDetailsPage,
  }) => {
    const studyDetails = await seDatabaseReq(`
      SELECT cpmsId FROM sponsorengagement.Study where id = ${croCtuOrgRelationshipStudyId};`)
    const getStudyInCpms = await getStudyEngagementInfo(studyDetails[0].cpmsId)

    await test.step(`Given I have navigated to the Study Details Page for the Study with SE Id ${croCtuOrgRelationshipStudyId}`, async () => {
      await studyDetailsPage.goto(croCtuOrgRelationshipStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(croCtuOrgRelationshipStudyId.toString())
    })
    await test.step('Then I can see Study Sponsor beneath the Study Short Title including the CRO/CTU in Brackets', async () => {
      await studyDetailsPage.assertStudySponsorSubTitleV2(getStudyInCpms.StudySponsors)
    })
  })

  test('As a Sponsor I can see the Summary of study’s progress (UK) of a Specific Study - @se_26_ac2, @se_181_ac4', async ({
    studyDetailsPage,
  }) => {
    const getStudyInCpms = await getStudyEngagementInfo(studyProgressDetails[0].cpmsId)

    await test.step(`Given I have navigated to the Study Details Page for a Commercial Study with SE Id ${startingStudyId}`, async () => {
      await studyDetailsPage.goto(startingStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(startingStudyId.toString())
    })
    await test.step(`When I view the Section titled 'Summary of study’s progress (UK)'`, async () => {
      await studyDetailsPage.assertProgressSummarySectionPresent()
      await studyDetailsPage.assertProgressSummarySectionSubtitle()
    })
    await test.step('Then I can see the Studies Status', async () => {
      await studyDetailsPage.assertStudyStatus(getStudyInCpms.StudyStatus)
    })
    await test.step('And I can see the latest Study Data Indicators', async () => {
      await studyDetailsPage.assertDataIndicatorsV2(getStudyInCpms.StudyEvaluationCategories)
    })
    await test.step('And I can see the Studies Planned Opening Date', async () => {
      await studyDetailsPage.assertPlannedOpeningDateV2(getStudyInCpms.PlannedOpeningDate)
    })
    await test.step('And I can see the Studies Actual Opening Date', async () => {
      await studyDetailsPage.assertActualOpeningDateV2(getStudyInCpms.ActualOpeningDate)
    })
    await test.step('And I can see the Studies Planned Closure Date', async () => {
      await studyDetailsPage.assertPlannedClosureDateV2(getStudyInCpms.PlannedClosureToRecruitmentDate)
    })
    await test.step('And I can see the Studies Actual Closure Date', async () => {
      await studyDetailsPage.assertActualClosureDateV2(getStudyInCpms.ActualClosureDate)
    })
    await test.step('And I can see the Studies UK Recruitment Target', async () => {
      await studyDetailsPage.assertUkTarget(getStudyInCpms.SampleSize, getStudyInCpms.StudyRoute)
    })
    await test.step('And I can see the Studies UK Recruitment Total', async () => {
      await studyDetailsPage.assertUkTotal(getStudyInCpms.TotalRecruitmentToDate, getStudyInCpms.StudyRoute)
    })
  })

  test('`This study is progressing as planned` displays when Study has No Concerns - @se_26_noConcerns', async ({
    studyDetailsPage,
  }) => {
    const noConcernsStudyDetails = await seDatabaseReq(`
      SELECT cpmsId FROM sponsorengagement.Study where id = ${noConcernsStudyId};`)
    const getStudyInCpms = await getStudyEngagementInfo(noConcernsStudyDetails[0].cpmsId)

    await test.step(`Given I have navigated to the Study Details Page for the Study with SE Id ${noConcernsStudyId}`, async () => {
      await studyDetailsPage.goto(noConcernsStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(noConcernsStudyId.toString())
    })
    await test.step(`When I view the Section titled 'Summary of study’s progress (UK)'`, async () => {
      await studyDetailsPage.assertProgressSummarySectionPresent()
      await studyDetailsPage.assertProgressSummarySectionSubtitle()
    })
    await test.step('Then I can see that Study data indicates `This study is progressing as planned`', async () => {
      await studyDetailsPage.assertDataIndicatorsV2(getStudyInCpms.StudyEvaluationCategories)
    })
  })

  test('A `-` Icon is Displayed in Place of NULL Values, where Applicable - @se_26_nullValues', async ({
    studyDetailsPage,
  }) => {
    const nullValuesStudyDetails = await seDatabaseReq(`
      SELECT cpmsId FROM sponsorengagement.Study where id = ${nullValuesStudyId};`)
    const getStudyInCpms = await getStudyEngagementInfo(nullValuesStudyDetails[0].cpmsId)

    await test.step(`Given I have navigated to the Study Details Page for a Commercial Study with SE Id ${nullValuesStudyId}`, async () => {
      await studyDetailsPage.goto(nullValuesStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(nullValuesStudyId.toString())
    })
    await test.step(`When I view the Section titled 'Summary of study’s progress (UK)'`, async () => {
      await studyDetailsPage.assertProgressSummarySectionPresent()
      await studyDetailsPage.assertProgressSummarySectionSubtitle()
    })
    await test.step(`And the study has NULL Values for Recruitment and Date fields`, async () => {
      await studyDetailsPage.checkStudyHasNullValues(
        getStudyInCpms.ActualOpeningDate,
        getStudyInCpms.ActualClosureDate,
        getStudyInCpms.SampleSize
      )
    })
    await test.step('Then I can see the Studies Actual Opening Date has a `-` icon', async () => {
      await studyDetailsPage.assertActualOpeningDateV2(getStudyInCpms.ActualOpeningDate)
    })
    await test.step('And I can see the Studies Actual Closure Date has a `-` icon', async () => {
      await studyDetailsPage.assertActualClosureDateV2(getStudyInCpms.ActualClosureDate)
    })
    await test.step('And I can see the Studies UK Recruitment Target has a `-` icon', async () => {
      await studyDetailsPage.assertUkTarget(getStudyInCpms.SampleSize, getStudyInCpms.StudyRoute)
    })
  })

  test('Estimated reopening date is only Displayed for Suspended Studies - @se_26_estimated', async ({
    studyDetailsPage,
  }) => {
    const estimatedStudyDetails = await seDatabaseReq(`
      SELECT cpmsId FROM sponsorengagement.Study where id = ${estimatedReopenStudyId};`)
    const getStudyInCpms = await getStudyEngagementInfo(estimatedStudyDetails[0].cpmsId)

    await test.step(`Given I have navigated to the Study Details Page for a Suspended Study with SE Id ${estimatedReopenStudyId}`, async () => {
      await studyDetailsPage.goto(estimatedReopenStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(estimatedReopenStudyId.toString())
    })
    await test.step(`When I view the Section titled 'Summary of study’s progress (UK)'`, async () => {
      await studyDetailsPage.assertProgressSummarySectionPresent()
      await studyDetailsPage.assertProgressSummarySectionSubtitle()
    })
    await test.step('And the Studies Status is Suspended', async () => {
      await studyDetailsPage.assertStudyStatusSuspended(getStudyInCpms.StudyStatus)
    })
    await test.step('Then I can see the Studies Estimated Reopening Date', async () => {
      await studyDetailsPage.assertEstimatedReopenDateV2(getStudyInCpms.EstimatedReopeningDate)
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
    const nonCommStudyDetails = await seDatabaseReq(`
      SELECT cpmsId FROM sponsorengagement.Study where id = ${nonCommStudyId};`)
    const getStudyInCpms = await getStudyEngagementInfo(nonCommStudyDetails[0].cpmsId)

    await test.step(`Given I have navigated to the Study Details Page for a Non-Commercial Study with SE Id ${nonCommStudyId}`, async () => {
      await studyDetailsPage.goto(nonCommStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(nonCommStudyId.toString())
    })
    await test.step(`When I view the Section titled 'Summary of study’s progress (UK)'`, async () => {
      await studyDetailsPage.assertProgressSummarySectionPresent()
      await studyDetailsPage.assertProgressSummarySectionSubtitle()
    })
    await test.step(`And the Study is Non-Commercial`, async () => {
      await studyDetailsPage.assertStudyRoute('Non-Commercial', getStudyInCpms.StudyRoute)
    })
    await test.step('Then I can see the Studies Network Recruitment Target', async () => {
      await studyDetailsPage.assertUkTarget(getStudyInCpms.SampleSize, getStudyInCpms.StudyRoute)
    })
    await test.step('And I can see the Studies Network Recruitment Total', async () => {
      await studyDetailsPage.assertUkTotal(getStudyInCpms.TotalRecruitmentToDate, getStudyInCpms.StudyRoute)
    })
  })
})
