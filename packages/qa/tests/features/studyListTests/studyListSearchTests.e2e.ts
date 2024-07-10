import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'

const testUserId = 6
const startingOrgId = 9
const shortTitleSearchPhraseSpecific = 'C0221002 - The PODO Trial'
const shortTitleSearchSpecificId = '13499'
const longTitleSearchPhraseSpecific =
  'Protocol Title: Phase 3 open-label study to evaluate efficacy, safety, and tolerability of FIX gene transfer with fidanacogene elaparvovec (PF-06838435) in pediatric male participants <18 years of age with moderately severe to severe hemophilia B (FIX:C≤2%) (BeneGene-3)'
const longTitleSearchSpecificId = '15273'
const titleSearchPhraseBroad = 'PHASE 3'
const irasSearchPhrase = '283893'
const irasSearchId = '14370'
const protocolSearchPhrase = 'B7981040'
const protocolSearchId = '16924'
const numberSearchPhraseBroad = '27'
const cpmsSearchPhrase = '50574'
const cpmsSearchId = '17122'

test.beforeAll('Setup Test Users', async () => {
  await seDatabaseReq(`UPDATE UserOrganisation SET organisationId = ${startingOrgId} WHERE userId = ${testUserId}`)
})

test.describe('Search the Studies List - @se_23', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('As a Sponsor I can search for a Specific Study by Short Title - @se_23_shortTitle_specific', async ({
    studiesPage,
  }) => {
    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
    })
    await test.step('And I am on the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })
    await test.step(`When I Enter the Search Phrase: '${shortTitleSearchPhraseSpecific}'`, async () => {
      await studiesPage.enterSearchPhrase(shortTitleSearchPhraseSpecific)
    })
    await test.step('Then only 1 study is found', async () => {
      await studiesPage.assertSpecificNumberStudies(1)
    })
    await test.step('And the expected Study Item is displayed on the List', async () => {
      await studiesPage.assertTitleAndSponsors(
        `SELECT Study.shortTitle, Organisation.name AS orgName, organisationRoleId 
                  FROM StudyOrganisation
                  INNER JOIN Study ON Study.id = StudyOrganisation.studyId
                  INNER JOIN Organisation ON Organisation.id = StudyOrganisation.organisationId
                  WHERE StudyOrganisation.studyId = ${shortTitleSearchSpecificId}
                  AND StudyOrganisation.isDeleted = 0
                  AND Study.isDeleted = 0;`,
        0
      )
      await studiesPage.assertLastAssessmentValue(
        `SELECT statusId, createdAt FROM Assessment 
                  WHERE studyId = ${shortTitleSearchSpecificId} AND isDeleted = 0 
                  ORDER BY createdAt desc LIMIT 1;`,
        0
      )
      await studiesPage.assertDataIndicatesValue(
        `SELECT indicatorType FROM StudyEvaluationCategory 
                  WHERE studyId = ${shortTitleSearchSpecificId} AND isDeleted = 0;`,
        0
      )
    })
  })

  test('As a Sponsor I can search for a Specific Study by Long Title - @se_23_longTitle_specific', async ({
    studiesPage,
  }) => {
    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
    })
    await test.step('And I am on the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })
    await test.step(`When I Enter the Search Phrase: '${longTitleSearchPhraseSpecific}'`, async () => {
      await studiesPage.enterSearchPhrase(longTitleSearchPhraseSpecific)
    })
    await test.step('Then only 1 study is found', async () => {
      await studiesPage.assertSpecificNumberStudies(1)
    })
    await test.step('And the expected Study Item is displayed on the List', async () => {
      await studiesPage.assertTitleAndSponsors(
        `SELECT Study.shortTitle, Organisation.name AS orgName, organisationRoleId 
                  FROM StudyOrganisation
                  INNER JOIN Study ON Study.id = StudyOrganisation.studyId
                  INNER JOIN Organisation ON Organisation.id = StudyOrganisation.organisationId
                  WHERE StudyOrganisation.studyId = ${longTitleSearchSpecificId}
                  AND StudyOrganisation.isDeleted = 0
                  AND Study.isDeleted = 0;`,
        0
      )
      await studiesPage.assertLastAssessmentValue(
        `SELECT statusId, createdAt FROM Assessment 
                  WHERE studyId = ${longTitleSearchSpecificId} AND isDeleted = 0
                  ORDER BY createdAt desc LIMIT 1;`,
        0
      )
      await studiesPage.assertDataIndicatesValue(
        `SELECT indicatorType FROM StudyEvaluationCategory 
                  WHERE studyId = ${longTitleSearchSpecificId} AND isDeleted = 0;`,
        0
      )
    })
  })

  test('As a Sponsor I can search for Study Long or Short Titles that contain my Search Phrase - @se_23_title_contain', async ({
    studiesPage,
  }) => {
    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
    })
    await test.step('And I am on the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })
    await test.step(`When I Enter the Search Phrase: '${titleSearchPhraseBroad}'`, async () => {
      await studiesPage.enterSearchPhrase(titleSearchPhraseBroad)
    })
    await test.step('Then the Expected Number of Studies are Found', async () => {
      await studiesPage.assertTotalNumberStudies(`SELECT COUNT(*) AS count FROM Study 
            INNER JOIN StudyOrganisation
            ON StudyOrganisation.studyId = Study.Id
            WHERE (StudyOrganisation.organisationId = 9)
            AND (Study.shortTitle LIKE '%${titleSearchPhraseBroad}%'
            OR Study.title LIKE '%${titleSearchPhraseBroad}%'
            OR Study.protocolReferenceNumber LIKE '%${titleSearchPhraseBroad}%'
            OR Study.irasId LIKE '%${titleSearchPhraseBroad}%')
            AND Study.isDeleted = 0;`)
    })
  })

  test('As a Sponsor I can search for a Specific Study by IRAS Id - @se_23_iras_id', async ({ studiesPage }) => {
    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
    })
    await test.step('And I am on the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })
    await test.step(`When I Enter the Search Phrase: '${irasSearchPhrase}'`, async () => {
      await studiesPage.enterSearchPhrase(irasSearchPhrase)
    })
    await test.step('Then only 1 study is found', async () => {
      await studiesPage.assertSpecificNumberStudies(1)
    })
    await test.step('And the expected Study Item is displayed on the List', async () => {
      await studiesPage.assertTitleAndSponsors(
        `SELECT Study.shortTitle, Organisation.name AS orgName, organisationRoleId 
                  FROM StudyOrganisation
                  INNER JOIN Study ON Study.id = StudyOrganisation.studyId
                  INNER JOIN Organisation ON Organisation.id = StudyOrganisation.organisationId
                  WHERE StudyOrganisation.studyId = ${irasSearchId}
                  AND StudyOrganisation.isDeleted = 0
                  AND Study.isDeleted = 0;`,
        0
      )
      await studiesPage.assertLastAssessmentValue(
        `SELECT statusId, createdAt FROM Assessment 
                  WHERE studyId = ${irasSearchId} AND isDeleted = 0
                  ORDER BY createdAt desc LIMIT 1;`,
        0
      )
      await studiesPage.assertDataIndicatesValue(
        `SELECT indicatorType FROM StudyEvaluationCategory 
                  WHERE studyId = ${irasSearchId} AND isDeleted = 0;`,
        0
      )
    })
  })

  test('As a Sponsor I can search for a Specific Study by Protocol Reference Number - @se_23_protocol_ref_no', async ({
    studiesPage,
  }) => {
    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
    })
    await test.step('And I am on the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })
    await test.step(`When I Enter the Search Phrase: '${protocolSearchPhrase}'`, async () => {
      await studiesPage.enterSearchPhrase(protocolSearchPhrase)
    })
    await test.step('Then only 1 study is found', async () => {
      await studiesPage.assertSpecificNumberStudies(1)
    })
    await test.step('And the expected Study Item is displayed on the List', async () => {
      await studiesPage.assertTitleAndSponsors(
        `SELECT Study.shortTitle, Organisation.name AS orgName, organisationRoleId 
                  FROM StudyOrganisation
                  INNER JOIN Study ON Study.id = StudyOrganisation.studyId
                  INNER JOIN Organisation ON Organisation.id = StudyOrganisation.organisationId
                  WHERE StudyOrganisation.studyId = ${protocolSearchId}
                  AND StudyOrganisation.isDeleted = 0
                  AND Study.isDeleted = 0;`,
        0
      )
      await studiesPage.assertLastAssessmentValue(
        `SELECT statusId, createdAt FROM Assessment 
                  WHERE studyId = ${protocolSearchId} AND isDeleted = 0
                  ORDER BY createdAt desc LIMIT 1;`,
        0
      )
      await studiesPage.assertDataIndicatesValue(
        `SELECT indicatorType FROM StudyEvaluationCategory 
                  WHERE studyId = ${protocolSearchId} AND isDeleted = 0;`,
        0
      )
    })
  })

  test('As a Sponsor I can search for IRAS Ids or Protocol Numbers that contain my Search Phrase - @se_23_numbers_contain', async ({
    studiesPage,
  }) => {
    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
    })
    await test.step('And I am on the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })
    await test.step(`When I Enter the Search Phrase: '${numberSearchPhraseBroad}'`, async () => {
      await studiesPage.enterSearchPhrase(numberSearchPhraseBroad)
    })
    await test.step('Then the Expected Number of Studies are Found', async () => {
      await studiesPage.assertTotalNumberStudies(`SELECT COUNT(*) AS count FROM Study 
            INNER JOIN StudyOrganisation
            ON StudyOrganisation.studyId = Study.Id
            WHERE (StudyOrganisation.organisationId = 9)
            AND (Study.shortTitle LIKE '%${numberSearchPhraseBroad}%'
            OR Study.title LIKE '%${numberSearchPhraseBroad}%'
            OR Study.protocolReferenceNumber LIKE '%${numberSearchPhraseBroad}%'
            OR Study.irasId LIKE '%${numberSearchPhraseBroad}%')
            AND StudyOrganisation.isDeleted = 0
            AND Study.isDeleted = 0;`)
    })
  })

  test('As a Sponsor I can search for a Specific Study by CPMS Id - @se_99_cpms_id', async ({ studiesPage }) => {
    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
    })
    await test.step('And I am on the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })
    await test.step(`When I Enter the Search Phrase: '${cpmsSearchPhrase}'`, async () => {
      await studiesPage.enterSearchPhrase(cpmsSearchPhrase)
    })
    await test.step('Then only 1 study is found', async () => {
      await studiesPage.assertSpecificNumberStudies(1)
    })
    await test.step('And the expected Study Item is displayed on the List', async () => {
      await studiesPage.assertTitleAndSponsors(
        `SELECT Study.shortTitle, Organisation.name AS orgName, organisationRoleId 
                  FROM StudyOrganisation
                  INNER JOIN Study ON Study.id = StudyOrganisation.studyId
                  INNER JOIN Organisation ON Organisation.id = StudyOrganisation.organisationId
                  WHERE StudyOrganisation.studyId = ${cpmsSearchId}
                  AND StudyOrganisation.isDeleted = 0
                  AND Study.isDeleted = 0;`,
        0
      )
      await studiesPage.assertLastAssessmentValue(
        `SELECT statusId, createdAt FROM Assessment 
                  WHERE studyId = ${cpmsSearchId} AND isDeleted = 0
                  ORDER BY createdAt desc LIMIT 1;`,
        0
      )
      await studiesPage.assertDataIndicatesValue(
        `SELECT indicatorType FROM StudyEvaluationCategory 
                  WHERE studyId = ${cpmsSearchId} AND isDeleted = 0;`,
        0
      )
    })
  })
})
