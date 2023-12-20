import { expect, Locator, Page } from '@playwright/test'

//Declare Page Objects
export default class CommonItemsPage {
  readonly page: Page
  readonly pageTitle: Locator
  readonly txtContactInfo: Locator
  readonly homeIcon: Locator
  readonly manageContactsIcon: Locator
  readonly assessStudiesDropdown: Locator
  readonly studiesFoundHeading: Locator

  //Initialize Page Objects
  constructor(page: Page) {
    this.page = page

    //Locators
    this.pageTitle = page.locator('h2[class="govuk-heading-l"]')
    this.txtContactInfo = page.locator('p[class="govuk-body"]')
    this.homeIcon = page.locator('svg[data-testid="home-icon"]')
    this.manageContactsIcon = page.locator('a[href="/organisations"]')
    this.assessStudiesDropdown = page.locator('span[class="govuk-details__summary-text"]')
    this.studiesFoundHeading = page.locator('p[class="govuk-heading-s mb-0 whitespace-nowrap"]')
  }

  //Page Methods
  async goto() {
    await this.page.goto('')
  }

  async assertOnHomePageNoAccount() {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.txtContactInfo).toBeVisible()
    await expect(this.pageTitle).toHaveText('Your details are not associated with any account on this application')
    await expect(this.txtContactInfo).toHaveText('Please contact crn.servicedesk@nihr.ac.uk for further assistance.')
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
}
