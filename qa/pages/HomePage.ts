import { expect, Locator, Page } from '@playwright/test'

//Declare Page Objects
export default class HomePage {
  readonly page: Page
  readonly pageTitle: Locator

  //Initialize Page Objects
  constructor(page: Page) {
    this.page = page

    //Locators
    this.pageTitle = page.locator('h1[class="govuk-panel__title heading-underscore pt-1"]')
  }

  //Page Methods
  async goto() {
    await this.page.goto('')
    await this.page.pause()
  }

  async assertOnHomePage() {
    await expect(this.page).toHaveURL('')
    await expect(this.pageTitle).toBeVisible()
    // await expect(this.btnProviders).toBeVisible()
    await expect(this.pageTitle).toHaveText('Welcome to Find, Recruit and Follow-up')
  }
}
