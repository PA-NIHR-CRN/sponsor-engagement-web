import { expect, test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'
import { setupSponsorUser } from '../../../utils/setupSponsorUser'

const testUserId = 6
const startingOrgId = 9
let startingStudyId = 0
let userOrgRecordId = 0
let registrationToken = ''
const deletedOrgId = 1

test.beforeAll('Setup Tests', async () => {
  await setupSponsorUser(testUserId, deletedOrgId, startingOrgId)

  const randomStudyIdSelected = await seDatabaseReq(`SELECT Study.id FROM Study 
    INNER JOIN StudyOrganisation
    ON Study.id = StudyOrganisation.studyId
    WHERE StudyOrganisation.organisationId = ${startingOrgId} AND StudyOrganisation.isDeleted = 0 
    AND Study.dueAssessmentAt IS NOT NULL AND Study.isDeleted = 0
    ORDER BY RAND() LIMIT 1;`)
  startingStudyId = randomStudyIdSelected[0].id

  const randomUserOrgIdSelected = await seDatabaseReq(`SELECT id FROM UserOrganisation
    WHERE organisationId = ${startingOrgId} AND isDeleted = 0
    ORDER BY RAND() LIMIT 1;`)
  userOrgRecordId = randomUserOrgIdSelected[0].id

  const randomRegTokenSelected = await seDatabaseReq(
    `SELECT * FROM User WHERE registrationToken IS NOT NULL AND identityGatewayId IS NULL;`
  )
  registrationToken = randomRegTokenSelected[0].registrationToken
})

test.describe('Study Accessibility Tests - @accessibility @accessibility_sponsor', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('Scan Study List Page with AXE Tool @access_studyList', async ({ studiesPage, makeAxeBuilder }, testInfo) => {
    const axeScanner = makeAxeBuilder()
    let axeScanResults = await axeScanner.analyze()
    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
      await studiesPage.assertOnStudiesPage()
    })

    await test.step('When I scan the Study List Page for Accessibility Errors', async () => {
      axeScanResults = await axeScanner
        .options({ reporter: 'v2' })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
    })

    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(axeScanResults, null, 2),
      contentType: 'application/json',
    })

    await test.step('Then I should receive no issue up to WCAG 2.1 AA Standard', async () => {
      expect(axeScanResults.violations).toEqual([])
    })
  })

  test('Scan Study Detail Page with AXE Tool @access_studyDetail', async ({
    studyDetailsPage,
    makeAxeBuilder,
  }, testInfo) => {
    const axeScanner = makeAxeBuilder()
    let axeScanResults = await axeScanner.analyze()
    await test.step('Given I have navigated to the Study Details Page with Success Alert', async () => {
      await studyDetailsPage.gotoSuccess(startingStudyId.toString())
      await studyDetailsPage.assertOnStudyDetailsPageWithSuccess(startingStudyId.toString())
    })

    await test.step('When I scan the Study Detail Page for Accessibility Errors', async () => {
      axeScanResults = await axeScanner
        .options({ reporter: 'v2' })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
    })

    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(axeScanResults, null, 2),
      contentType: 'application/json',
    })

    await test.step('Then I should receive no issue up to WCAG 2.1 AA Standard', async () => {
      expect(axeScanResults.violations).toEqual([])
    })
  })

  test('Scan Assessment Page with AXE Tool @access_assessment', async ({
    assessmentPage,
    makeAxeBuilder,
  }, testInfo) => {
    const axeScanner = makeAxeBuilder()
    let axeScanResults = await axeScanner.analyze()
    await test.step('Given I have navigated to the Assessment Page', async () => {
      await assessmentPage.goto(startingStudyId.toString())
      await assessmentPage.assertOnAssessmentPage(startingStudyId.toString())
    })

    await test.step('And all Validation Errors are on the page', async () => {
      await assessmentPage.submitButton.click()
      await assessmentPage.assertValidationErrorsPresent()
    })

    await test.step('When I scan the Assessment Page for Accessibility Errors', async () => {
      axeScanResults = await axeScanner
        .options({ reporter: 'v2' })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
    })

    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(axeScanResults, null, 2),
      contentType: 'application/json',
    })

    await test.step('Then I should receive no issue up to WCAG 2.1 AA Standard', async () => {
      expect(axeScanResults.violations).toEqual([])
    })
  })

  test('Scan Request Support Page with AXE Tool @access_support', async ({
    requestSupportPage,
    makeAxeBuilder,
  }, testInfo) => {
    const axeScanner = makeAxeBuilder()
    let axeScanResults = await axeScanner.analyze()
    await test.step('Given I have navigated to the Request Support Page', async () => {
      await requestSupportPage.goto(startingStudyId.toString())
      await requestSupportPage.assertOnRequestSupportPageViaDetails(startingStudyId.toString())
    })

    await test.step('When I scan the Request Support Page for Accessibility Errors', async () => {
      axeScanResults = await axeScanner
        .options({ reporter: 'v2' })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
    })

    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(axeScanResults, null, 2),
      contentType: 'application/json',
    })

    await test.step('Then I should receive no issue up to WCAG 2.1 AA Standard', async () => {
      expect(axeScanResults.violations).toEqual([])
    })
  })

  test('Scan Study Update Page with AXE Tool @access_support', async ({
    studyUpdatePage,
    makeAxeBuilder,
  }, testInfo) => {
    const axeScanner = makeAxeBuilder()
    let axeScanResults = await axeScanner.analyze()
    await test.step('Given I have navigated to the Study Update Page', async () => {
      await studyUpdatePage.goto(startingStudyId.toString())
      await studyUpdatePage.assertOnUpdateStudyPage(startingStudyId.toString())
    })

    await test.step('When I scan the Study Update Page for Accessibility Errors', async () => {
      axeScanResults = await axeScanner
        .options({ reporter: 'v2' })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
    })

    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(axeScanResults, null, 2),
      contentType: 'application/json',
    })

    await test.step('Then I should receive no issue up to WCAG 2.1 AA Standard', async () => {
      expect(axeScanResults.violations).toEqual([])
    })
  })
})

test.describe('Organisation Accessibility Tests - @accessibility @accessibility_contact', () => {
  test.use({ storageState: '.auth/contactManager.json' })

  test('Scan Organisation List Page with AXE Tool @access_orgList', async ({
    organisationsPage,
    makeAxeBuilder,
  }, testInfo) => {
    const axeScanner = makeAxeBuilder()
    let axeScanResults = await axeScanner.analyze()
    await test.step('Given I have navigated to the Organisation List Page', async () => {
      await organisationsPage.goto()
      await organisationsPage.assertOnOrganisationsPage()
    })

    await test.step('When I scan the Organisation List Page for Accessibility Errors', async () => {
      axeScanResults = await axeScanner
        .options({ reporter: 'v2' })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
    })

    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(axeScanResults, null, 2),
      contentType: 'application/json',
    })

    await test.step('Then I should receive no issue up to WCAG 2.1 AA Standard', async () => {
      expect(axeScanResults.violations).toEqual([])
    })
  })

  test('Scan Organisation Details Page with AXE Tool @access_orgDetails', async ({
    organisationDetailsPage,
    makeAxeBuilder,
  }, testInfo) => {
    const axeScanner = makeAxeBuilder()
    let axeScanResults = await axeScanner.analyze()
    await test.step('Given I have navigated to the Organisation Details Page with Success Alert', async () => {
      await organisationDetailsPage.gotoSuccess(startingOrgId.toString())
      await organisationDetailsPage.assertOnOrganisationDetailsPageWithSuccess(startingOrgId.toString())
    })

    await test.step('And all Validation Errors are on the page', async () => {
      await organisationDetailsPage.submitButton.click()
      await organisationDetailsPage.assertValidationErrorsPresent()
    })

    await test.step('When I scan the Organisation Details Page for Accessibility Errors', async () => {
      axeScanResults = await axeScanner
        .options({ reporter: 'v2' })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
    })

    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(axeScanResults, null, 2),
      contentType: 'application/json',
    })

    await test.step('Then I should receive no issue up to WCAG 2.1 AA Standard', async () => {
      expect(axeScanResults.violations).toEqual([])
    })
  })

  test('Scan Remove Contact Page with AXE Tool @access_removeContact', async ({
    removeContactPage,
    makeAxeBuilder,
  }, testInfo) => {
    const axeScanner = makeAxeBuilder()
    let axeScanResults = await axeScanner.analyze()
    await test.step('Given I have navigated to the Remove Contact Page', async () => {
      await removeContactPage.goto(userOrgRecordId.toString())
      await removeContactPage.assertOnRemoveContactPage(userOrgRecordId.toString())
    })

    await test.step('When I scan the Remove Contact Page for Accessibility Errors', async () => {
      axeScanResults = await axeScanner
        .options({ reporter: 'v2' })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
    })

    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(axeScanResults, null, 2),
      contentType: 'application/json',
    })

    await test.step('Then I should receive no issue up to WCAG 2.1 AA Standard', async () => {
      expect(axeScanResults.violations).toEqual([])
    })
  })
})

test.describe('Landing Page Accessibility Tests - @accessibility @accessibility_landing', () => {
  test.use({ storageState: '.auth/consentCookie.json' })

  test('Scan Create Password Page with AXE Tool @access_createPassword', async ({
    createPasswordPage,
    makeAxeBuilder,
  }, testInfo) => {
    const axeScanner = makeAxeBuilder()
    let axeScanResults = await axeScanner.analyze()
    await test.step('Given I have navigated to the Create Password Page', async () => {
      await createPasswordPage.goto(registrationToken)
      await createPasswordPage.assertOnCreatePasswordPage(registrationToken)
    })

    await test.step('And all Validation Errors are on the page', async () => {
      await createPasswordPage.saveButton.click()
      await createPasswordPage.assertValidationErrorsPresent()
    })

    await test.step('When I scan the Create Password Page for Accessibility Errors', async () => {
      axeScanResults = await axeScanner
        .options({ reporter: 'v2' })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
    })

    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(axeScanResults, null, 2),
      contentType: 'application/json',
    })

    await test.step('Then I should receive no issue up to WCAG 2.1 AA Standard', async () => {
      expect(axeScanResults.violations).toEqual([])
    })
  })

  test('Scan Signed Out Page with AXE Tool @access_SignedOut', async ({ signedOutPage, makeAxeBuilder }, testInfo) => {
    const axeScanner = makeAxeBuilder()
    let axeScanResults = await axeScanner.analyze()
    await test.step('Given I have navigated to the Signed Out Page', async () => {
      await signedOutPage.goto()
      await signedOutPage.assertOnSignedOutPage()
    })

    await test.step('When I scan the Signed Out Page for Accessibility Errors', async () => {
      axeScanResults = await axeScanner
        .options({ reporter: 'v2' })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
    })

    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(axeScanResults, null, 2),
      contentType: 'application/json',
    })

    await test.step('Then I should receive no issue up to WCAG 2.1 AA Standard', async () => {
      expect(axeScanResults.violations).toEqual([])
    })
  })
})
