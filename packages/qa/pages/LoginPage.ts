import { expect, Locator, Page } from '@playwright/test'

//Declare Page Objects
export default class LoginPage {
  readonly page: Page
  readonly idgBanner: Locator
  readonly usernameInput: Locator
  readonly passwordInput: Locator
  readonly btnNext: Locator
  readonly btnContinue: Locator

  //Initialize Page Objects
  constructor(page: Page) {
    this.page = page

    //Locators
    this.idgBanner = page.locator('div[class="container-fluid"] h1')
    this.usernameInput = page.locator('input[id="usernameUserInput"]')
    this.passwordInput = page.locator('input[id="password"]')
    this.btnNext = page.locator('input[id="NEXT"]')
    this.btnContinue = page.locator('button[type="submit"]')
  }

  //Page Methods
  async assertOnLoginPage() {
    await expect(this.idgBanner).toBeVisible()
    await expect(this.idgBanner).toHaveText('This is the TEST Identity Gateway')
    expect(this.page.url()).toContain('test.id.nihr.ac.uk/authenticationendpoint/login')
  }

  //passwords set in .github/workflows/playwright.yml using GitHub secrets, hardcode when running locally
  async loginWithUserCreds(user: string) {
    let username = ''
    let password = ''
    switch (user.toLowerCase()) {
      case 'sponsor contact':
        username = 'sesponsorcontact@test.id.nihr.ac.uk'
        password = `${process.env.SPONSOR_CONTACT_PASS}`
        break
      case 'sponsor contact manager':
        username = 'sesponsorcontactmanager@test.id.nihr.ac.uk'
        password = `${process.env.SPONSOR_CONTACT_MANAGER_PASS}`
        break
      case 'contact manager':
        username = 'secontactmanager@test.id.nihr.ac.uk'
        password = `${process.env.CONTACT_MANAGER_PASS}`
        break
      case 'no local account':
        username = 'senolocalaccount@test.id.nihr.ac.uk'
        password = `${process.env.SE_NO_LOCAL_ACCOUNT_PASS}`
        break
      default:
        throw new Error(`${user} is not a valid option`)
    }
    await this.usernameInput.fill(username)
    await this.btnNext.click()
    await this.passwordInput.fill(password)
    await this.btnContinue.click()
  }
}
