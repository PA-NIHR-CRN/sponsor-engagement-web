import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'

const testUserId = 6
const startingOrgId = 21
let startingStudyId = 0

test.beforeAll('Setup Tests', async () => {
  await seDatabaseReq(`UPDATE UserOrganisation SET organisationId = ${startingOrgId} WHERE userId = ${testUserId}`)
  const randomStudyIdSelected = await seDatabaseReq(`SELECT Study.id FROM Study 
    INNER JOIN StudyOrganisation
    ON Study.id = StudyOrganisation.studyId
    WHERE StudyOrganisation.organisationId = ${startingOrgId} AND StudyOrganisation.isDeleted = 0 AND Study.isDeleted = 0
    ORDER BY RAND() LIMIT 1;`)
  startingStudyId = randomStudyIdSelected[0].id
})

test.describe('View Request CRN Support Guidance - @se_30', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('As a Sponsor I see Request Support Guidance text Only, on the Study List page - @se_30_ac1', async ({
    studiesPage,
    commonItemsPage,
  }) => {
    await test.step(`Given I have navigated to the Study List Page`, async () => {
      await studiesPage.goto()
      await studiesPage.assertOnStudiesPage()
    })
    await test.step(`When I view the section titled 'Request NIHR CRN support'`, async () => {
      await commonItemsPage.assertRequestSupportPresent()
    })
    await test.step(`Then the expected Guidance Text is provided`, async () => {
      await commonItemsPage.assertRequestSupportGuidanceText('List')
    })
    await test.step(`And I am not provided with a Request Support button`, async () => {
      await commonItemsPage.assertRequestSupportButtonPresent(false)
    })
  })

  test('As a Sponsor I can Access the Request Support page via a Button on the Study Details page - @se_30_ac2_details', async ({
    studyDetailsPage,
    commonItemsPage,
    requestSupportPage,
  }) => {
    await test.step(`Given I have navigated to the Study Details Page`, async () => {
      await studyDetailsPage.goto(startingStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPage(startingStudyId.toString())
    })
    await test.step(`And I view the section titled 'Request NIHR CRN support'`, async () => {
      await commonItemsPage.assertRequestSupportPresent()
    })
    await test.step(`And the expected gudiance text is provided`, async () => {
      await commonItemsPage.assertRequestSupportGuidanceText('details')
    })
    await test.step(`And I am provided with a Request Support button`, async () => {
      await commonItemsPage.assertRequestSupportButtonPresent(true)
    })
    await test.step(`When I click the Request Support button`, async () => {
      await commonItemsPage.requestSupportButton.click()
    })
    await test.step(`Then I am taken to the Request Support page`, async () => {
      await requestSupportPage.assertOnRequestSupportPageViaDetails(startingStudyId.toString())
    })
    await test.step(`And the Request Support page contains the expected Guidance text`, async () => {
      await requestSupportPage.assertGuidanceTextContains()
    })
    await test.step(`And the Request Support page contains a link to an existing Local CRN Support page`, async () => {
      await requestSupportPage.assertCrnLinkPresent()
    })
    await test.step(`And the Request Support page contains a Button to 'Return to previous page'`, async () => {
      await requestSupportPage.assertReturnPreviousPresent()
    })
    await test.step(`And clicking the Button returns me to the Study Details page`, async () => {
      await requestSupportPage.returnPreviousButton.click()
      await studyDetailsPage.assertOnStudyDetailsPage(startingStudyId.toString())
    })
  })

  test('As a Sponsor I can Access the Request Support page via a Button on the Assessment page - @se_30_ac2_assess', async ({
    assessmentPage,
    commonItemsPage,
    requestSupportPage,
  }) => {
    await test.step(`Given I have navigated to the Assessment Page`, async () => {
      await assessmentPage.goto(startingStudyId.toString())
      await assessmentPage.assertOnAssessmentPage(startingStudyId.toString())
    })
    await test.step(`And I view the section titled 'Request NIHR CRN support'`, async () => {
      await commonItemsPage.assertRequestSupportPresent()
    })
    await test.step(`And the expected gudiance text is provided`, async () => {
      await commonItemsPage.assertRequestSupportGuidanceText('assess')
    })
    await test.step(`And I am provided with a Request Support button`, async () => {
      await commonItemsPage.assertRequestSupportButtonPresent(true)
    })
    await test.step(`When I click the Request Support button`, async () => {
      await commonItemsPage.requestSupportButton.click()
    })
    await test.step(`Then I am taken to the Request Support page`, async () => {
      await requestSupportPage.assertOnRequestSupportPageViaAssess(startingStudyId.toString())
    })
    await test.step(`And the Request Support page contains the expected Guidance text`, async () => {
      await requestSupportPage.assertGuidanceTextContains()
    })
    await test.step(`And the Request Support page contains a link to an existing Local CRN Support page`, async () => {
      await requestSupportPage.assertCrnLinkPresent()
    })
    await test.step(`And the Request Support page contains a button to 'Return to previous page'`, async () => {
      await requestSupportPage.assertReturnPreviousPresent()
    })
    await test.step(`And clicking the Button returns me to the Assessment page`, async () => {
      await requestSupportPage.returnPreviousButton.click()
      await assessmentPage.assertOnAssessmentPage(startingStudyId.toString())
    })
  })
})
