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
    this.pageTitle = page.locator('h2', { hasText: 'You are signed out' })
    this.pageText = page.locator('p', { hasText: 'Please sign in to access this application.' })
    this.btnSignIn = page.locator('a[class="govuk-button"]')
  }

  //Page Methods
  async goto() {
    await this.page.goto('auth/signout/confirmation')
  }

  async assertOnSignedOutPage() {
    await expect(this.pageTitle).toBeVisible({ timeout: 10000 })
    await expect(this.pageText).toBeVisible({ timeout: 10000 })
    await expect(this.pageText).toHaveText('Please sign in to access this application.')
    await expect(this.page).toHaveURL(/auth\/signout\/confirmation/)
  }
}
