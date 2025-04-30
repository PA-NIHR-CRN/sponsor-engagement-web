import { expect, Locator, Page } from '@playwright/test'
import { confirmStringNotNull, convertIsoDateToDisplayDate } from '../utils/UtilFunctions'

//Declare Page Objects
export default class AssessmentPage {
  readonly page: Page
  readonly allStudiesBreadcrumb: Locator
  readonly studyDetailsBreadcrumb: Locator
  readonly pageTitle: Locator
  readonly introText: Locator
  readonly sponsorLabel: Locator
  readonly studyTitle: Locator
  readonly cancelButton: Locator
  readonly submitButton: Locator
  readonly lastSponsorAssessmentLbl: Locator
  readonly noPrevAssessmentTxt: Locator
  readonly lastSponsorAssessmentRow: Locator
  readonly lastSponsorAssessmentDate: Locator
  readonly lastSponsorAssessmentText: Locator
  readonly lastSponsorAssessmentTrack: Locator
  readonly lastSponsorAssessmentFurtherInfo: Locator
  readonly lastSponsorAssessmentFurtherInfoBullets: Locator
  readonly lastSponsorAssessmentFurtherInfoText: Locator
  //Study Details Section
  readonly studyDetailsSection: Locator
  readonly studyDetailsIconClosed: Locator
  readonly studyDetailsIconOpen: Locator
  readonly studyDetailsSectionHeadingText: Locator
  readonly tableFullTitleHeader: Locator
  readonly tableFullTitleValue: Locator
  readonly tableIrasIdHeader: Locator
  readonly tableIrasIdValue: Locator
  readonly tableProtocolRefNoHeader: Locator
  readonly tableProtocolRefNoValue: Locator
  readonly tableCpmsIdHeader: Locator
  readonly tableCpmsIdValue: Locator
  readonly tableSponsorHeader: Locator
  readonly tableSponsorValue: Locator
  readonly tableManagingSpecialtyHeader: Locator
  readonly tableManagingSpecialtyValue: Locator
  readonly tableChiefInvestigatorHeader: Locator
  readonly tableChiefInvestigatorValue: Locator
  // Validation Errors
  readonly errorSummaryAlertBox: Locator
  readonly errorSummaryAlertBoxTitle: Locator
  readonly errorSummaryAlertBoxLink: Locator
  readonly errorFormGroup: Locator
  readonly errorFormGroupMessage: Locator
  // Form elements
  readonly studyProgressingSection: Locator
  readonly studyProgressSectionHeader: Locator
  readonly radioButtonOnTrack: Locator
  readonly radioButtonOnTrackLbl: Locator
  readonly radioButtonOnTrackTxt: Locator
  readonly radioButtonOffTrack: Locator
  readonly radioButtonOffTrackLbl: Locator
  readonly radioButtonOffTrackTxt: Locator
  readonly additionalInfoSection: Locator
  readonly additionalInfoSectionHeader: Locator
  readonly furtherInfoSectionHeader: Locator
  readonly furtherInfoTextArea: Locator
  readonly furtherInfoTextCharLimit: Locator
  // Additional Info Options
  readonly noLongerInUkInput: Locator
  readonly noLongerInUkLbl: Locator
  readonly waitingForHraInput: Locator
  readonly waitingForHraLbl: Locator
  readonly waitingForSiteInput: Locator
  readonly waitingForSiteLbl: Locator
  readonly seekingExtensionInput: Locator
  readonly seekingExtensionLbl: Locator
  readonly progressWithCrnInput: Locator
  readonly progressWithCrnLbl: Locator
  readonly discussionStakeholdersInput: Locator
  readonly discussionStakeholdersLbl: Locator
  readonly noRecruitmentInputInput: Locator
  readonly noRecruitmentInputLbl: Locator
  readonly closedToRecruitmentInput: Locator
  readonly closedToRecruitmentLbl: Locator
  readonly followUpCompleteInput: Locator
  readonly followUpCompleteLbl: Locator
  readonly progressToCloseInput: Locator
  readonly progressToCloseLbl: Locator

  //Initialize Page Objects
  constructor(page: Page) {
    this.page = page

    //Locators
    this.pageTitle = page.locator('h2[class="govuk-heading-l govuk-!-margin-bottom-4"]')
    this.allStudiesBreadcrumb = page.locator('.govuk-breadcrumbs__list > .govuk-breadcrumbs__list-item:nth-child(1)')
    this.studyDetailsBreadcrumb = page.locator('.govuk-breadcrumbs__list > .govuk-breadcrumbs__list-item:nth-child(2)')
    this.introText = page.locator('div[class="w-full"] p').nth(0)
    this.sponsorLabel = page.locator('div[class="text-darkGrey govuk-!-margin-bottom-0 govuk-body-s"]')
    this.studyTitle = page.locator('h3[class="govuk-heading-m govuk-!-margin-bottom-1"]')
    this.cancelButton = page.locator('a[class="govuk-button govuk-button--secondary"]')
    this.studyDetailsSection = page.locator('div[class="w-full govuk-!-margin-bottom-3"]')
    this.studyDetailsIconClosed = this.studyDetailsSection.locator('h3[data-state="closed"]')
    this.studyDetailsIconOpen = this.studyDetailsSection.locator('h3[data-state="open"]')
    this.studyDetailsSectionHeadingText = this.studyDetailsSection.locator('button div')
    this.tableFullTitleHeader = page.locator('th[scope="row"]', { hasText: 'Study full title' })
    this.tableFullTitleValue = this.tableFullTitleHeader.locator('..').locator('td')
    this.tableProtocolRefNoHeader = page.locator('th[scope="row"]', { hasText: 'Protocol reference number' })
    this.tableProtocolRefNoValue = this.tableProtocolRefNoHeader.locator('..').locator('td')
    this.tableIrasIdHeader = page.locator('th[scope="row"]', { hasText: 'IRAS ID' })
    this.tableIrasIdValue = this.tableIrasIdHeader.locator('..').locator('td')
    this.tableCpmsIdHeader = page.locator('th[scope="row"]', { hasText: 'CPMS ID' })
    this.tableCpmsIdValue = this.tableCpmsIdHeader.locator('..').locator('td')
    this.tableSponsorHeader = page.locator('th[scope="row"]', { hasText: 'Sponsor' })
    this.tableSponsorValue = this.tableSponsorHeader.locator('..').locator('td')
    this.tableManagingSpecialtyHeader = page.locator('th[scope="row"]', { hasText: 'Managing specialty' })
    this.tableManagingSpecialtyValue = this.tableManagingSpecialtyHeader.locator('..').locator('td')
    this.tableChiefInvestigatorHeader = page.locator('th[scope="row"]', { hasText: 'Chief investigator' })
    this.tableChiefInvestigatorValue = this.tableChiefInvestigatorHeader.locator('..').locator('td')
    this.submitButton = page.locator('button[type="submit"]')
    this.errorSummaryAlertBox = page.locator('div[class="govuk-error-summary"]')
    this.errorSummaryAlertBoxTitle = page.locator('h2[id="form-summary-errors"]')
    this.errorSummaryAlertBoxLink = page.locator('a[href="#status"]')
    this.errorFormGroup = page.locator('div[class="govuk-form-group govuk-form-group--error"]')
    this.errorFormGroupMessage = page.locator('p[id="status-error"]')
    this.lastSponsorAssessmentLbl = page.locator('h3[class="govuk-heading-m govuk-!-margin-bottom-1 p-0"]')
    this.noPrevAssessmentTxt = page.locator('p[class="govuk-body-s"]')
    this.studyProgressingSection = page.locator('fieldset[role="radiogroup"]')
    this.studyProgressSectionHeader = this.studyProgressingSection.locator('legend')
    this.radioButtonOnTrack = page.locator('input[id="status"]')
    this.radioButtonOnTrackLbl = page.locator('label[for="status"]')
    this.radioButtonOnTrackTxt = page.locator('div[id="status-hint"]')
    this.radioButtonOffTrack = page.locator('input[id="status-1"]')
    this.radioButtonOffTrackLbl = page.locator('label[for="status-1"]')
    this.radioButtonOffTrackTxt = page.locator('div[id="status-1-hint"]')
    this.additionalInfoSection = page.locator('div[class="govuk-checkboxes"]')
    this.additionalInfoSectionHeader = this.additionalInfoSection.locator('..').locator('legend')
    this.noLongerInUkInput = page.locator('input[id="furtherInformation"]')
    this.noLongerInUkLbl = page.locator('label[for="furtherInformation"]')
    this.waitingForHraInput = page.locator('input[id="furtherInformation-1"]')
    this.waitingForHraLbl = page.locator('label[for="furtherInformation-1"]')
    this.waitingForSiteInput = page.locator('input[id="furtherInformation-2"]')
    this.waitingForSiteLbl = page.locator('label[for="furtherInformation-2"]')
    this.seekingExtensionInput = page.locator('input[id="furtherInformation-3"]')
    this.seekingExtensionLbl = page.locator('label[for="furtherInformation-3"]')
    this.progressWithCrnInput = page.locator('input[id="furtherInformation-4"]')
    this.progressWithCrnLbl = page.locator('label[for="furtherInformation-4"]')
    this.discussionStakeholdersInput = page.locator('input[id="furtherInformation-5"]')
    this.discussionStakeholdersLbl = page.locator('label[for="furtherInformation-5"]')
    this.noRecruitmentInputInput = page.locator('input[id="furtherInformation-6"]')
    this.noRecruitmentInputLbl = page.locator('label[for="furtherInformation-6"]')
    this.closedToRecruitmentInput = page.locator('input[id="furtherInformation-7"]')
    this.closedToRecruitmentLbl = page.locator('label[for="furtherInformation-7"]')
    this.followUpCompleteInput = page.locator('input[id="furtherInformation-8"]')
    this.followUpCompleteLbl = page.locator('label[for="furtherInformation-8"]')
    this.progressToCloseInput = page.locator('input[id="furtherInformation-9"]')
    this.progressToCloseLbl = page.locator('label[for="furtherInformation-9"]')
    this.furtherInfoSectionHeader = page.locator('label[id="furtherInformationText-label"]')
    this.furtherInfoTextArea = page.locator('textarea[id="furtherInformationText"]')
    this.furtherInfoTextCharLimit = page.locator('div[id="with-hint-info"]')
    this.lastSponsorAssessmentRow = page.locator('div[class="govuk-!-margin-bottom-6"] button')
    this.lastSponsorAssessmentDate = this.lastSponsorAssessmentRow.locator('div')
    this.lastSponsorAssessmentText = this.lastSponsorAssessmentRow.locator(
      'span[class="ml-[35px] md:ml-0 govuk-body-s mb-0"]'
    )
    this.lastSponsorAssessmentTrack = this.lastSponsorAssessmentText.locator('strong')
    this.lastSponsorAssessmentFurtherInfo = page.locator('div[id="radix-:r5:"] div')
    this.lastSponsorAssessmentFurtherInfoBullets = this.lastSponsorAssessmentFurtherInfo.locator('ul li')
    this.lastSponsorAssessmentFurtherInfoText = this.lastSponsorAssessmentFurtherInfo.locator('p')
  }

  //Page Methods
  async goto(studyId: string) {
    await this.page.goto(`assessments/${studyId}`)
  }

  async assertOnAssessmentPage(studyId: string) {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.pageTitle).toHaveText('Assess progress of a study in the UK')
    await expect(this.page).toHaveURL(`assessments/${studyId}`)
  }

  async assertIntroText() {
    await expect(this.introText).toBeVisible()
    await expect(this.introText).toContainText(
      'You will need to assess if the study is on or off track in the UK and if any action is being taken'
    )
  }

  async assertStudySponsorPresent(expectedSponsor: string) {
    await expect(this.sponsorLabel).toBeVisible()
    const actualText = confirmStringNotNull(await this.sponsorLabel.textContent())
    const croCtuIndex = await this.getStartIndexForCtoCtuName(actualText)
    if (croCtuIndex != -1) {
      expect(actualText.substring(15, croCtuIndex).trim()).toEqual(expectedSponsor)
    } else {
      expect(actualText.substring(15).trim()).toEqual(expectedSponsor)
    }
  }

  async assertStudyCroCtuPresent(expectedCroCtu: string) {
    await expect(this.sponsorLabel).toBeVisible()
    const actualText = confirmStringNotNull(await this.sponsorLabel.textContent())
    const croCtuStartIndex = (await this.getStartIndexForCtoCtuName(actualText)) + 1
    const croCtuEndIndex = await this.getEndIndexForCtoCtuName(actualText)
    expect(actualText.substring(croCtuStartIndex, croCtuEndIndex).trim()).toEqual(expectedCroCtu)
  }

  async getStartIndexForCtoCtuName(textToCheck: string): Promise<number> {
    return textToCheck.indexOf('(')
  }

  async getEndIndexForCtoCtuName(textToCheck: string): Promise<number> {
    return textToCheck.lastIndexOf(')')
  }

  async assertStudyFullTitle(expectedTitle: string) {
    await expect(this.studyTitle).toBeVisible()
    const actualText = confirmStringNotNull(await this.studyTitle.textContent())
    expect(actualText.substring(12).trim()).toBe(expectedTitle.trim())
  }

  async assertStudyDetailsPresent() {
    await expect(this.studyDetailsSection).toBeVisible()
    await expect(this.studyDetailsSectionHeadingText).toHaveText('Show study details')
  }

  async assertStudyDetailsCollapsed(collapsed: boolean) {
    await expect(this.studyTitle).toBeVisible()
    if (collapsed) {
      await expect(this.studyDetailsIconClosed).toBeVisible()
      await expect(this.studyDetailsIconOpen).toBeHidden()
    } else {
      await expect(this.studyDetailsIconOpen).toBeVisible()
      await expect(this.studyDetailsIconClosed).toBeHidden()
    }
  }

  async assertStudyDetailFullTitle(expectedFullTitle: string) {
    await expect(this.tableFullTitleHeader).toBeVisible()
    await expect(this.tableFullTitleValue).toBeVisible()
    await expect(this.tableFullTitleValue).toHaveText(expectedFullTitle)
  }

  async assertProtocolRefNo(expectedProtocolRefNo: string) {
    if (expectedProtocolRefNo == 'false') {
      await expect(this.tableProtocolRefNoHeader).not.toBeVisible()
      await expect(this.tableProtocolRefNoValue).not.toBeVisible()
    } else {
      if (expectedProtocolRefNo == null) {
        expectedProtocolRefNo = 'None available'
      }
      await expect(this.tableProtocolRefNoHeader).toBeVisible()
      await expect(this.tableProtocolRefNoValue).toBeVisible()
      await expect(this.tableProtocolRefNoValue).toHaveText(expectedProtocolRefNo)
    }
  }

  async assertStudyIrasId(expectedIrasId: string) {
    if (expectedIrasId == null) {
      expectedIrasId = 'None available'
    }
    await expect(this.tableIrasIdHeader).toBeVisible()
    await expect(this.tableIrasIdValue).toBeVisible()
    await expect(this.tableIrasIdValue).toHaveText(expectedIrasId)
  }

  async assertStudyCpmsId(expectedCpmsId: string) {
    await expect(this.tableCpmsIdHeader).toBeVisible()
    await expect(this.tableCpmsIdValue).toBeVisible()
    await expect(this.tableCpmsIdValue).toHaveText(expectedCpmsId)
  }

  async assertStudySponsor(expectedSponsor: string) {
    await expect(this.tableSponsorHeader).toBeVisible()
    await expect(this.tableSponsorValue).toBeVisible()
    await expect(this.tableSponsorValue).toHaveText(expectedSponsor)
  }

  async assertManagingSpecialty(expectedManagingSpecialty: string) {
    await expect(this.tableManagingSpecialtyHeader).toBeVisible()
    await expect(this.tableManagingSpecialtyValue).toBeVisible()
    await expect(this.tableManagingSpecialtyValue).toHaveText(expectedManagingSpecialty)
  }

  async assertChiefInvestigator(expectedChiefFirstName: string, expectedChiefLastName: string) {
    let expectedChiefInvestigator: string
    if (expectedChiefFirstName == null) {
      expectedChiefInvestigator = 'None available'
    } else {
      expectedChiefInvestigator = expectedChiefFirstName + ' ' + expectedChiefLastName
    }
    await expect(this.tableChiefInvestigatorHeader).toBeVisible()
    await expect(this.tableChiefInvestigatorValue).toBeVisible()
    await expect(this.tableChiefInvestigatorValue).toHaveText(expectedChiefInvestigator)
  }

  async assertValidationErrorsPresent() {
    await expect(this.errorSummaryAlertBox).toBeVisible()
    await expect(this.errorFormGroup).toBeVisible()
    await expect(this.errorSummaryAlertBoxTitle).toHaveText('There is a problem')
    await expect(this.errorSummaryAlertBoxLink).toHaveText('Select how the study is progressing')
    await expect(this.errorFormGroupMessage).toContainText('Select how the study is progressing')
  }

  async assertLastSponsorSectionPresent() {
    await expect(this.lastSponsorAssessmentLbl).toBeVisible()
    await expect(this.lastSponsorAssessmentLbl).toHaveText('Last sponsor assessment')
  }
  async assertNoPreviousAssessment() {
    await expect(this.noPrevAssessmentTxt).toBeVisible()
    await expect(this.noPrevAssessmentTxt).toHaveText('This study has not had any assessments provided')
  }

  async assertStudyProgressingPresent() {
    await expect(this.studyProgressingSection).toBeVisible()
    await expect(this.studyProgressSectionHeader).toBeVisible()
    await expect(this.studyProgressSectionHeader).toHaveText('Is this study progressing in the UK as planned?')
  }

  async assertRadioButtonsPresent() {
    await expect(this.radioButtonOnTrack).toBeVisible()
    await expect(this.radioButtonOnTrackLbl).toBeVisible()
    await expect(this.radioButtonOnTrackTxt).toBeVisible()
    await expect(this.radioButtonOffTrack).toBeVisible()
    await expect(this.radioButtonOffTrackLbl).toBeVisible()
    await expect(this.radioButtonOffTrackTxt).toBeVisible()
    await expect(this.radioButtonOnTrackLbl).toHaveText('On track')
    await expect(this.radioButtonOnTrackTxt).toHaveText(
      'The sponsor or delegate is satisfied the study is progressing in the UK as planned.'
    )
    await expect(this.radioButtonOffTrackLbl).toHaveText('Off track')
    await expect(this.radioButtonOffTrackTxt).toHaveText(
      'The sponsor or delegate has some concerns about the study in the UK and is taking action where appropriate.'
    )
  }

  async assertRadioButtonSelected(input: string, isSelected: boolean) {
    let inputToTest: Locator
    switch (input.toLowerCase()) {
      case 'on':
        inputToTest = this.radioButtonOnTrack
        break
      case 'off':
        inputToTest = this.radioButtonOffTrack
        break
      default:
        throw new Error(`${input} is not a valid option`)
    }
    if (isSelected) {
      await expect(inputToTest).toBeChecked()
    } else {
      await expect(inputToTest).toBeChecked({ checked: false })
    }
  }

  async assertAdditionalInfoPresent() {
    await expect(this.additionalInfoSection).toBeVisible()
    await expect(this.additionalInfoSectionHeader).toBeVisible()
    await expect(this.additionalInfoSectionHeader).toHaveText(
      'Is there any additional information that would help NIHR RDN understand this progress assessment? (optional)'
    )
  }

  async assertAdditionalInfoOptionsPresent() {
    await expect(this.noLongerInUkInput).toBeVisible()
    await expect(this.waitingForHraInput).toBeVisible()
    await expect(this.waitingForSiteInput).toBeVisible()
    await expect(this.seekingExtensionInput).toBeVisible()
    await expect(this.progressWithCrnInput).toBeVisible()
    await expect(this.discussionStakeholdersInput).toBeVisible()
    await expect(this.noRecruitmentInputInput).toBeVisible()
    await expect(this.closedToRecruitmentInput).toBeVisible()
    await expect(this.followUpCompleteInput).toBeVisible()
    await expect(this.progressToCloseInput).toBeVisible()
    await expect(this.noLongerInUkLbl).toHaveText('Study no longer going ahead in the UK [withdrawn during setup]')
    await expect(this.waitingForHraLbl).toHaveText('Waiting for HRA or MHRA approvals')
    await expect(this.waitingForSiteLbl).toHaveText('Waiting for site approval or activation')
    await expect(this.seekingExtensionLbl).toHaveText('In process of seeking an extension or protocol amendment')
    await expect(this.progressWithCrnLbl).toHaveText(
      'Work in progress with RDN to update key milestones and recruitment activity'
    )
    await expect(this.discussionStakeholdersLbl).toHaveText('In discussion with stakeholders to agree next steps')
    await expect(this.noRecruitmentInputLbl).toHaveText(
      'No recruitment expected within the last 90 days, in line with the study plan'
    )
    await expect(this.closedToRecruitmentLbl).toHaveText('Study closed to recruitment, in follow up')
    await expect(this.followUpCompleteLbl).toHaveText('Follow up complete or none required')
    await expect(this.progressToCloseLbl).toHaveText('Work in progress to close study in the UK')
  }

  async assertFurtherInfoPresent() {
    await expect(this.furtherInfoSectionHeader).toBeVisible()
    await expect(this.furtherInfoSectionHeader).toHaveText('Further information (optional)')
  }

  async assertFurtherInfoTextAreaPresent() {
    await expect(this.furtherInfoTextArea).toBeVisible()
  }

  async assertFurtherInfoCharLimitPresent() {
    await expect(this.furtherInfoTextCharLimit).toBeVisible()
    await expect(this.furtherInfoTextCharLimit).toHaveText('You have 400 characters remaining')
  }

  async assertSubmitButtonPresent() {
    await expect(this.submitButton).toBeVisible()
    await expect(this.submitButton).toHaveText('Submit assessment')
  }

  async assertCancelButtonPresent() {
    await expect(this.cancelButton).toBeVisible()
    await expect(this.cancelButton).toHaveText('Cancel')
  }

  async assertFurtherInfoCharsRemaining(value: number) {
    await expect(this.furtherInfoTextCharLimit).toHaveText(`You have ${value} characters remaining`)
  }

  async assertOnTrackFocused() {
    await expect(this.radioButtonOnTrack).toBeFocused()
  }

  async assertLastSponsorAssessmentPresent() {
    await expect(this.lastSponsorAssessmentRow).toBeVisible()
  }

  async assertLastSponsorAssessmentCollapsed(collapsed: boolean) {
    if (collapsed) {
      await expect(this.lastSponsorAssessmentRow).toHaveAttribute('data-state', 'closed')
    } else {
      await expect(this.lastSponsorAssessmentRow).toHaveAttribute('data-state', 'open')
    }
  }

  async assertlastSponsorAssessmentDate() {
    await expect(this.lastSponsorAssessmentDate).toBeVisible()
    const todaysDate = convertIsoDateToDisplayDate(new Date())
    await expect(this.lastSponsorAssessmentDate).toHaveText(todaysDate)
  }

  async assertLastSponsorAssessmentOnOffTrack(option: string) {
    if (option.toLowerCase() == 'on') {
      await expect(this.lastSponsorAssessmentTrack).toContainText('On track')
    } else {
      await expect(this.lastSponsorAssessmentTrack).toContainText('Off track')
    }
  }

  async assertAssessedBy() {
    await expect(this.lastSponsorAssessmentText).toContainText('assessed by sesponsorcontact@test.id.nihr.ac.uk')
  }

  async assertAssessmentFurtherInfoSelections(bulletIndex: number, expectedValue: string) {
    await expect(this.lastSponsorAssessmentFurtherInfoBullets.nth(bulletIndex)).toHaveText(expectedValue)
  }

  async assertAssessmentFurtherInfoText(expectedValue: string) {
    await expect(this.lastSponsorAssessmentFurtherInfoText).toHaveText(expectedValue)
  }
}
