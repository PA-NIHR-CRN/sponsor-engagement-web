import { expect, Locator, Page } from '@playwright/test'

//Declare Page Objects
export default class SignedOutPage {
  readonly page: Page
  readonly pageTitle: Locator
  readonly pageText: Locator
  readonly btnSignIn: Locator

  //Initialize Page Objects
  constructor(page: Page) {
    this.page = page

    //Locators
    this.pageTitle = page.locator('h2.govuk-heading-l', { hasText: 'You are signed out' })
    this.pageText = page.locator('div[class="govuk-width-container govuk-!-padding-left-6 govuk-!-padding-right-6"] p')
    this.btnSignIn = page.locator('a[class="govuk-button"]')
  }

  //Page Methods
  async goto() {
    await this.page.goto('auth/signout/confirmation')
  }

  async assertOnSignedOutPage() {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.pageText).toBeVisible()
    await expect(this.pageText).toHaveText('Please sign in to access this application.')
    await expect(this.page).toHaveURL('auth/signout/confirmation')
  }
}
