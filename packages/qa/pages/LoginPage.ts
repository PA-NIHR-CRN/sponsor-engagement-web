import { expect, Locator, Page } from '@playwright/test'
import { convertIsoDateToDisplayDate, convertIsoDateToDisplayTime } from '../utils/UtilFunctions'
import { RowDataPacket } from 'mysql2'

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
        username = `${process.env.SPONSOR_CONTACT_USER}`
        password = `${process.env.SPONSOR_CONTACT_PASS}`
        break
      case 'sponsor contact 2':
        username = `${process.env.SPONSOR_CONTACT_2_USER}`
        password = `${process.env.SPONSOR_CONTACT_2_PASS}`
        break
      case 'sponsor contact manager':
        username = `${process.env.SPONSOR_CONTACT_MANAGER_USER}`
        password = `${process.env.SPONSOR_CONTACT_MANAGER_PASS}`
        break
      case 'contact manager':
        username = `${process.env.CONTACT_MANAGER_USER}`
        password = `${process.env.CONTACT_MANAGER_PASS}`
        break
      case 'no local account':
        username = `${process.env.SE_NO_LOCAL_ACCOUNT_USER}`
        password = `${process.env.SE_NO_LOCAL_ACCOUNT_PASS}`
        break
      case 'national portfolio manager':
        username = `${process.env.CPMS_NPM_USER}`
        password = `${process.env.CPMS_NPM_PASS}`
        break
      default:
        throw new Error(`${user} is not a valid option`)
    }
    await this.usernameInput.fill(username)
    await this.btnNext.click()
    await this.passwordInput.fill(password)
    await this.btnContinue.click()
  }

  async getLastLoginFormattedDate(dateValueRecord: RowDataPacket[]): Promise<string> {
    const formattedLastLogin =
      convertIsoDateToDisplayDate(new Date(dateValueRecord[0].lastLogin)) +
      ' ' +
      convertIsoDateToDisplayTime(new Date(dateValueRecord[0].lastLogin))
    return formattedLastLogin
  }

  async assertLastLoginUpdated(previousValue: RowDataPacket[], updatedValue: RowDataPacket[]) {
    expect(new Date(updatedValue[0].lastLogin).getTime()).toBeGreaterThan(
      new Date(previousValue[0].lastLogin).getTime()
    )
  }
}
