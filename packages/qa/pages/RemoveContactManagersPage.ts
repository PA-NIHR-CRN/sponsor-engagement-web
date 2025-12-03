import { expect, Locator, Page } from '@playwright/test'
import { seDatabaseReq } from '../utils/DbRequests'

//Declare Page Objects
export default class RemoveContactManagersPage {
  readonly page: Page
  readonly pageTitle: Locator
  readonly removeContactSection: Locator
  readonly removeButton: Locator
  readonly cancelButton: Locator
  //Initialize Page Objects
  constructor(page: Page) {
    this.page = page

    //Locators
    this.pageTitle = page.locator('h2.govuk-heading-l')
    this.removeContactSection = page.locator('form[action="/api/forms/removeContact"]')
    this.removeButton = page.locator('button[type="submit"]')
    this.cancelButton = page.locator('a[class="govuk-link govuk-link--no-visited-state"]')
  }

  //Page Methods
  async goto(userId: string) {
    await this.page.goto(`contact-managers/remove-contact-manager/${userId}`)
  }

  async assertOnremoveContactManagersPage(userId: string) {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.pageTitle).toHaveText('Are you sure you want to remove this contact manager?')
    await expect(this.page).toHaveURL(`contact-managers/remove-contact-manager/${userId}`)
  }

  async getUserId(dbReq: string): Promise<string> {
    const results = await seDatabaseReq(dbReq)
    const userId = results[0].id
    return userId
  }
}
