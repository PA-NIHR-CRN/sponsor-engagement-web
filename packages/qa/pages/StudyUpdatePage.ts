import { expect, Locator, Page } from '@playwright/test'

//Declare Page Objects
export default class StudyUpdatePage {
  readonly page: Page
  readonly pageTitle: Locator

  //Initialize Page Objects
  constructor(page: Page) {
    this.page = page

    //Locators
    this.pageTitle = page.locator('h2[class="govuk-heading-l govuk-!-margin-bottom-4"]')
  }

  //Page Methods
  async goto(studyId: string) {
    await this.page.goto(`studies/${studyId}/edit`)
  }

  async assertOnUpdateStudyPage() {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.pageTitle).toContainText('Update study data')
    await expect(this.page).toHaveURL(/\/studies\/\d+\/edit/)
  }
}
