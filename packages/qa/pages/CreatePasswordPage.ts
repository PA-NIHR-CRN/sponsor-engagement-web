import { expect, Locator, Page } from '@playwright/test'

//Declare Page Objects
export default class CreatePasswordPage {
  readonly page: Page
  readonly pageTitle: Locator
  readonly setPasswordHeader: Locator
  readonly saveButton: Locator
  // Validation Errors
  readonly errorSummaryAlertBox: Locator
  readonly errorSummaryAlertBoxTitle: Locator
  readonly errorSummaryAlertBoxPasswordLink: Locator
  readonly errorSummaryAlertBoxConfirmLink: Locator
  readonly errorFormGroup: Locator
  readonly errorFromGroupPasswordMessage: Locator
  readonly errorFromGroupConfirmMessage: Locator

  //Initialize Page Objects
  constructor(page: Page) {
    this.page = page

    //Locators
    this.pageTitle = page.locator('h2.govuk-heading-l')
    this.setPasswordHeader = page.locator('legend[class="govuk-fieldset__legend govuk-fieldset__legend--m"]')
    this.saveButton = page.locator('button[type="submit"]')
    this.errorSummaryAlertBox = page.locator('div[class="govuk-error-summary"]')
    this.errorSummaryAlertBoxTitle = page.locator('h2[id="form-summary-errors"]')
    this.errorSummaryAlertBoxPasswordLink = page.locator('a[href="#password"]')
    this.errorSummaryAlertBoxConfirmLink = page.locator('a[href="#confirmPassword"]')
    this.errorFormGroup = page.locator(
      'div[class="govuk-form-group govuk-form-group--error govuk-input--width-20 flex-grow"]'
    )
    this.errorFromGroupPasswordMessage = page.locator('p[id="password-error"]')
    this.errorFromGroupConfirmMessage = page.locator('p[id="confirmPassword-error"]')
  }

  //Page Methods
  async goto(registrationToken: string) {
    await this.page.goto(`register?registrationToken=${registrationToken}`)
  }

  async assertOnCreatePasswordPage(registrationToken: string) {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.setPasswordHeader).toBeVisible()
    await expect(this.pageTitle).toHaveText('Review progress of research studies - complete registration')
    await expect(this.setPasswordHeader).toHaveText('Set a password for your NIHR Identity Gateway account')
    await expect(this.page).toHaveURL(`register?registrationToken=${registrationToken}`)
  }

  async assertValidationErrorsPresent() {
    await expect(this.errorSummaryAlertBox).toBeVisible()
    await expect(this.errorFormGroup.nth(0)).toBeVisible()
    await expect(this.errorFormGroup.nth(1)).toBeVisible()
    await expect(this.errorSummaryAlertBoxTitle).toHaveText('There is a problem')
    await expect(this.errorSummaryAlertBoxPasswordLink).toHaveText('Enter a minimum of 12 characters')
    await expect(this.errorSummaryAlertBoxConfirmLink).toHaveText('Enter a minimum of 12 characters')
    await expect(this.errorFromGroupPasswordMessage).toContainText('Enter a minimum of 12 characters')
    await expect(this.errorFromGroupPasswordMessage).toContainText('Enter a minimum of 12 characters')
  }
}
