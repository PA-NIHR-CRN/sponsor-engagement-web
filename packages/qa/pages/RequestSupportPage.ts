import { expect, Locator, Page } from '@playwright/test'

//Declare Page Objects
export default class RequestSupportPage {
  readonly page: Page
  readonly pageTitle: Locator
  readonly pageContentSection: Locator
  readonly guidanceTextParagraphs: Locator
  readonly guidanceTextBullets: Locator
  readonly guidanceTextLink: Locator
  readonly returnPreviousButton: Locator

  //Initialize Page Objects
  constructor(page: Page) {
    this.page = page

    //Locators
    this.pageTitle = page.locator('h1[class="govuk-heading-l"]')
    this.pageContentSection = page.locator('div[class="govuk-grid-column-two-thirds"]')
    this.guidanceTextParagraphs = this.pageContentSection.locator('p')
    this.guidanceTextBullets = this.pageContentSection.locator(' ul li')
    this.guidanceTextLink = this.guidanceTextParagraphs.nth(0).locator('a')
    this.returnPreviousButton = page.locator('a[class="govuk-button govuk-!-margin-top-2"]')
  }

  //Page Methods
  async goto(studyId: string) {
    await this.page.goto(`request-support?returnPath=/studies/${studyId}`)
  }

  async assertOnRequestSupportPageViaDetails(studyId: string) {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.pageTitle).toHaveText('Request NIHR CRN support')
    await expect(this.page).toHaveURL(`request-support?returnPath=/studies/${studyId}`)
  }

  async assertOnRequestSupportPageViaAssess(studyId: string) {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.pageTitle).toHaveText('Request NIHR CRN support')
    await expect(this.page).toHaveURL(`request-support?returnPath=/assessments/${studyId}`)
  }

  async assertGuidanceTextContains() {
    await expect(this.guidanceTextParagraphs.nth(0)).toBeVisible()
    await expect(this.guidanceTextBullets.nth(0)).toBeVisible()
    await expect(this.guidanceTextParagraphs.nth(0)).toContainText(
      'Contact your local CRN if you would like to discuss how the NIHR CRN may be able to support you'
    )
    await expect(this.guidanceTextParagraphs.nth(1)).toContainText(
      'All NIHR CRN Portfolio studies are able to access the NIHR CRN Study Support Service'
    )
    await expect(this.guidanceTextParagraphs.nth(2)).toContainText(
      'the NIHR CRN will work in partnership to support you'
    )
    await expect(this.guidanceTextParagraphs.nth(3)).toContainText('how the NIHR CRN can support your study:')
    await expect(this.guidanceTextBullets.nth(0)).toContainText('Supporting study-wide planning activities')
    await expect(this.guidanceTextBullets.nth(1)).toContainText('Research delivery advice')
    await expect(this.guidanceTextBullets.nth(2)).toContainText('Discuss site issues')
    await expect(this.guidanceTextBullets.nth(3)).toContainText('Advice regarding engagement')
    await expect(this.guidanceTextBullets.nth(4)).toContainText('Clinical advice')
    await expect(this.guidanceTextBullets.nth(5)).toContainText('Support to overcome barriers')
  }

  async assertCrnLinkPresent() {
    await expect(this.guidanceTextLink).toBeVisible()
    await expect(this.guidanceTextLink).toHaveAttribute(
      'href',
      `https://www.nihr.ac.uk/documents/study-support-service-contacts/11921`
    )
  }

  async assertReturnPreviousPresent() {
    await expect(this.returnPreviousButton).toBeVisible()
    await expect(this.returnPreviousButton).toHaveText('Return to previous page')
  }
}
