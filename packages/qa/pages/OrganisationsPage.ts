import { expect, Locator, Page } from '@playwright/test'
import { seDatabaseReq } from '../utils/DbRequests'
import { confirmStringNotNull } from '../utils/UtilFunctions'

//Declare Page Objects
export default class OrganisationsPage {
  readonly page: Page
  readonly pageTitle: Locator
  readonly txtPageInfo: Locator
  readonly totalOrgsFoundLabel: Locator
  readonly orgListHeaderTxt: Locator
  readonly orgListTbl: Locator
  readonly orgListItem: Locator
  readonly orgListItemNameLink: Locator
  readonly orgListItemNameText: Locator
  readonly orgListItemRoleName: Locator
  readonly orgListItemManageButton: Locator
  readonly paginationOptions: Locator
  readonly paginatePrev: Locator
  readonly paginateNext: Locator
  readonly paginateCurrentPage: Locator
  readonly paginationPageList: Locator
  readonly searchInput: Locator
  readonly searchButton: Locator
  readonly searchLabel: Locator
  readonly searchFilterPanel: Locator

  //Initialize Page Objects
  constructor(page: Page) {
    this.page = page

    //Locators
    this.pageTitle = page.locator('h2.govuk-heading-l')
    this.txtPageInfo = this.page.getByText('Add and remove contacts for sponsor organisations.')
    this.totalOrgsFoundLabel = page.locator('p[class="govuk-heading-s mb-0 whitespace-nowrap"]')
    this.orgListHeaderTxt = page.locator('th[class="govuk-table__header w-5/6"]')
    this.orgListTbl = page.locator('table[class="govuk-table govuk-!-margin-bottom-3"]')
    this.orgListItem = this.orgListTbl.locator('tbody tr')
    this.orgListItemNameLink = this.orgListItem.locator('td[class="govuk-table__cell"] a')
    this.orgListItemNameText = this.orgListItem.locator('td[class="govuk-table__cell"] strong')
    this.orgListItemRoleName = this.orgListItem.locator('td[class="govuk-table__cell"] div')
    this.orgListItemManageButton = this.orgListItem.locator('td[class="govuk-table__cell align-middle text-right"] a')
    this.paginationOptions = page.locator('nav[aria-label="results"]')
    this.paginateNext = page.locator('a[rel="next"]')
    this.paginatePrev = page.locator('a[rel="prev"]')
    this.paginateCurrentPage = page.locator('a[aria-current="page"]')
    this.paginationPageList = page.locator('ul[class="govuk-pagination__list"]')
    this.searchInput = page.locator('input[id="keyword"]')
    this.searchButton = page.locator('div[class="table-cell w-[1%] align-top"] button')
    this.searchLabel = page.locator('label[for="keyword"]')
    this.searchFilterPanel = page.locator('ul[aria-labelledby="selected-filters"]')
  }

  //Page Methods
  async goto() {
    await this.page.goto('')
  }

  async assertOnOrganisationsPage() {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.txtPageInfo).toBeVisible()
    await expect(this.pageTitle).toHaveText('Manage sponsor contacts')
    await expect(this.page).toHaveURL('organisations')
  }

  async assertOrganisationsPageTitle() {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.pageTitle).toHaveText('Manage sponsor contacts')
  }

  async assertOrganisationsGuidanceTxt() {
    await expect(this.txtPageInfo).toBeVisible()
  }

  async assertOrgsFoundDisplayed() {
    await expect(this.totalOrgsFoundLabel).toBeVisible()
    await expect(this.totalOrgsFoundLabel).toContainText('organisations found')
  }

  async assertOrgsListDisplayed() {
    await expect(this.orgListHeaderTxt).toBeVisible()
    await expect(this.orgListTbl).toBeVisible()
    await expect(this.orgListHeaderTxt).toHaveText('Organisation')
  }

  async assertTotalNumberOrgs(dbReq: string) {
    const uiTotalOrgs = await this.totalOrgsFoundLabel.textContent()
    const dbTotalOrgs = await seDatabaseReq(`${dbReq}`)
    expect(uiTotalOrgs?.startsWith(dbTotalOrgs[0].count.toString())).toBeTruthy()
  }

  async enterSearchPhrase(searchTerm: string) {
    await this.searchInput.fill(searchTerm)
    await this.searchButton.click()
    await this.searchFilterPanel.waitFor()
  }

  async assertSpecificNumberStudies(expectedTotal: number) {
    const uiTotalOrgs = await this.totalOrgsFoundLabel.textContent()
    expect(uiTotalOrgs?.startsWith(expectedTotal.toString())).toBeTruthy()
  }

  async assertNameAndSingleRole(dbReq: string, index: number) {
    const expectedValues = await seDatabaseReq(`${dbReq}`)
    const expectedOrgName = expectedValues[0].orgName //see why flaky - Org Id 2650 - Abliva AB, failed on it, empty array returned
    const dbRoleName = expectedValues[0].roleName
    const actualOrgName = confirmStringNotNull(await this.orgListItemNameText.nth(index).textContent())
    const roleNameTxt = confirmStringNotNull(await this.orgListItemRoleName.nth(index).textContent())
    const expectedRoleName = await this.getExpectedRoleName(dbRoleName)
    const actualRoleName = await this.getActualRoleName(roleNameTxt)
    expect(actualOrgName).toEqual(expectedOrgName)
    expect(actualRoleName).toEqual(expectedRoleName)
  }

  async assertNameAndMultiRole(dbReq: string, index: number) {
    const expectedValues = await seDatabaseReq(`${dbReq}`)
    const expectedOrgName = expectedValues[0].orgName
    const actualOrgName = confirmStringNotNull(await this.orgListItemNameText.nth(index).textContent())
    const fullRoleNameTxt = confirmStringNotNull(await this.orgListItemRoleName.nth(index).textContent())
    const roleNameTxt = await this.getActualRoleName(fullRoleNameTxt)
    expect(actualOrgName).toEqual(expectedOrgName)
    for (let index = 0; index < expectedValues.length; index++) {
      const dbRoleName = expectedValues[index].roleName
      const expectedRoleName = await this.getExpectedRoleName(dbRoleName)
      const actualRoleName = await this.getMultiRoleName(roleNameTxt, index)
      expect(actualRoleName).toEqual(expectedRoleName)
    }
  }

  async getMultiRoleName(allRolesTxt: string, index: number) {
    const firstRoleEndIndex = allRolesTxt.indexOf(',')
    let actualRoleName: string = ''
    switch (index) {
      case 0:
        actualRoleName = allRolesTxt.substring(0, firstRoleEndIndex)
        break
      case 1:
        actualRoleName = allRolesTxt.substring(firstRoleEndIndex + 1).trim()
        break
      default:
        throw new Error(`${index} is not a valid index`)
    }
    return actualRoleName
  }

  async assertSearchInputPresent() {
    await expect(this.searchInput).toBeVisible()
    await expect(this.searchButton).toBeVisible()
    await expect(this.searchLabel).toBeVisible()
    await expect(this.searchLabel).toHaveText('Search by organisation name or contact email address')
  }

  async selectRandomOrgListItemIndex(): Promise<number> {
    const max = await this.orgListItem.count()
    const index = Math.floor(Math.random() * max)
    return index
  }

  async getOrgIdFromListTitle(index: number): Promise<string> {
    const idLink = confirmStringNotNull(await this.orgListItemNameLink.nth(index).getAttribute('href'))
    return idLink.substring(15)
  }

  async getActualRoleName(roleName: string): Promise<string> {
    return roleName.replace(/\s*-\s*organisation role$/i, '').trim()
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

  async assertManageButtonPresent(index: number) {
    await expect(this.orgListItemManageButton.nth(index)).toBeVisible()
    const actualVisibleButtonText = await this.orgListItemManageButton.nth(index).textContent()
    expect(actualVisibleButtonText?.startsWith('Manage')).toBeTruthy()
  }

  async assertPaginationPresent(available: boolean) {
    if (available) {
      await expect(this.paginationOptions).toBeVisible()
    } else {
      await expect(this.paginationOptions).toBeHidden()
    }
  }

  async assertCurrentPage(pageNo: string) {
    await expect(this.paginateCurrentPage).toBeVisible()
    await expect(this.paginateCurrentPage).toHaveText(pageNo)
  }

  async assertPrevNextOptions(position: string) {
    switch (position.toLowerCase()) {
      case 'first':
        await expect(this.paginateNext).toBeVisible()
        await expect(this.paginatePrev).toBeHidden()
        break
      case 'middle':
        await expect(this.paginateNext).toBeVisible()
        await expect(this.paginatePrev).toBeVisible()
        break
      case 'last':
        await expect(this.paginatePrev).toBeVisible()
        await expect(this.paginateNext).toBeHidden()
        break
      default:
        throw new Error(`${position} is not a valid option`)
    }
  }

  async assertOrgHasMutipleRoleInDb(dbReq: string) {
    const expectedValues = await seDatabaseReq(`${dbReq}`)
    expect(expectedValues.length).toBeGreaterThan(1)
  }
}
