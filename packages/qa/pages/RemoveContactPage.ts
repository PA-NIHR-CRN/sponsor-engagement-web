import { expect, Locator, Page } from '@playwright/test'
import { seDatabaseReq } from '../utils/DbRequests'

//Declare Page Objects
export default class RemoveContactPage {
  readonly page: Page
  readonly pageTitle: Locator
  readonly removeContactSection: Locator
  readonly removeButton: Locator
  readonly cancelButton: Locator
  //Initialize Page Objects
  constructor(page: Page) {
    this.page = page

    //Locators
    this.pageTitle = page.locator('h2[class="govuk-heading-l"]')
    this.removeContactSection = page.locator('form[action="/api/forms/removeContact"]')
    this.removeButton = page.locator('button[type="submit"]')
    this.cancelButton = page.locator('a[class="govuk-link govuk-link--no-visited-state"]')
  }

  //Page Methods
  async goto(userOrgId: string) {
    await this.page.goto(`organisations/remove-contact/${userOrgId}`)
  }

  async assertOnRemoveContactPage(userOrgId: string) {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.pageTitle).toHaveText('Are you sure you want to remove this contact?')
    await expect(this.page).toHaveURL(`organisations/remove-contact/${userOrgId}`)
  }

  async getUserOrgId(dbReq: string): Promise<string> {
    const results = await seDatabaseReq(dbReq)
    const userOrgId = results[0].id
    return userOrgId
  }
}
