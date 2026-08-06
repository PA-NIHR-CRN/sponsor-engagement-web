import { expect, Locator, Page } from '@playwright/test'

//Declare Page Objects
export default class RequestSupportPage {
  readonly page: Page
  readonly pageTitle: Locator
  readonly pageTitleHelpAndSupport: Locator
  readonly pageContentSection: Locator
  readonly guidanceTextLink: Locator
  readonly returnPreviousButton: Locator

  //Initialize Page Objects
  constructor(page: Page) {
    this.page = page

    //Locators
    this.pageTitle = page.locator('h2[class="govuk-heading-m"]', {
      hasText: 'Request NIHR RDN support',
    })
    this.pageTitleHelpAndSupport = page.locator('h2[class="govuk-heading-m"]', {
      hasText: 'Help and Support Using the Sponsor Engagement Tool',
    })
    this.pageContentSection = page.locator('.govuk-grid-column-two-thirds')
    this.guidanceTextLink = page.getByRole('link', { name: 'your local network' })
    this.returnPreviousButton = page.getByRole('link', { name: 'Return to previous page' })
  }

  //Page Methods
  async goto(studyId: string) {
    await this.page.goto(`request-support?returnPath=/studies/${studyId}`)
  }

  async assertOnRequestSupportPageViaDetails(studyId: string) {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.pageTitleHelpAndSupport).toBeVisible()
    await expect(this.page).toHaveURL(new RegExp(`request-support\\?returnPath=/studies/${studyId}$`))
  }

  async assertOnRequestSupportPageViaAssess(studyId: string) {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.pageTitleHelpAndSupport).toBeVisible()
    await expect(this.page).toHaveURL(new RegExp(`request-support\\?returnPath=/studies/${studyId}/assess$`))
  }

  async assertGuidanceTextContains() {
    await expect(this.pageContentSection).toContainText(
      'Contact your local network if you would like to discuss how the NIHR RDN may be able to support you'
    )

    await expect(this.pageContentSection).toContainText(
      'All NIHR RDN Portfolio studies are able to access the NIHR RDN Study Support Service'
    )

    await expect(this.pageContentSection).toContainText('the NIHR RDN will work in partnership to support you')

    await expect(this.pageContentSection).toContainText('how the NIHR RDN can support your study:')

    await expect(this.pageContentSection).toContainText('Supporting study-wide planning activities')

    await expect(this.pageContentSection).toContainText('Research delivery advice')

    await expect(this.pageContentSection).toContainText('Discuss site issues')

    await expect(this.pageContentSection).toContainText('Advice regarding engagement')

    await expect(this.pageContentSection).toContainText('Clinical advice')

    await expect(this.pageContentSection).toContainText('Support to overcome barriers')
  }

  async assertRdnLinkPresent() {
    await expect(this.guidanceTextLink).toBeVisible()
    await expect(this.guidanceTextLink).toHaveAttribute('href', 'https://www.nihr.ac.uk/study-support-service-contacts')
  }

  async assertReturnPreviousPresent() {
    await expect(this.returnPreviousButton).toBeVisible()
    await expect(this.returnPreviousButton).toHaveText('Return to previous page')
  }
}
