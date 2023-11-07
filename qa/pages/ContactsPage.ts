import { expect, Locator, Page } from '@playwright/test'

//Declare Page Objects
export default class HomePage {
  readonly page: Page
  readonly pageTitle: Locator
  readonly txtPageInfo: Locator

  //Initialize Page Objects
  constructor(page: Page) {
    this.page = page

    //Locators
    this.pageTitle = page.locator('h2[class="govuk-heading-l"]')
    this.txtPageInfo = page.locator('p[class="govuk-body"]')
  }

  //Page Methods
  async goto() {
    await this.page.goto('')
  }

  async assertOnContactsPage() {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.txtPageInfo).toBeVisible()
    await expect(this.pageTitle).toHaveText('Manage sponsor contacts')
    await expect(this.txtPageInfo).toHaveText('Add and remove contacts for sponsor organisations.')
    await expect(this.page).toHaveURL('organisations')
  }
}
