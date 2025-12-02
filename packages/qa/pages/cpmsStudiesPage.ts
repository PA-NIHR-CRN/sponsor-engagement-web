import { expect, Locator, Page } from '@playwright/test'

//Declare Page Objects
export default class CpmsStudiesPage {
  readonly page: Page
  readonly btnContinue: Locator
  readonly cpmsStudyBreadcrumb: Locator
  readonly editButton: Locator
  readonly statusTab: Locator
  readonly statusTable: Locator
  readonly statusValue: Locator
  readonly designTab: Locator
  readonly ukTargetField: Locator
  readonly actualOpeningField: Locator
  readonly plannedOpeningField: Locator
  readonly plannedClosureField: Locator
  readonly actualClosureField: Locator
  readonly saveButton: Locator

  //Initialize Page Objects
  constructor(page: Page) {
    this.page = page

    //Locators
    this.btnContinue = page.locator('button[data-testid="identifier-auth-continue-button"]')
    this.cpmsStudyBreadcrumb = page.locator('.breadcrumbs')

    //Study
    this.editButton = page.locator('button', { hasText: 'EDIT' })
    this.statusTab = page.locator('li[data-tabid="1"]')
    this.statusTable = page.locator('#statusAuditTable')
    this.statusValue = this.statusTable.locator('tbody > tr > td').first()
    this.designTab = page.locator('li[data-tabid="4"]')
    this.ukTargetField = page.locator('#CurrentStudyRecord_UkRecruitmentSampleSize')
    this.plannedOpeningField = page.locator('#CurrentStudyRecord_ActualOpeningDate')
    this.actualOpeningField = page.locator('#CurrentStudyRecord_PlannedRecruitmentStartDate')
    this.plannedClosureField = page.locator('#CurrentStudyRecord_PlannedRecruitmentEndDate')
    this.actualClosureField = page.locator('#CurrentStudyRecord_ActualRecruitmentEndDate')
    this.saveButton = page.locator('#btnSaveStudy')
  }

  //Page Methods
  async goToCpmsStudies() {
    await this.page.goto('https://test.cpms.crncc.nihr.ac.uk/Base/StudyRecord/Index')
  }

  async goToStudyInCpms(id: string) {
    await this.page.goto(`https://test.cpms.crncc.nihr.ac.uk/Base/StudyRecord/Edit/${id}?selectedTab=1`)
  }

  async assertOnSignInPage() {
    await expect(this.btnContinue).toBeVisible()
  }

  async assertOnCpmsStudiesPage() {
    await expect(this.cpmsStudyBreadcrumb).toContainText('STUDIES', { timeout: 15000 })
  }

  async assertOnCpmsStudyEditPage(id: string) {
    await expect(this.cpmsStudyBreadcrumb).toBeVisible()
    await expect(this.cpmsStudyBreadcrumb).toContainText('STUDIES')
    await expect(this.page).toHaveURL(`https://test.cpms.crncc.nihr.ac.uk/Base/StudyRecord/Edit/${id}?selectedTab=1`)
  }

  async assertExpectedStatus(status: string) {
    await this.statusTab.click()
    await expect(this.statusValue).toBeVisible()
    await expect(this.statusValue).toContainText(status)
  }

  async assertExpectedDate(dateType: string, dateValue: string) {
    await this.designTab.click()
    await expect(this.plannedOpeningField).toBeVisible()

    // format date if need be

    switch (dateType) {
      case 'plannedOpening':
        await expect(this.plannedOpeningField).toBeVisible()
        await expect(this.plannedOpeningField).toHaveValue(dateValue)
        break
      case 'actualOpening':
        await expect(this.actualOpeningField).toBeVisible()
        await expect(this.actualOpeningField).toHaveValue(dateValue)
        break
      case 'plannedClosure':
        await expect(this.plannedClosureField).toBeVisible()
        await expect(this.plannedClosureField).toHaveValue(dateValue)
        break
      case 'actualClosure':
        await expect(this.actualClosureField).toBeVisible()
        await expect(this.actualClosureField).toHaveValue(dateValue)
        break
      default:
        throw new Error(`${dateType} is not a valid date option`)
    }
  }

  async assertExpectedTarget(target: string) {
    await expect(this.ukTargetField).toBeVisible()
    await expect(this.ukTargetField).toContainText(target)
  }

  async editStatusInCpms(status: string) {}

  async editDatesInCpms(dateType: string, dateValue: string) {}

  async editTargetInCpms(target: string) {}
}
