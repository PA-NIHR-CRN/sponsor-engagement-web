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

test.describe('View the Study Assessment Form - @se_29 @se_29_form', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('As a Sponsor I have access to a Study Assessment Form - @se_29_ac3', async ({ assessmentPage }) => {
    await test.step(`Given I have navigated to the Assessment Page`, async () => {
      await assessmentPage.goto(startingStudyId.toString())
      await assessmentPage.assertOnAssessmentPage(startingStudyId.toString())
    })
    await test.step(`When I view the section titled 'Is this study progressing in the UK as planned?'`, async () => {
      await assessmentPage.assertStudyProgressingPresent()
    })
    await test.step(`Then I see 2 Radio Button Options for 'On Track' and 'Off Track' with guidance text`, async () => {
      await assessmentPage.assertRadioButtonsPresent()
    })
    await test.step(`And neither Option is selected by default`, async () => {
      await assessmentPage.assertRadioButtonSelected('On', false)
      await assessmentPage.assertRadioButtonSelected('Off', false)
    })
    await test.step(`When I view the 'Additional Information' section`, async () => {
      await assessmentPage.assertAdditionalInfoPresent()
    })
    await test.step('Then I can see each of the expected Additional Info Categories in a checklist', async () => {
      await assessmentPage.assertAdditionalInfoOptionsPresent()
    })
    await test.step(`When I view the section titled 'Further Information (optional)'`, async () => {
      await assessmentPage.assertFurtherInfoPresent()
    })
    await test.step('Then I can see a free text area to input Further Information', async () => {
      await assessmentPage.assertFurtherInfoTextAreaPresent()
    })
    await test.step('And I can see that the text area has a 400 char limit', async () => {
      await assessmentPage.assertFurtherInfoCharLimitPresent()
    })
    await test.step('And I have buttons to either Submit or Cancel my Assessment', async () => {
      await assessmentPage.assertSubmitButtonPresent()
      await assessmentPage.assertCancelButtonPresent()
    })
  })

  test('The Character count reduces as the user types in the Further Information Text Area - @se_29_ac3_chars_reduce', async ({
    assessmentPage,
  }) => {
    await test.step(`Given I have navigated to the Assessment Page`, async () => {
      await assessmentPage.goto(startingStudyId.toString())
      await assessmentPage.assertOnAssessmentPage(startingStudyId.toString())
    })
    await test.step('When I Type `T` into the test area', async () => {
      await assessmentPage.furtherInfoTextArea.fill('T')
    })
    await test.step('Then the remaining char count will reduce to 399', async () => {
      await assessmentPage.assertFurtherInfoCharsRemaining(399)
    })
    await test.step('When I Type `TE` into the test area', async () => {
      await assessmentPage.furtherInfoTextArea.fill('TE')
    })
    await test.step('Then the remaining char count will reduce to 398', async () => {
      await assessmentPage.assertFurtherInfoCharsRemaining(398)
    })
    await test.step('When I Type `TES` into the test area', async () => {
      await assessmentPage.furtherInfoTextArea.fill('TES')
    })
    await test.step('Then the remaining char count will reduce to 397', async () => {
      await assessmentPage.assertFurtherInfoCharsRemaining(397)
    })
    await test.step('When I Type `TEST` into the test area', async () => {
      await assessmentPage.furtherInfoTextArea.fill('TEST')
    })
    await test.step('Then the remaining char count will reduce to 396', async () => {
      await assessmentPage.assertFurtherInfoCharsRemaining(396)
    })
  })

  test('As a Sponsor I can navigate back from the Study Assessment Form to the Study List and All Studies pages by clicking the breadcrumb links - @se_238_ac1', async ({
    assessmentPage,
    studyDetailsPage,
    studiesPage,
  }) => {
    await test.step(`Given I have navigated to the Study Assessment Form for a Study with SE Id ${startingStudyId}`, async () => {
      await assessmentPage.goto(startingStudyId.toString())
      await assessmentPage.assertOnAssessmentPage(startingStudyId.toString())
    })
    await test.step(`When I click on the 'Study List' breadcrumb`, async () => {
      await assessmentPage.studyDetailsBreadcrumb.click()
    })
    await test.step('Then I am taken to the Study Details page', async () => {
      await studyDetailsPage.assertOnStudyDetailsPage(startingStudyId.toString())
    })
    await test.step(`And I navigate to the Study Assessment Form again`, async () => {
      await assessmentPage.goto(startingStudyId.toString())
      await assessmentPage.assertOnAssessmentPage(startingStudyId.toString())
    })
    await test.step(`When I click on the 'All Studies' breadcrumb`, async () => {
      await assessmentPage.allStudiesBreadcrumb.click()
    })
    await test.step('Then I am taken to the All Studies page', async () => {
      await studiesPage.assertOnStudiesPage()
    })
  })
})
