import { expect, Locator, Page } from '@playwright/test'

//Declare Page Objects
export default class StudiesPage {
  readonly page: Page
  readonly pageTitle: Locator

  //Initialize Page Objects
  constructor(page: Page) {
    this.page = page

    //Locators
    this.pageTitle = page.locator('h2[class="govuk-heading-l govuk-!-margin-bottom-4"]')
  }

  //Page Methods
  async goto() {
    await this.page.goto('studies')
  }

  async assertOnStudiesPage() {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.pageTitle).toHaveText('Assess progress of studies')
    await expect(this.page).toHaveURL('studies')
  }
}
