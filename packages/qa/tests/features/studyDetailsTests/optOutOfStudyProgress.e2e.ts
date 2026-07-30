import { test, expect } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'

const testUserId = 6
const startingOrgId = 12

test.describe('Opt Out Of Study Progress - @se_327', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('As a Sponsor Contact I can see Needs Action for studies that are due assessment - @Se_315_AC3', async ({
    studiesPage,
    studyDetailsPage,
    configurePage,
  }) => {
    await seDatabaseReq(
      `UPDATE UserOrganisation SET organisationId = ${startingOrgId} WHERE userId = ${testUserId} AND isDeleted = 0`
    )
    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
    })

    await test.step('When I am on the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })

    await test.step('And I search for a study that is over target', async () => {
      await studiesPage.enterSearchPhrase('45946')
    })

    await test.step(`When I click the View Study button of any Study on the Study List`, async () => {
      await studiesPage.viewStudyButton.nth(0).click()
    })

    await test.step(`Then I am taken to the Details page`, async () => {
      await expect(studyDetailsPage.pageTitle).toBeVisible()
    })

    await test.step(`Then I should be able to see the studies setup progress bar`, async () => {
      await expect(studyDetailsPage.studySetUpProgressBar).toBeVisible()
    })

    await test.step(`Then I Click the more details link`, async () => {
      await studyDetailsPage.moreDetailsLink.click()
    })

    await test.step(`Then I am directed to the study configure page`, async () => {
      await configurePage.assertOnConfigurePage()
    })

    await test.step(`Where I can see the progress of study setup panel`, async () => {
      await configurePage.assertStudySetUpPanel()
    })

    await test.step(`Then I can see the first participant Field Set where yes should be selected`, async () => {
      await configurePage.assertFirstParticipantFieldset()
    })

    await test.step(`When I select that the first participant won't be recruited within 90 days`, async () => {
      await configurePage.firstParticipantRadioNo.check()
    })

    await test.step(`Then I should see a form group, asking me to explain why`, async () => {
      await configurePage.assertNoReasonFormGroup()
    })

    await test.step(`And I fill the textarea with a reason`, async () => {
      await configurePage.reasonForNoRecruitmentTextArea.fill('Test')
    })

    await test.step(`And I click update`, async () => {
      await configurePage.updateButton.click()
    })

    await test.step(`Then I should be taken back to the study details page with a success message`, async () => {
      await studyDetailsPage.assertOnStudyDetailsPageWithSuccessMessage('17526')
    })

    await test.step(`And I should no longer see a study setup progress bar`, async () => {
      await expect(studyDetailsPage.studySetUpProgressBar).not.toBeVisible()
    })

    await test.step(`And I should no longer see a study setup progress bar`, async () => {
      await expect(studyDetailsPage.studySetUpProgressBar).not.toBeVisible()
    })

    await test.step(`And I should see a no expectation to achieve message`, async () => {
      await expect(studyDetailsPage.noExpectationToAchieveMessage).toBeVisible()
    })

    await test.step(`Then If I click more details`, async () => {
      await studyDetailsPage.moreDetailsLink.click()
    })

    await test.step(`Then I should directed to the configure page`, async () => {
      await configurePage.assertOnConfigurePage()
    })

    await test.step(`Then can change my answer to Yes`, async () => {
      await expect(configurePage.firstParticipantRadioNo).toBeChecked()
      await configurePage.firstParticipantRadioYes.click()
    })

    await test.step(`And I click update`, async () => {
      await configurePage.updateButton.click()
    })

    await test.step(`Then I should be taken back to the study details page with a success message`, async () => {
      await studyDetailsPage.assertOnStudyDetailsPageWithSuccessMessage('17526')
    })

    await test.step(`And I should see the progress Study bar again`, async () => {
      await expect(studyDetailsPage.studySetUpProgressBar).toBeVisible()
    })
  })
})
