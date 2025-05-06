import { expect, Locator, Page } from '@playwright/test'
import { confirmStringNotNull, convertIsoDateToDisplayDate } from '../utils/UtilFunctions'
import { RowDataPacket } from 'mysql2'
import { seDatabaseReq } from '../utils/DbRequests'

//Declare Page Objects
export default class OrganisationDetailsPage {
  readonly page: Page
  readonly pageTitle: Locator
  readonly addRemoveHeader: Locator
  readonly inviteSection: Locator
  readonly submitButton: Locator
  readonly pageSubHeading: Locator
  readonly detailsTable: Locator
  readonly detailsTableRtsRow: Locator
  readonly detailsTableRtsHeader: Locator
  readonly detailsTableRtsValue: Locator
  readonly detailsTableRoleRow: Locator
  readonly detailsTableRoleHeader: Locator
  readonly detailsTableRoleValue: Locator
  readonly addRemoveGuidanceTxt: Locator
  readonly contactsList: Locator
  readonly contactsListHeaders: Locator
  readonly contactsListEmailHeader: Locator
  readonly contactsListDateHeader: Locator
  readonly contactsListLastLoginHeader: Locator
  readonly contactsListActionsHeader: Locator
  readonly contactListRow: Locator
  readonly noContactsMsg: Locator
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
    this.pageTitle = page.locator('h2[class="govuk-heading-l govuk-!-margin-bottom-1"]')
    this.addRemoveHeader = page.locator('h3[class="govuk-heading-m p-0 govuk-!-margin-bottom-4"]')
    this.inviteSection = page.locator('form[action="/api/forms/organisation"]')
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
    this.pageSubHeading = page.locator('span[class="govuk-body-m mb-0 text-darkGrey"]')
    this.detailsTable = page.locator('table[class="govuk-table govuk-!-margin-top-3"] tbody')
    this.detailsTableRtsRow = this.detailsTable.locator('tr').nth(0)
    this.detailsTableRtsHeader = this.detailsTableRtsRow.locator('th')
    this.detailsTableRtsValue = this.detailsTableRtsRow.locator('td')
    this.detailsTableRoleRow = this.detailsTable.locator('tr').nth(1)
    this.detailsTableRoleHeader = this.detailsTableRoleRow.locator('th')
    this.detailsTableRoleValue = this.detailsTableRoleRow.locator('td')
    this.addRemoveHeader = page.locator('h3[class="govuk-heading-m p-0 govuk-!-margin-bottom-4"]')
    this.addRemoveGuidanceTxt = this.addRemoveHeader.locator('..').locator('p')
    this.contactsList = page.locator('table[class="govuk-table"]')
    this.contactsListHeaders = this.contactsList.locator('thead tr')
    this.contactsListEmailHeader = this.contactsListHeaders.locator('th').nth(0)
    this.contactsListDateHeader = this.contactsListHeaders.locator('th').nth(1)
    this.contactsListLastLoginHeader = this.contactsListHeaders.locator('th').nth(2)
    this.contactsListActionsHeader = this.contactsListHeaders.locator('th').nth(3)
    this.contactListRow = this.contactsList.locator('tbody tr')
    this.noContactsMsg = page.locator('div[class="w-full"] p').last()
    this.searchInput = page.locator('input[id="emailAddress"]')
    this.searchInputLabel = page.locator('label[id="emailAddress-label"]')
    this.searchButton = page.locator('button[type="submit"]')
  }

  //Page Methods
  async goto(orgId: string) {
    await this.page.goto(`organisations/${orgId}`)
  }

  async assertOnOrganisationDetailsPage(orgId: string) {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.addRemoveHeader).toBeVisible()
    await expect(this.inviteSection).toBeVisible()
    await expect(this.addRemoveHeader).toHaveText('Add or remove sponsor contacts')
    await expect(this.page).toHaveURL(`organisations/${orgId}`)
  }

  async gotoSuccess(orgId: string) {
    await this.page.goto(`organisations/${orgId}?success=1`)
  }

  async assertOnOrganisationDetailsPageWithSuccess(orgId: string) {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.addRemoveHeader).toBeVisible()
    await expect(this.inviteSection).toBeVisible()
    await expect(this.addContactSuccessAlertBox).toBeVisible()
    await expect(this.addRemoveHeader).toHaveText('Add or remove sponsor contacts')
    await expect(this.addContactSuccessAlertBoxTitle).toHaveText('Success')
    await expect(this.page).toHaveURL(`organisations/${orgId}?success=1`)
  }

  async assertOnOrganisationDetailsPageWithRemove(orgId: string) {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.addRemoveHeader).toBeVisible()
    await expect(this.inviteSection).toBeVisible()
    await expect(this.addContactSuccessAlertBox).toBeVisible()
    await expect(this.addRemoveHeader).toHaveText('Add or remove sponsor contacts')
    await expect(this.addContactSuccessAlertBoxTitle).toHaveText('Success')
    await expect(this.page).toHaveURL(`organisations/${orgId}?success=2`)
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

  async assertOrgDetailsPageTitle(expectedPageTitle: string) {
    await expect(this.pageTitle).toBeVisible()
    const actualText = confirmStringNotNull(await this.pageTitle.textContent())
    expect(actualText.substring(19)).toEqual(expectedPageTitle)
  }

  async assertOrgDetailsSubHeading(expectedValues: RowDataPacket[]) {
    await expect(this.pageSubHeading).toBeVisible()
    const fullSubHeadingTxt = await this.getActualRoleName(
      confirmStringNotNull(await this.pageSubHeading.textContent())
    )
    for (let index = 0; index < expectedValues.length; index++) {
      const dbRoleName = expectedValues[index].roleName
      const expectedRoleName = await this.getExpectedRoleName(dbRoleName)
      const actualRoleName = await this.getMultiRoleName(fullSubHeadingTxt, index)
      expect(actualRoleName).toEqual(expectedRoleName)
    }
  }

  async assertOrgDetailsRtsIdRole(expectedValues: RowDataPacket[]) {
    const expectedRts = expectedValues[0].rtsIdentifier
    await expect(this.detailsTable).toBeVisible()
    await expect(this.detailsTableRtsRow).toBeVisible()
    await expect(this.detailsTableRoleRow).toBeVisible()
    await expect(this.detailsTableRtsHeader).toHaveText('Organisation ID')
    await expect(this.detailsTableRtsValue).toHaveText(expectedRts)
    await expect(this.detailsTableRoleHeader).toHaveText('Role')
    const fullRoleValueTxt = confirmStringNotNull(await this.detailsTableRoleValue.textContent())
    for (let index = 0; index < expectedValues.length; index++) {
      const dbRoleName = expectedValues[index].roleName
      const expectedRoleName = await this.getExpectedRoleName(dbRoleName)
      const actualRoleName = await this.getMultiRoleName(fullRoleValueTxt, index)
      expect(actualRoleName).toEqual(expectedRoleName)
    }
  }

  async getMultiRoleName(allRolesTxt: string, index: number) {
    const firstRoleEndIndex = allRolesTxt.indexOf(',')
    let actualRoleName: string = ''
    switch (index) {
      case 0:
        if (firstRoleEndIndex < 0) {
          actualRoleName = allRolesTxt.substring(0)
        } else {
          actualRoleName = allRolesTxt.substring(0, firstRoleEndIndex)
        }
        break
      case 1:
        actualRoleName = allRolesTxt.substring(firstRoleEndIndex + 1).trim()
        break
      default:
        throw new Error(`${index} is not a valid index`)
    }
    return actualRoleName
  }

  async getActualRoleName(roleName: string): Promise<string> {
    return roleName.substring(20)
  }

  async getExpectedRoleName(roleName: string): Promise<string> {
    let actualRoleName: string = ''
    switch (roleName) {
      case 'Clinical Research Sponsor':
        actualRoleName = 'Sponsor'
        break
      case 'Contract Research Organisation':
        actualRoleName = 'CRO'
        break
      case 'Managing Clinical Trials Unit':
        actualRoleName = 'CTU'
        break
      default:
        throw new Error(`${roleName} is not a valid role input`)
    }
    return actualRoleName
  }

  async assertAddRemoveSectionPresent() {
    await expect(this.addRemoveHeader).toBeVisible()
    await expect(this.addRemoveHeader).toHaveText('Add or remove sponsor contacts')
  }

  async assertAddRemoveGuidanceTxt() {
    await expect(this.addRemoveGuidanceTxt).toBeVisible()
    await expect(this.addRemoveGuidanceTxt).toContainText('Invite new sponsor contacts to this organisation')
  }

  async assertContactListDisplayed(displayed: boolean) {
    if (displayed) {
      await expect(this.contactsListHeaders).toBeVisible()
      await expect(this.contactsListEmailHeader).toHaveText('Contact email')
      await expect(this.contactsListDateHeader).toHaveText('Date added')
      await expect(this.contactsListLastLoginHeader).toHaveText('Date of last login')
      await expect(this.contactsListActionsHeader).toHaveText('Actions')
    } else {
      await expect(this.contactsListHeaders).toBeHidden()
      await expect(this.noContactsMsg).toBeVisible()
      await expect(this.noContactsMsg).toHaveText('No contacts associated with this organisation')
    }
  }

  async assertTotalNumberOfContacts(dbReq: string) {
    const expectedNumberOfContacts = await seDatabaseReq(dbReq)
    await expect(this.contactsList).toBeVisible()
    expect(await this.contactListRow.count()).toEqual(expectedNumberOfContacts[0].count)
  }

  async assertOrgHasNoContactsInDB(dbReq: string) {
    const actualNumberOfContacts = await seDatabaseReq(dbReq)
    expect(actualNumberOfContacts[0].count).toEqual(0)
  }

  async assertContactEmail(expectedDetails: RowDataPacket[]) {
    await expect(this.contactListRow.first()).toBeVisible()
    const numberOfContactRows = await this.contactListRow.count()
    for (let index = 0; index < numberOfContactRows; index++) {
      const row = this.contactListRow.nth(index)
      await expect(row.locator('td').nth(0)).toHaveText(expectedDetails[index].email)
    }
  }

  async assertContactDateAdded(expectedDetails: RowDataPacket[]) {
    await expect(this.contactListRow.first()).toBeVisible()
    const numberOfContactRows = await this.contactListRow.count()
    for (let index = 0; index < numberOfContactRows; index++) {
      const row = this.contactListRow.nth(index)
      const expectedDate = convertIsoDateToDisplayDate(expectedDetails[index].updatedAt)
      await expect(row.locator('td').nth(1)).toHaveText(expectedDate)
    }
  }

  async assertContactDateOfLastLogin(expectedDetails: RowDataPacket[]) {
    await expect(this.contactListRow.first()).toBeVisible()
    const numberOfContactRows = await this.contactListRow.count()
    for (let index = 0; index < numberOfContactRows; index++) {
      const row = this.contactListRow.nth(index)
      const expectedDate = expectedDetails[index].lastLogin
        ? convertIsoDateToDisplayDate(expectedDetails[index].lastLogin)
        : '-'
      await expect(row.locator('td').nth(2)).toHaveText(expectedDate)
    }
  }

  async assertContactFailedToDeliverTag(expectedEmail: string, statusId: number) {
    const row = this.page.locator(`tr:has(td >> text="${expectedEmail}")`)
    if (statusId === 3) {
      await expect(row.locator('.govuk-tag')).toHaveText('Failed to deliver email')
    } else {
      await expect(row.locator('.govuk-tag')).not.toContainText('Failed to deliver email')
    }
  }

  async assertContactActions() {
    await expect(this.contactListRow.first()).toBeVisible()
    const numberOfContactRows = await this.contactListRow.count()
    for (let index = 0; index < numberOfContactRows; index++) {
      const row = this.contactListRow.nth(index)
      await expect(row.locator('td').nth(3).locator('a')).toBeVisible()
      await expect(row.locator('td').nth(3).locator('a')).toHaveText('Remove')
      await expect(row.locator('td').nth(3).locator('a')).toHaveAttribute('href')
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
    await expect(this.contactListRow.first()).toBeVisible()
    if (isPresent) {
      await expect(this.contactListRow.first().locator('td').nth(0)).toHaveText(expectedEmail)
    } else {
      await expect(this.contactListRow.first().locator('td').nth(0)).not.toHaveText(expectedEmail)
    }
  }

  async assertTodaysDateAdded() {
    await expect(this.contactListRow.first()).toBeVisible()
    const todaysDate = convertIsoDateToDisplayDate(new Date())
    await expect(this.contactListRow.first().locator('td').nth(1)).toHaveText(todaysDate)
  }
}
