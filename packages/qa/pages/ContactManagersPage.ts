import { expect, Locator, Page } from '@playwright/test'
import { convertIsoDateToDisplayDate } from '../utils/UtilFunctions'
import { RowDataPacket } from 'mysql2'
import { seDatabaseReq } from '../utils/DbRequests'

//Declare Page Objects
export default class ContactManagersPage {
  readonly page: Page
  readonly pageTitle: Locator
  readonly addRemoveHeader: Locator
  readonly inviteSection: Locator
  readonly submitButton: Locator
  readonly contactManagersList: Locator
  readonly contactManagersListHeaders: Locator
  readonly contactManagersListEmailHeader: Locator
  readonly contactManagersListDateHeader: Locator
  readonly contactManagersListActionsHeader: Locator
  readonly contactManagersListRow: Locator
  readonly addRemoveGuidanceTxt: Locator
  readonly searchInput: Locator
  readonly searchInputLabel: Locator
  readonly searchButton: Locator
  //Success and Error Alerts
  readonly addContactSuccessAlertBox: Locator
  readonly addContactSuccessAlertBoxTitle: Locator
  readonly errorSummaryAlertBox: Locator
  readonly errorSummaryAlertBoxTitle: Locator
  readonly errorSummaryAlertBoxLink: Locator
  readonly errorFormGroup: Locator
  readonly errorFromGroupMessage: Locator

  //Initialize Page Objects
  constructor(page: Page) {
    this.page = page

    //Locators
    this.pageTitle = page.locator('h2[class="govuk-heading-l govuk-!-margin-bottom-2"]')
    this.addRemoveHeader = page.locator('h3[class="govuk-heading-m p-0 govuk-!-margin-bottom-4"]')
    this.addRemoveGuidanceTxt = this.addRemoveHeader.locator('..').locator('p').nth(1)
    this.inviteSection = page.locator('form[action="/api/forms/contactManager"]')
    this.addContactSuccessAlertBox = page.locator(
      'div[class="govuk-notification-banner govuk-notification-banner--success"]'
    )
    this.addContactSuccessAlertBoxTitle = page.locator('h2[id="govuk-notification-banner-title"]')
    this.errorSummaryAlertBox = page.locator('div[class="govuk-error-summary"]')
    this.errorSummaryAlertBoxTitle = page.locator('h2[id="form-summary-errors"]')
    this.errorSummaryAlertBoxLink = page.locator('a[href="#emailAddress"]')
    this.errorFormGroup = page.locator(
      'div[class="govuk-form-group govuk-form-group--error govuk-input--width-20 flex-grow"]'
    )
    this.errorFromGroupMessage = page.locator('p[id="emailAddress-error"]')
    this.submitButton = page.locator('button[type="submit"]')

    this.contactManagersList = page.locator('table[class="govuk-table"]')
    this.contactManagersListHeaders = this.contactManagersList.locator('thead tr')
    this.contactManagersListEmailHeader = this.contactManagersListHeaders.locator('th').nth(0)
    this.contactManagersListDateHeader = this.contactManagersListHeaders.locator('th').nth(1)
    this.contactManagersListActionsHeader = this.contactManagersListHeaders.locator('th').nth(2)
    this.contactManagersListRow = this.contactManagersList.locator('tbody tr')

    this.searchInput = page.locator('input[id="emailAddress"]')
    this.searchInputLabel = page.locator('label[id="emailAddress-label"]')
    this.searchButton = page.locator('button[type="submit"]')
  }

  //Page Methods
  async goto() {
    await this.page.goto(`contact-managers`)
  }

  async assertOnManageContactManagersPage() {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.addRemoveHeader).toBeVisible()
    await expect(this.inviteSection).toBeVisible()
    await expect(this.pageTitle).toHaveText('RDN and Devolved Administration Contact Managers')
    await expect(this.addRemoveHeader).toHaveText('Add or remove Contact Managers')
    await expect(this.page).toHaveURL(`contact-managers`)
  }

  async gotoSuccess() {
    await this.page.goto(`contact-managers?success=1`)
  }

  async assertOnManageContactManagersWithSuccess() {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.addRemoveHeader).toBeVisible()
    await expect(this.inviteSection).toBeVisible()
    await expect(this.addContactSuccessAlertBox).toBeVisible()
    await expect(this.pageTitle).toHaveText('RDN and Devolved Administration Contact Managers')
    await expect(this.addRemoveHeader).toHaveText('Add or remove Contact Managers')
    await expect(this.addContactSuccessAlertBoxTitle).toHaveText('Success')
    await expect(this.page).toHaveURL(`contact-managers?success=1`)
  }

  async assertOnManageContactManagersWithRemove() {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.addRemoveHeader).toBeVisible()
    await expect(this.inviteSection).toBeVisible()
    await expect(this.addContactSuccessAlertBox).toBeVisible()
    await expect(this.pageTitle).toHaveText('RDN and Devolved Administration Contact Managers')
    await expect(this.addRemoveHeader).toHaveText('Add or remove Contact Managers')
    await expect(this.addContactSuccessAlertBoxTitle).toHaveText('Success')
    await expect(this.page).toHaveURL(`contact-managers?success=2`)
  }

  async assertValidationErrorsPresent() {
    await expect(this.errorSummaryAlertBox).toBeVisible()
    await expect(this.errorFormGroup).toBeVisible()
    await expect(this.errorSummaryAlertBoxTitle).toHaveText('There is a problem')
    await expect(this.errorSummaryAlertBoxLink).toHaveText('Enter a valid email address')
    await expect(this.errorFromGroupMessage).toContainText('Enter a valid email address')
  }

  async assertEmailInputFocused() {
    await expect(this.searchInput).toBeFocused()
  }

  async assertContactManagersPageTitle() {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.pageTitle).toHaveText('RDN and Devolved Administration Contact Managers')
  }

  async assertAddRemoveSectionPresent() {
    await expect(this.addRemoveHeader).toBeVisible()
    await expect(this.addRemoveHeader).toHaveText('Add or remove Contact Managers')
  }

  async assertAddRemoveGuidanceTxt() {
    await expect(this.addRemoveGuidanceTxt).toBeVisible()
    await expect(this.addRemoveGuidanceTxt).toContainText(
      'Invite or remove new contact managers using the options below'
    )
  }

  async assertContactListHeadersDisplayed() {
    await expect(this.contactManagersListHeaders).toBeVisible()
    await expect(this.contactManagersListEmailHeader).toHaveText('Contact email')
    await expect(this.contactManagersListDateHeader).toHaveText('Date added')
    await expect(this.contactManagersListActionsHeader).toHaveText('Actions')
  }

  async assertTotalNumberOfContacts(dbReq: string) {
    const expectedNumberOfContacts = await seDatabaseReq(dbReq)
    await expect(this.contactManagersList).toBeVisible()
    expect(await this.contactManagersListRow.count()).toEqual(expectedNumberOfContacts[0].count)
  }

  async assertContactEmail(expectedDetails: RowDataPacket[]) {
    await expect(this.contactManagersListRow.first()).toBeVisible()
    const numberOfContactRows = await this.contactManagersListRow.count()
    for (let index = 0; index < numberOfContactRows; index++) {
      const row = this.contactManagersListRow.nth(index)
      await expect(row.locator('td').nth(0)).toHaveText(expectedDetails[index].email)
    }
  }

  async assertContactDateAdded(expectedDetails: RowDataPacket[]) {
    await expect(this.contactManagersListRow.first()).toBeVisible()
    const numberOfContactRows = await this.contactManagersListRow.count()
    for (let index = 0; index < numberOfContactRows; index++) {
      const row = this.contactManagersListRow.nth(index)
      const expectedDate = convertIsoDateToDisplayDate(expectedDetails[index].createdAt)
      await expect(row.locator('td').nth(1)).toHaveText(expectedDate)
    }
  }

  async assertContactActions() {
    await expect(this.contactManagersListRow.first()).toBeVisible()
    const numberOfContactRows = await this.contactManagersListRow.count()
    for (let index = 0; index < numberOfContactRows; index++) {
      const row = this.contactManagersListRow.nth(index)
      await expect(row.locator('td').nth(2).locator('a')).toBeVisible()
      await expect(row.locator('td').nth(2).locator('a')).toHaveText('Remove')
      await expect(row.locator('td').nth(2).locator('a')).toHaveAttribute('href')
    }
  }

  async assertSearchFieldPresent() {
    await expect(this.searchInput).toBeVisible()
  }

  async assertSearchLabelPresent() {
    await expect(this.searchInputLabel).toBeVisible()
    await expect(this.searchInputLabel).toHaveText('Email address')
  }

  async assertSearchButtonPresent() {
    await expect(this.searchButton).toBeVisible()
    await expect(this.searchButton).toHaveText('Send invite')
  }

  async assertNewEmailAdded(expectedEmail: string, isPresent: boolean) {
    await expect(this.contactManagersListRow.last()).toBeVisible()
    if (isPresent) {
      await expect(this.contactManagersListRow.last().locator('td').nth(0)).toHaveText(expectedEmail)
    } else {
      await expect(this.contactManagersListRow.last().locator('td').nth(0)).not.toHaveText(expectedEmail)
    }
  }

  async assertTodaysDateAdded() {
    await expect(this.contactManagersListRow.last()).toBeVisible()
    const todaysDate = convertIsoDateToDisplayDate(new Date())
    await expect(this.contactManagersListRow.last().locator('td').nth(1)).toHaveText(todaysDate)
  }
}
