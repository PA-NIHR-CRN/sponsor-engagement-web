import { expect, Locator, Page } from '@playwright/test'

//Declare Page Objects
export default class LoginPage {
  readonly page: Page
  readonly idgBanner: Locator

  //Initialize Page Objects
  constructor(page: Page) {
    this.page = page

    //Locators
    this.idgBanner = page.locator('div[class="container-fluid"] h1')
  }

  //Page Methods
  async assertOnLoginPage() {
    await expect(this.idgBanner).toBeVisible()
    await expect(this.idgBanner).toHaveText('This is the TEST Identity Gateway')
    expect(this.page.url()).toContain('test.id.nihr.ac.uk/authenticationendpoint/login')
  }
}
