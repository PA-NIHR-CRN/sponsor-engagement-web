import { expect, Locator, Page } from '@playwright/test'

//Declare Page Objects
export default class ReportFirstPage {
  readonly page: Page
  readonly pageTitle: Locator
  readonly studyInput: Locator
  readonly europeanFirstRadio: Locator
  readonly dayInput: Locator
  readonly monthInput: Locator
  readonly yearInput: Locator
  readonly siteNameInput: Locator
  readonly principalInvestigatorTitleInput: Locator
  readonly principalInvestigatorNameInput: Locator
  readonly principalInvestigatorEmailInput: Locator
  readonly submitButton: Locator

  //Initialize Page Objects
  constructor(page: Page) {
    this.page = page

    //Locators
    this.pageTitle = page.locator('h2', { hasText: "Report a 'First'" })
    this.studyInput = page.locator('select#studyId')
    this.europeanFirstRadio = page.locator('#type-1')
    this.dayInput = page.locator('#firstAt-day')
    this.monthInput = page.locator('#firstAt-month')
    this.yearInput = page.locator('#firstAt-year')
    this.siteNameInput = page.locator('#siteName')
    this.principalInvestigatorTitleInput = page.locator('#piTitle')
    this.principalInvestigatorNameInput = page.locator('#piFullName')
    this.principalInvestigatorEmailInput = page.locator('#piEmail')
    this.submitButton = page.locator('button[type="submit"]')
  }

  //Page Methods
  async assertOnReportAFirstPage() {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.pageTitle).toHaveText(`Report a 'First'`)
    await expect(this.page).toHaveURL('report-first')
  }

  async selectStudy(studyTitle: string) {
    await this.studyInput.selectOption({ label: studyTitle })
  }

  async selectEuropeanFirst() {
    await this.europeanFirstRadio.check()
  }

  async enterConsentDate(consentDate: string) {
    const [day, month, year] = consentDate.split('/')

    await this.dayInput.fill(day)
    await this.monthInput.fill(month)
    await this.yearInput.fill(year)
  }

  async enterSiteName(siteName: string) {
    await this.siteNameInput.fill(siteName)
  }

  async enterPrincipalInvestigatorDetails(title: string, name: string, email: string) {
    await expect(this.principalInvestigatorTitleInput).toBeVisible()
    await expect(this.principalInvestigatorNameInput).toBeVisible()
    await expect(this.principalInvestigatorEmailInput).toBeVisible()

    await this.principalInvestigatorTitleInput.fill(title)
    await this.principalInvestigatorNameInput.fill(name)
    await this.principalInvestigatorEmailInput.fill(email)

    await expect(this.principalInvestigatorTitleInput).toHaveValue(title)
    await expect(this.principalInvestigatorNameInput).toHaveValue(name)
    await expect(this.principalInvestigatorEmailInput).toHaveValue(email)
  }

  async submitForm() {
    await this.submitButton.click()
  }

  async completeEuropeanFirstForm(
    studySearchTerm: string,
    consentDate: string,
    siteName: string,
    principalInvestigatorTitle: string,
    principalInvestigatorName: string,
    principalInvestigatorEmail: string
  ) {
    await this.selectStudy(studySearchTerm)
    await this.selectEuropeanFirst()
    await this.enterConsentDate(consentDate)
    await this.enterSiteName(siteName)
    await this.enterPrincipalInvestigatorDetails(
      principalInvestigatorTitle,
      principalInvestigatorName,
      principalInvestigatorEmail
    )
    await this.submitForm()
  }

  async assertSuccessMessageVisible() {
    await expect(this.page.getByText('Submission complete')).toBeVisible()
  }

  async assertValidationMessagesVisible() {
    await expect(this.page.locator('.govuk-error-message', { hasText: 'Select a study' })).toBeVisible()
    await expect(this.page.locator('.govuk-error-message', { hasText: 'Select the type of first' })).toBeVisible()
    await expect(this.page.locator('.govuk-error-message', { hasText: 'Enter a day' })).toBeVisible()
    await expect(this.page.locator('.govuk-error-message', { hasText: 'Enter a month' })).toBeVisible()
    await expect(this.page.locator('.govuk-error-message', { hasText: 'Enter a year' })).toBeVisible()
    await expect(this.page.locator('.govuk-error-message', { hasText: 'Enter the site name' })).toBeVisible()
    await expect(
      this.page.locator('.govuk-error-message', { hasText: 'Enter the principal investigator’s full name' })
    ).toBeVisible()
    await expect(
      this.page.locator('.govuk-error-message', { hasText: 'Enter the principal investigator’s email address' })
    ).toBeVisible()
  }
}
