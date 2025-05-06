import { RowDataPacket } from 'mysql2'
import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'

const testUserId = 6
const startingOrgId = 21
let startingStudyId = 0
let noAssessmentStudyId = 0
let croCtuOrgRelationshipStudyId = 0
let croCtuStudySponsorName: RowDataPacket[]
let croCtuStudyCroCtuName: RowDataPacket[]
let studyCoreDetails: RowDataPacket[]

test.beforeAll('Setup Tests', async () => {
  await seDatabaseReq(
    `UPDATE UserOrganisation SET organisationId = ${startingOrgId} WHERE userId = ${testUserId} AND isDeleted = 0`
  )
  const randomStudyIdSelected = await seDatabaseReq(`SELECT Study.id FROM Study 
    INNER JOIN StudyOrganisation
    ON Study.id = StudyOrganisation.studyId
    WHERE StudyOrganisation.organisationId = ${startingOrgId} AND StudyOrganisation.isDeleted = 0 AND Study.isDeleted = 0
    ORDER BY RAND() LIMIT 1;`)
  startingStudyId = randomStudyIdSelected[0].id

  const randomCroCtuStudyIdSelected = await seDatabaseReq(`SELECT DISTINCT studyId FROM StudyOrganisation
    INNER JOIN Study ON Study.id = StudyOrganisation.studyId
    WHERE (StudyOrganisation.organisationId = ${startingOrgId} AND StudyOrganisation.organisationRoleId = 1 AND StudyOrganisation.isDeleted = 0)
    AND (Study.isDeleted = 0)
    AND studyId in (SELECT DISTINCT studyId FROM StudyOrganisation 
    WHERE ((StudyOrganisation.organisationRoleId = 3 OR StudyOrganisation.organisationRoleId = 4) AND StudyOrganisation.isDeleted = 0))
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

  studyCoreDetails =
    await seDatabaseReq(`SELECT title, shortTitle, protocolReferenceNumber, irasId, cpmsId, managingSpeciality, 
    Organisation.name AS sponsorName, chiefInvestigatorFirstName, chiefInvestigatorLastName FROM Study 
    INNER JOIN StudyOrganisation
    ON StudyOrganisation.studyId = Study.id
    INNER JOIN Organisation
    ON Organisation.id = StudyOrganisation.organisationId
    WHERE Study.id = ${startingStudyId} AND StudyOrganisation.organisationRoleId = 1 AND Study.isDeleted = 0;`)

  const randomNoAssessmentStudyIdSelected = await seDatabaseReq(`SELECT Study.id FROM Study
    INNER JOIN StudyOrganisation ON StudyOrganisation.studyId = Study.id
    WHERE Study.id NOT IN (SELECT studyId FROM Assessment)
    AND Study.isDeleted = 0 AND StudyOrganisation.organisationId = ${startingOrgId};`)
  noAssessmentStudyId = randomNoAssessmentStudyIdSelected[0].id
})

test.describe('Access Study Assessment Page and view Summary - @se_29 @se_29_view', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('As a Sponsor I can access the Study Assessment page via the Study Details Page - @se_29_ac1_detailsNav', async ({
    studyDetailsPage,
    assessmentPage,
  }) => {
    await test.step(`Given I have navigated to the Study Details Page for a Commercial Study with SE Id ${startingStudyId}`, async () => {
      await studyDetailsPage.goto(startingStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(startingStudyId.toString())
    })
    await test.step(`When I click the Assess button`, async () => {
      await studyDetailsPage.assessButton.click()
    })
    await test.step(`Then I am taken to the Assessment page for Study with SE Id ${startingStudyId}`, async () => {
      await assessmentPage.assertOnAssessmentPage(startingStudyId.toString())
    })
  })

  test('The Study Assessment page displays the Sponsor and any CRO/CTU Names above the Study Title - @se_29_sponsorCroCtu', async ({
    assessmentPage,
  }) => {
    await test.step(`Given I have navigated to the Assessment Page for the Study with SE Id ${croCtuOrgRelationshipStudyId}`, async () => {
      await assessmentPage.goto(croCtuOrgRelationshipStudyId.toString())
      await assessmentPage.assertOnAssessmentPage(croCtuOrgRelationshipStudyId.toString())
    })
    await test.step('When I can see Study Sponsor beneath the Study Short Title', async () => {
      await assessmentPage.assertStudySponsorPresent(croCtuStudySponsorName[0].name)
    })
    await test.step('Then I can see the CRO/CTU displayed in Brackets alongside the Sponsor', async () => {
      await assessmentPage.assertStudyCroCtuPresent(croCtuStudyCroCtuName[0].name.trim())
    })
  })

  test('I am returned to the page I came from, when cancelling an Assessment - @se_29_ac4', async ({
    assessmentPage,
    studyDetailsPage,
  }) => {
    await test.step(`Given I have navigated to the Study Details Page for Study with SE Id ${startingStudyId}`, async () => {
      await studyDetailsPage.goto(startingStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(startingStudyId.toString())
    })
    await test.step(`And I click the Assess button`, async () => {
      await studyDetailsPage.assessButton.click()
    })
    await test.step(`And I am taken to the Assessment page for Study with SE Id ${startingStudyId}`, async () => {
      await assessmentPage.assertOnAssessmentPage(startingStudyId.toString())
    })
    await test.step(`When I click the Cancel button`, async () => {
      await assessmentPage.cancelButton.click()
    })
    await test.step(`Then I am returned to the Study Details page for Study with SE Id ${startingStudyId}`, async () => {
      await studyDetailsPage.assertOnStudyDetailsPage(startingStudyId.toString())
    })
  })

  test('The Study Assessment page has a Collapsed `Show study details` section - @se_29_studyDetailsCollapsed', async ({
    assessmentPage,
  }) => {
    await test.step(`Given I have navigated to the Assessment Page for the Study with SE Id ${startingStudyId}`, async () => {
      await assessmentPage.goto(startingStudyId.toString())
      await assessmentPage.assertOnAssessmentPage(startingStudyId.toString())
    })
    await test.step('When I see the `Show study details` section', async () => {
      await assessmentPage.assertStudyDetailsPresent()
    })
    await test.step('Then the `Show study details` section is collapsed by default', async () => {
      await assessmentPage.assertStudyDetailsCollapsed(true)
    })
  })

  test('The `Show study details` section can be expanded to show core Study Details- @se_29_studyDetailsExpanded', async ({
    assessmentPage,
  }) => {
    await test.step(`Given I have navigated to the Assessment Page for a Non-Commercial Study with SE Id ${startingStudyId}`, async () => {
      await assessmentPage.goto(startingStudyId.toString())
      await assessmentPage.assertOnAssessmentPage(startingStudyId.toString())
    })
    await test.step('When I see the `Show study details` section', async () => {
      await assessmentPage.assertStudyDetailsPresent()
    })
    await test.step('And I expand the `Show study details` section', async () => {
      await assessmentPage.studyDetailsSection.click()
      await assessmentPage.assertStudyDetailsCollapsed(false)
    })
    await test.step('Then I can see the Studies Full Title', async () => {
      await assessmentPage.assertStudyDetailFullTitle(studyCoreDetails[0].title)
    })
    await test.step('And I can see the Studies IRAS Id', async () => {
      await assessmentPage.assertStudyIrasId(studyCoreDetails[0].irasId)
    })
    await test.step('And I can see the Studies CPMS Id', async () => {
      await assessmentPage.assertStudyCpmsId(studyCoreDetails[0].cpmsId.toString())
    })
    await test.step('And I can see the Name of the Studies Sponsor', async () => {
      await assessmentPage.assertStudySponsor(studyCoreDetails[0].sponsorName)
    })
    await test.step('And I can see the Managing Speciality of the Study', async () => {
      await assessmentPage.assertManagingSpecialty(studyCoreDetails[0].managingSpeciality)
    })
    await test.step('And I can see the Chief Investigator of the Study', async () => {
      await assessmentPage.assertChiefInvestigator(
        studyCoreDetails[0].chiefInvestigatorFirstName,
        studyCoreDetails[0].chiefInvestigatorLastName
      )
    })
  })

  test('The `Last sponsor assessment` Panel displays expected message when no Previous Assessment exists - @se_29_ac2_without', async ({
    assessmentPage,
  }) => {
    await test.step(`Given I have navigated to the Assessment Page for a Study with no Assessment - SE Id ${noAssessmentStudyId}`, async () => {
      await assessmentPage.goto(noAssessmentStudyId.toString())
      await assessmentPage.assertOnAssessmentPage(noAssessmentStudyId.toString())
    })
    await test.step('When I see the `Last sponsor assessment` section', async () => {
      await assessmentPage.assertLastSponsorSectionPresent()
    })
    await test.step('Then the text `This study has not had any assessments provided` appears', async () => {
      await assessmentPage.assertNoPreviousAssessment()
    })
  })
})
