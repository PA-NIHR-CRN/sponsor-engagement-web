import { RowDataPacket } from 'mysql2'
import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'
import { getStudyEngagementInfo } from '../../../utils/ApiRequests'
import { setupSponsorUser } from '../../../utils/setupSponsorUser'

const testUserId = 6
const startingOrgId = 9
const nonCommCTUOrgId = 21
let startingStudyId = 0
let studyCoreDetails: RowDataPacket[]
let croOrgRelationshipStudyId = 0
let croOrgName = ''
let ctuOrgRelationshipStudyId = 0
let ctuOrgName = ''
//Must ensure that specific SE study Id's below remain in the SE Tool on Test
const noProtocolRefNoStudyId = 17122
const noIrasIdStudyId = 16519
const noChiefInvestigatorStudyId = 15504
const noCroOrgRelationshipStudyId = 11133
const noCtuOrgRelationshipStudyId = 339
const nonComCheifInvestigatorFirstName = 'John'
const nonComCheifInvestigatorLastName = 'Collinge'
const nonComStudyId = '13610'
const nonComOrgId = '635'
const deletedOrgId = 1

test.beforeAll('Setup sponsor user mappings', async () => {
  await setupSponsorUser(testUserId, deletedOrgId, startingOrgId)
  await seDatabaseReq(`UPDATE Study SET protocolReferenceNumber = NULL WHERE id = ${noProtocolRefNoStudyId};`)

  const randomStudyIdSelected = await seDatabaseReq(`SELECT Study.id FROM Study 
    INNER JOIN StudyOrganisation
    ON Study.id = StudyOrganisation.studyId
    WHERE StudyOrganisation.organisationId = ${startingOrgId} AND StudyOrganisation.isDeleted = 0 AND Study.isDeleted = 0
    ORDER BY RAND() LIMIT 1;`)
  startingStudyId = randomStudyIdSelected[0].id

  studyCoreDetails =
    await seDatabaseReq(`SELECT title, shortTitle, protocolReferenceNumber, irasId, cpmsId, managingSpeciality, 
    Organisation.name AS sponsorName, chiefInvestigatorFirstName, chiefInvestigatorLastName FROM Study 
    INNER JOIN StudyOrganisation
    ON StudyOrganisation.studyId = Study.id
    INNER JOIN Organisation
    ON Organisation.id = StudyOrganisation.organisationId
    WHERE Study.id = ${startingStudyId} AND StudyOrganisation.organisationRoleId = 1 AND Study.isDeleted = 0;`)

  const randomCROStudyIdSelected = await seDatabaseReq(`SELECT DISTINCT studyId FROM StudyOrganisation
    INNER JOIN Study ON Study.id = StudyOrganisation.studyId
    AND StudyOrganisation.organisationId = ${startingOrgId} AND StudyOrganisation.organisationRoleId = 1 
    AND StudyOrganisation.isDeleted = 0
    AND studyId in (SELECT DISTINCT studyId FROM StudyOrganisation 
    WHERE (StudyOrganisation.organisationRoleId = 3 AND StudyOrganisation.isDeleted = 0))
    AND Study.isDeleted = 0 ORDER BY RAND() LIMIT 1;`)
  croOrgRelationshipStudyId = randomCROStudyIdSelected[0].studyId

  const croStudyOrg = await seDatabaseReq(`SELECT Organisation.name FROM Organisation
    INNER JOIN StudyOrganisation
    ON StudyOrganisation.organisationId = Organisation.id
    WHERE StudyOrganisation.studyId = ${croOrgRelationshipStudyId}
    AND StudyOrganisation.organisationRoleId = 3;`)
  croOrgName = croStudyOrg[0].name

  const randomCTUStudyIdSelected = await seDatabaseReq(`SELECT DISTINCT studyId FROM StudyOrganisation
    INNER JOIN Study ON Study.id = StudyOrganisation.studyId
    WHERE StudyOrganisation.organisationId = ${nonCommCTUOrgId} AND StudyOrganisation.organisationRoleId = 1 AND StudyOrganisation.isDeleted = 0
    AND studyId in (SELECT DISTINCT studyId FROM StudyOrganisation WHERE (StudyOrganisation.organisationRoleId = 4 AND StudyOrganisation.isDeleted = 0))
    AND Study.isDeleted = 0 ORDER BY RAND() LIMIT 1;`)
  ctuOrgRelationshipStudyId = randomCTUStudyIdSelected[0].studyId

  const ctuStudyOrg = await seDatabaseReq(`SELECT Organisation.name FROM Organisation
    INNER JOIN StudyOrganisation
    ON StudyOrganisation.organisationId = Organisation.id
    WHERE StudyOrganisation.studyId = ${ctuOrgRelationshipStudyId}
    AND StudyOrganisation.organisationRoleId = 4;`)
  ctuOrgName = ctuStudyOrg[0].name
})

test.describe('View core study details - @se_27', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('As a Sponsor I can see the Core Study Details about a Specific Study - @se_27_ac1', async ({
    studyDetailsPage,
  }) => {
    const studyDetails = await seDatabaseReq(`
      SELECT cpmsId FROM sponsorengagement.Study where id = ${startingStudyId};`)
    const getStudyInCpms = await getStudyEngagementInfo(studyDetails[0].cpmsId)

    await test.step(`Given I have navigated to the Study Details Page for a Commercial Study with SE Id ${startingStudyId}`, async () => {
      await studyDetailsPage.goto(startingStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(startingStudyId.toString())
    })
    await test.step(`When I view the Section titled 'About this study'`, async () => {
      await studyDetailsPage.assertAboutStudySectionPresent()
    })
    await test.step('Then I can see the Studies Full Title', async () => {
      await studyDetailsPage.assertStudyShortTitleV2(getStudyInCpms.ShortName)
    })
    await test.step('And I can see the Studies Protocol Reference Number', async () => {
      await studyDetailsPage.assertProtocolRefNo(getStudyInCpms.ProtocolReferenceNumber)
    })
    await test.step('And I can see the Studies IRAS Id', async () => {
      await studyDetailsPage.assertStudyIrasId(getStudyInCpms.IrasId)
    })
    await test.step('And I can see the Studies CPMS Id', async () => {
      await studyDetailsPage.assertStudyCpmsId(studyDetails[0].cpmsId.toString())
    })
    await test.step('And I can see the Name of the Studies Sponsor', async () => {
      await studyDetailsPage.assertStudySponsorV2(getStudyInCpms.StudySponsors)
    })
    await test.step('And I can see the Managing Speciality of the Study', async () => {
      await studyDetailsPage.assertManagingSpecialty(getStudyInCpms.ManagingSpecialty)
    })
  })

  test('As a Sponsor I can navigate back from Study Details page to Studies Page by clicking back link - @se_181_ac1', async ({
    studyDetailsPage,
    studiesPage,
  }) => {
    await test.step(`Given I have navigated to the Study Details Page for a Study with SE Id ${startingStudyId}`, async () => {
      await studyDetailsPage.goto(startingStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(startingStudyId.toString())
    })
    await test.step(`When I click on 'All studies' link`, async () => {
      await studyDetailsPage.allStudiesLink.click()
    })
    await test.step('Then I am taken to the Studies page', async () => {
      await studiesPage.assertOnStudiesPage()
    })
  })

  test('As a Sponsor I can navigate from the Study Details page to Update study data page by clicking Update study data - @se_181_ac2', async ({
    studyDetailsPage,
    studyUpdatePage,
  }) => {
    await test.step(`Given I have navigated to the Study Details Page for a Study with SE Id ${startingStudyId}`, async () => {
      await studyDetailsPage.goto(startingStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(startingStudyId.toString())
    })
    await test.step(`When I click on 'Update study' button`, async () => {
      await studyDetailsPage.updateStudyDataButton.click()
    })
    await test.step('Then I am taken to the Update study data page', async () => {
      await studyUpdatePage.assertOnUpdateStudyPage(startingStudyId.toString())
    })
  })

  test('The value `None available` appears where the Protocol Reference Number value is null - @se_27_protocolRef', async ({
    studyDetailsPage,
  }) => {
    await test.step(`Given I have navigated to the Study Details Page for Study with SE Id ${noProtocolRefNoStudyId}`, async () => {
      await studyDetailsPage.goto(noProtocolRefNoStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(noProtocolRefNoStudyId.toString())
    })
    await test.step(`When I view the Section titled 'About this study'`, async () => {
      await studyDetailsPage.assertAboutStudySectionPresent()
    })
    await test.step('Then I can see the Protocol Reference Number has value of `None available`', async () => {
      await studyDetailsPage.assertProtocolRefNo('None available')
    })
  })

  test('The value `None available` appears where the IRAS Id value is null - @se_27_iras', async ({
    studyDetailsPage,
  }) => {
    await test.step(`Given I have navigated to the Study Details Page for Study with SE Id ${noIrasIdStudyId}`, async () => {
      await studyDetailsPage.goto(noIrasIdStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(noIrasIdStudyId.toString())
    })
    await test.step(`When I view the Section titled 'About this study'`, async () => {
      await studyDetailsPage.assertAboutStudySectionPresent()
    })
    await test.step('Then I can see the IRAS Id has value of `None available`', async () => {
      await studyDetailsPage.assertStudyIrasId('None available')
    })
  })

  test('The value `None available` appears where the Chief Investigator value is null - @se_27_chief', async ({
    studyDetailsPage,
  }) => {
    await seDatabaseReq(`
      UPDATE UserOrganisation SET organisationId = ${nonComOrgId} WHERE userId = ${testUserId} AND isDeleted = 0`)

    await test.step(`Given I have navigated to the Study Details Page for Study with SE Id ${nonComStudyId}`, async () => {
      await studyDetailsPage.goto(nonComStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(nonComStudyId.toString())
    })
    await test.step(`When I view the Section titled 'About this study'`, async () => {
      await studyDetailsPage.assertAboutStudySectionPresent()
    })
    await test.step('Then I can see the Chief Investigator has value of `None available`', async () => {
      await studyDetailsPage.assertChiefInvestigator('', 'None available')
    })
  })

  test('The row titled `CRO` only appears in Study Details where a CRO Relationship is present - @se_27_cro', async ({
    studyDetailsPage,
  }) => {
    await test.step(`Given I have navigated to the Study Details Page for Study with SE Id ${croOrgRelationshipStudyId}`, async () => {
      await studyDetailsPage.goto(croOrgRelationshipStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(croOrgRelationshipStudyId.toString())
    })
    await test.step(`When I view the Section titled 'About this study'`, async () => {
      await studyDetailsPage.assertAboutStudySectionPresent()
    })
    await test.step('Then I can see the CRO row in the table with expected value', async () => {
      await studyDetailsPage.assertCroPresent(croOrgName)
    })
    await test.step(`Given I have navigated to the Study Details Page for Study with SE Id ${noCroOrgRelationshipStudyId}`, async () => {
      await studyDetailsPage.goto(noCroOrgRelationshipStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(noCroOrgRelationshipStudyId.toString())
    })
    await test.step(`When I view the Section titled 'About this study'`, async () => {
      await studyDetailsPage.assertAboutStudySectionPresent()
    })
    await test.step('Then I cannot see the CRO row in the table with expected value', async () => {
      await studyDetailsPage.assertCroPresent('false')
    })
  })

  test('The row titled `CTU` only appears in Study Details where a CTU Relationship is present - @se_27_ctu', async ({
    studyDetailsPage,
  }) => {
    await seDatabaseReq(
      `UPDATE UserOrganisation SET organisationId = ${nonCommCTUOrgId} WHERE userId = ${testUserId} AND isDeleted = 0`
    )
    await test.step(`Given I have navigated to the Study Details Page for Study with SE Id ${ctuOrgRelationshipStudyId}`, async () => {
      await studyDetailsPage.goto(ctuOrgRelationshipStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(ctuOrgRelationshipStudyId.toString())
    })
    await test.step(`When I view the Section titled 'About this study'`, async () => {
      await studyDetailsPage.assertAboutStudySectionPresent()
    })
    await test.step('Then I can see the CTU row in the table with expected value', async () => {
      await studyDetailsPage.assertCtuPresent(ctuOrgName)
    })
    await test.step(`Given I have navigated to the Study Details Page for Study with SE Id ${noCtuOrgRelationshipStudyId}`, async () => {
      await studyDetailsPage.goto(noCtuOrgRelationshipStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(noCtuOrgRelationshipStudyId.toString())
    })
    await test.step(`When I view the Section titled 'About this study'`, async () => {
      await studyDetailsPage.assertAboutStudySectionPresent()
    })
    await test.step('Then I cannot see the CRO row in the table with expected value', async () => {
      await studyDetailsPage.assertCtuPresent('false')
    })
  })

  test('The row titled `Protocol reference number` only appears in for Commercial Studies - @se_27_nonComm_protocolRef', async ({
    studyDetailsPage,
  }) => {
    await seDatabaseReq(`
      UPDATE UserOrganisation SET organisationId = ${nonCommCTUOrgId} WHERE userId = ${testUserId} AND isDeleted = 0`)

    await test.step(`Given I have navigated to the Study Details Page for Non-Commercial Study with SE Id ${noCtuOrgRelationshipStudyId}`, async () => {
      await studyDetailsPage.goto(noCtuOrgRelationshipStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(noCtuOrgRelationshipStudyId.toString())
    })
    await test.step(`When I view the Section titled 'About this study'`, async () => {
      await studyDetailsPage.assertAboutStudySectionPresent()
    })
    await test.step('Then I cannot see a row displaying the Protocol Reference Number', async () => {
      await studyDetailsPage.assertProtocolRefNo('false')
    })
  })
  test('The row titled `Chief investigator` only appears in for non-Commercial Studies - @se_27_ac1 @se_27_noncom', async ({
    studyDetailsPage,
  }) => {
    await test.step(`Given I have navigated to the Study Details Page for Non-Commercial Study with SE Id ${noCtuOrgRelationshipStudyId}`, async () => {
      await studyDetailsPage.goto(noCtuOrgRelationshipStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(noCtuOrgRelationshipStudyId.toString())
    })
    await test.step(`When I view the Section titled 'About this study'`, async () => {
      await studyDetailsPage.assertAboutStudySectionPresent()
    })
    await test.step('Then I can see a Row displaying the Chief Investigator', async () => {
      await studyDetailsPage.assertChiefInvestigator(nonComCheifInvestigatorFirstName, nonComCheifInvestigatorLastName)
    })
  })
})
