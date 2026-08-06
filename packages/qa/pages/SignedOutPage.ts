import { expect, Locator, Page } from '@playwright/test'

//Declare Page Objects
export default class SignedOutPage {
  readonly page: Page
  readonly pageTitle: Locator
  readonly pageText: Locator
  readonly signOutLink: Locator
  readonly btnSignIn: Locator

  //Initialize Page Objects
  constructor(page: Page) {
    this.page = page

    //Locators
    this.pageTitle = page.locator('h2[class="govuk-heading-l"]', { hasText: 'You are signed out' })
    this.pageText = page.locator('p', { hasText: 'Please sign in to access this application.' })
    this.signOutLink = page.locator('a', { hasText: 'Sign out' })
    this.btnSignIn = page.locator('a[class="govuk-button"]')
  }

  //Page Methods
  async goto() {
    await this.page.goto('auth/signout/confirmation')
  }

  async assertOnSignedOutPage() {
    try {
      await expect(this.pageTitle).toBeVisible()
    } catch {
      await this.signOutLink.click({ timeout: 10000 })
      await expect(this.pageTitle).toBeVisible()
    }
    await expect(this.pageText).toBeVisible()
    await expect(this.pageText).toHaveText('Please sign in to access this application.')
    await expect(this.page).toHaveURL('auth/signout/confirmation')
  }
}
