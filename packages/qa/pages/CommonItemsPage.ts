import { expect, Locator, Page } from '@playwright/test'
import { confirmStringNotNull, numDaysBetween } from '../utils/UtilFunctions'
import { seDatabaseReq } from '../utils/DbRequests'

//Declare Page Objects
export default class CommonItemsPage {
  readonly page: Page
  readonly pageTitle: Locator
  readonly txtUsageGuidance: Locator
  readonly txtContactInfo: Locator
  readonly homeIcon: Locator
  readonly manageContactsIcon: Locator
  readonly assessStudiesDropdown: Locator
  readonly studiesFoundHeading: Locator
  readonly txtGenericErrorGuidance: Locator
  readonly requestSupportSection: Locator
  readonly requestSupportHeader: Locator
  readonly requestSupportText: Locator
  readonly requestSupportButton: Locator
  readonly downloadStudyDataSection: Locator
  readonly downloadStudyDataHeader: Locator
  readonly downloadStudyDataText: Locator
  readonly exportStudyDataButton: Locator
  readonly usernameBanner: Locator
  readonly cogIcon: Locator
  readonly logoutOption: Locator

  //Initialize Page Objects
  constructor(page: Page) {
    this.page = page

    //Locators
    this.pageTitle = page.locator('h2[class="govuk-heading-l"]')
    this.txtUsageGuidance = page.locator('p[class="govuk-body"]').nth(0)
    this.txtContactInfo = page.locator('p[class="govuk-body"]').nth(1)
    this.homeIcon = page.locator('svg[data-testid="home-icon"]')
    this.manageContactsIcon = page.locator('a[href="/organisations"]')
    this.assessStudiesDropdown = page.locator('span[class="govuk-details__summary-text"]')
    this.studiesFoundHeading = page.locator('p[class="govuk-heading-s mb-0 whitespace-nowrap"]')
    this.txtGenericErrorGuidance = page.locator('p[class="govuk-body"]')
    this.requestSupportSection = page.locator('div[data-testid="request-support"]')
    this.requestSupportHeader = this.requestSupportSection.locator('h3')
    this.requestSupportText = this.requestSupportSection.locator('p')
    this.requestSupportButton = this.requestSupportSection.locator('a')
    this.downloadStudyDataSection = page.locator('div[data-testid="export-study-data"]').first()
    this.downloadStudyDataHeader = this.downloadStudyDataSection.locator('h3')
    this.downloadStudyDataText = this.downloadStudyDataSection.locator('p')
    this.exportStudyDataButton = this.downloadStudyDataSection.locator('a')
    this.usernameBanner = page.locator('span[class="hidden text-sm md:block"]')
    this.cogIcon = page.locator('button[aria-haspopup="menu"]')
    this.logoutOption = page.locator('a[role="menuitem"]')
  }

  //Page Methods
  async goto() {
    await this.page.goto('')
  }

  async assertOnHomePageNoAccount() {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.txtUsageGuidance).toBeVisible()
    await expect(this.txtContactInfo).toBeVisible()
    await expect(this.pageTitle).toHaveText('Your details are not associated with any account on this application')
    await expect(this.txtUsageGuidance).toHaveText(
      'The Sponsor Engagement Tool is for use by project sponsors or their delegates in CRO/CTU organisations only.'
    )
    await expect(this.txtContactInfo).toHaveText('Please contact supportmystudy@nihr.ac.uk for further assistance.')
    await expect(this.page).toHaveURL('')
  }

  async assertManageContactsPermissions(visible: boolean) {
    if (visible) {
      await expect(this.manageContactsIcon).toBeVisible()
    } else {
      await expect(this.manageContactsIcon).toBeHidden()
    }
  }

  async assertSponsorContactPermissions(permitted: boolean) {
    if (permitted) {
      await expect(this.assessStudiesDropdown).toBeVisible()
      await expect(this.studiesFoundHeading).toBeVisible()
      await expect(this.studiesFoundHeading).toContainText('studies found')
      await expect(this.studiesFoundHeading).toContainText('due for assessment')
    } else {
      await expect(this.assessStudiesDropdown).toBeHidden()
      await expect(this.studiesFoundHeading).toBeHidden()
    }
  }

  async gotoErrorPage() {
    await this.page.goto('500')
  }

  async assertOnGenericErrorPage() {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.txtGenericErrorGuidance).toBeVisible()
    await expect(this.pageTitle).toHaveText('Sorry, there is a problem with the service')
    await expect(this.txtGenericErrorGuidance).toHaveText(
      'Please contact crn.servicedesk@nihr.ac.uk for further assistance.'
    )
    await expect(this.page).toHaveURL('500')
  }

  async assertRequestSupportPresent() {
    await expect(this.requestSupportSection).toBeVisible()
    await expect(this.requestSupportHeader).toBeVisible()
    await expect(this.requestSupportHeader).toHaveText('Request NIHR RDN support')
  }

  async assertRequestSupportGuidanceText(pageContext: string) {
    await expect(this.requestSupportText).toBeVisible()
    if (pageContext.toLowerCase() == 'list') {
      await expect(this.requestSupportText).toHaveText(
        'Sponsors or their delegates can request NIHR RDN support with their research study at any time.' +
          ' Click into your study for study level support guidance.'
      )
    } else {
      await expect(this.requestSupportText).toHaveText(
        'Sponsors or their delegates can request NIHR RDN support with their research study at any time.'
      )
    }
  }

  async assertRequestSupportButtonPresent(visible: boolean) {
    if (visible) {
      await expect(this.requestSupportButton).toBeVisible()
      const actualText = confirmStringNotNull(await this.requestSupportButton.textContent())
      expect(actualText.trim()).toEqual('Request support')
    } else {
      await expect(this.requestSupportButton).toBeHidden()
    }
  }

  async assertDownloadStudyDataPresent() {
    await expect(this.downloadStudyDataSection).toBeVisible()
    await expect(this.downloadStudyDataHeader).toBeVisible()
    await expect(this.downloadStudyDataHeader).toHaveText('Download study data')
  }

  async assertDownloadStudyDataGuidanceText() {
    await expect(this.downloadStudyDataText).toBeVisible()
    await expect(this.downloadStudyDataText).toHaveText(
      'This download is a snapshot of all the information held within the Sponsor Engagement Tool for the sponsor/delegate organisation.'
    )
  }

  async assertDownloadStudyDataButtonPresent() {
    await expect(this.exportStudyDataButton).toBeVisible()
    await expect(this.exportStudyDataButton).toHaveText('Download')
  }

  async assertStudyHasNullOpeningDate(dbReq: string, isNull: boolean) {
    const result = await seDatabaseReq(`${dbReq}`)
    if (isNull) {
      expect(result[0].actualOpeningDate).toBeNull()
    } else {
      expect(result[0].actualOpeningDate).not.toBeNull()
    }
  }

  async assertStudyHasRisksInDb(dbReq: string, hasRisks: boolean) {
    const result = await seDatabaseReq(`${dbReq}`)
    if (hasRisks) {
      expect(result.length).toBeGreaterThan(0)
    } else {
      expect(result.length).toEqual(0)
    }
  }

  async assertLastAssessmentLongerThanThreeMonths(dbReq: string) {
    const result = await seDatabaseReq(`${dbReq}`)
    const lastAssessmentDate = result[0].createdAt
    const currentDate = new Date()
    const daysDifference = numDaysBetween(currentDate, lastAssessmentDate)
    expect(daysDifference).toBeGreaterThanOrEqual(90)
  }

  async assertActualOpeningDateLongerThanThreeMonths(dbReq: string) {
    const result = await seDatabaseReq(`${dbReq}`)
    const actualOpeningDate = result[0].actualOpeningDate
    const currentDate = new Date()
    const daysDifference = numDaysBetween(currentDate, actualOpeningDate)
    expect(daysDifference).toBeGreaterThanOrEqual(90)
  }

  async assertStudyHasNoPrevAssessment(dbReq: string) {
    const result = await seDatabaseReq(`${dbReq}`)
    expect(result.length).toEqual(0)
  }

  async assertStudyHasNoRisks(dbReq: string) {
    const result = await seDatabaseReq(`${dbReq}`)
    expect(result.length).toEqual(0)
  }

  async assertUsernamePresent(visible: boolean, username: string) {
    if (visible) {
      await expect(this.usernameBanner).toBeVisible()
      await expect(this.usernameBanner).toHaveText(`${username}`)
    } else {
      await expect(this.usernameBanner).toBeHidden()
    }
  }

  async assertCogIconPresent(visible: boolean) {
    if (visible) {
      await expect(this.cogIcon).toBeVisible()
    } else {
      await expect(this.cogIcon).toBeHidden()
    }
  }

  async assertLogoutOptionVisible() {
    await expect(this.logoutOption).toBeVisible()
    await expect(this.logoutOption).toHaveText('Logout')
  }
}
