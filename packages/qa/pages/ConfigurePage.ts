import { expect, Locator, Page } from '@playwright/test'

//Declare Page Objects
export default class {
  readonly page: Page
  readonly pageTitle: Locator
  readonly studyPanelHeading: Locator
  readonly studySetUpProgressBar: Locator
  readonly firstParticipantHeading: Locator
  readonly firstParticipantRadioYes: Locator
  readonly firstParticipantRadioNo: Locator
  readonly reasonForNoRecruitmentLabel: Locator
  readonly reasonForNoRecruitmentTextArea: Locator
  readonly updateButton: Locator

  //Initialize Page Objects
  constructor(page: Page) {
    this.page = page
    this.pageTitle = page.locator('h2[class="govuk-heading-l govuk-!-margin-bottom-4"]')
    this.studyPanelHeading = page.locator(
      'h3[class="govuk-heading-m govuk-!-margin-bottom-1 govuk-!-margin-top-4 p-0"]'
    )
    this.studySetUpProgressBar = page.locator('progress[class="progress-bar progress-bar-error govuk-!-width-full"]')
    this.firstParticipantHeading = page.locator('legend[class="govuk-fieldset__legend govuk-fieldset__legend--m"]')
    this.firstParticipantRadioYes = page.locator('input[id="status"]')
    this.firstParticipantRadioNo = page.locator('input[id="status-1"]')
    this.reasonForNoRecruitmentLabel = page.locator('label[class="govuk-label govuk-label--m"]')
    this.reasonForNoRecruitmentTextArea = page.locator('textarea[id="noReason"]')
    this.updateButton = page.locator('button[class="govuk-button"]')
  }
  //Page Methods
  async assertOnConfigurePage() {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.pageTitle).toHaveText(`Progress of UK Study Set-up`)
    await expect(this.page).toHaveURL('studies/17526/configure')
  }

  async assertStudySetUpPanel() {
    await expect(this.studyPanelHeading).toBeVisible()
    await expect(this.studySetUpProgressBar).toBeVisible()
  }

  async assertFirstParticipantFieldset() {
    await expect(this.firstParticipantHeading).toContainText('first participant')
    await expect(this.firstParticipantRadioYes).toBeChecked()
    await expect(this.firstParticipantRadioNo).not.toBeChecked()
  }

  async assertNoReasonFormGroup() {
    await expect(this.reasonForNoRecruitmentLabel).toContainText('explain why')
    await expect(this.studySetUpProgressBar).toBeVisible()
  }
}
