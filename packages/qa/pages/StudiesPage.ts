import { expect, Locator, Page } from '@playwright/test'
import {
  convertPromiseStringToNumber,
  confirmStringNotNull,
  convertIsoDateToDisplayDate,
  numDaysBetween,
} from '../utils/UtilFunctions'
import { seDatabaseReq } from '../utils/DbRequests'
import { RowDataPacket } from 'mysql2'

//Declare Page Objects
export default class StudiesPage {
  readonly page: Page
  readonly pageTitle: Locator
  readonly assessStudiesDropdown: Locator
  readonly studiesFoundHeading: Locator
  readonly lblDueAssessment: Locator
  readonly txtIntroGuidance: Locator
  readonly expandCollapseSection: Locator
  readonly expandCollapseSectionContents: Locator
  readonly paginationOptions: Locator
  readonly paginatePrev: Locator
  readonly paginateNext: Locator
  readonly paginateCurrentPage: Locator
  readonly paginationPageList: Locator
  readonly studyList: Locator
  readonly studyListItem: Locator
  readonly studyListItemTitle: Locator
  readonly studyListItemOrgName: Locator
  readonly studyListItemLastAssessmentLbl: Locator
  readonly studyListItemLastAssessmentValue: Locator
  readonly studyListItemDataIndicatesLbl: Locator
  readonly studyListItemDataIndicatesValue: Locator
  readonly studyListItemDueIndicator: Locator
  readonly searchInput: Locator
  readonly searchButton: Locator
  readonly searchFilterPanel: Locator
  readonly viewStudyButton: Locator
  readonly sortBySection: Locator
  readonly sortByLabel: Locator
  readonly sortByDropdown: Locator
  readonly studyLastItem: Locator
  readonly studyLastDue: Locator

  //Initialize Page Objects
  constructor(page: Page) {
    this.page = page

    //Locators
    this.pageTitle = page.locator('h2[class="govuk-heading-l govuk-!-margin-bottom-4"]')
    this.assessStudiesDropdown = page.locator('span[class="govuk-details__summary-text"]')
    this.studiesFoundHeading = page.locator('p[class="govuk-heading-s mb-0 whitespace-nowrap"]')
    this.lblDueAssessment = page.locator(
      'div[class="flex items-center gap-2 govuk-!-margin-bottom-4"] strong[class="govuk-heading-s govuk-!-margin-bottom-0"]'
    )
    this.txtIntroGuidance = page.locator('div[class="w-full"] p[class="govuk-body"]')
    this.expandCollapseSection = page.locator(
      'details[class="[&>summary]:text-blue govuk-details govuk-!-margin-bottom-4"]'
    )
    this.expandCollapseSectionContents = page.locator('div[class="govuk-details__text [&>*>p:last-child]:mb-0"]')
    this.paginationOptions = page.locator('nav[aria-label="results"]')
    this.paginateNext = page.locator('a[rel="next"]')
    this.paginatePrev = page.locator('a[rel="prev"]')
    this.paginateCurrentPage = page.locator('a[aria-current="page"]')
    this.paginationPageList = page.locator('ul[class="govuk-pagination__list"]')
    this.studyList = page.locator('ol[aria-label="Studies"]')
    this.studyListItem = this.studyList.locator('li')
    this.studyLastItem = this.studyListItem.last()
    this.studyLastDue = this.studyLastItem.locator('span', { hasText: 'due' })
    this.studyListItemTitle = this.studyListItem.locator(
      'div[class="govuk-heading-s govuk-!-margin-bottom-4 govuk-!-padding-top-0 inline-block font-extrabold"]'
    )
    this.studyListItemOrgName = page.locator(
      'div[class="text-darkGrey govuk-!-margin-bottom-1 max-w-[calc(100%-45px)] lg:max-w-auto govuk-body-s"]'
    )
    this.studyListItemLastAssessmentLbl = page
      .locator('div[class="lg:min-w-[320px]"] strong[class="govuk-heading-s govuk-!-margin-bottom-0"]')
      .nth(0)
    this.studyListItemDataIndicatesLbl = page
      .locator('div[class="lg:min-w-[320px]"] strong[class="govuk-heading-s govuk-!-margin-bottom-0"]')
      .nth(1)
    this.studyListItemLastAssessmentValue = page
      .locator('div[class="lg:min-w-[320px]"] p[class="govuk-body-s govuk-!-margin-top-1 govuk-!-margin-bottom-0"]')
      .nth(0)
    this.studyListItemDataIndicatesValue = page
      .locator('div[class="lg:min-w-[320px]"] p[class="govuk-body-s govuk-!-margin-top-1 govuk-!-margin-bottom-0"]')
      .nth(1)
    this.studyListItemDueIndicator = page.locator('span')
    this.searchInput = page.locator('input[class="govuk-input govuk-input h-[50px] border-2 border-black p-2"]')
    this.searchButton = page.locator(
      'button[class="bg-[var(--colour-blue)] text-white active:top-0 focus:shadow-[inset_0_0_0_4px_var(--text-grey)] focus:outline focus:outline-[3px] focus:outline-[var(--focus)] mb-0 w-[50px] h-[50px] flex items-center justify-center text-lg"]'
    )
    this.searchFilterPanel = page.locator('ul[aria-labelledby="selected-filters"]')
    this.viewStudyButton = page.locator('a[class="govuk-button w-auto govuk-!-margin-bottom-0"]')
    this.sortBySection = page.locator('div[class="govuk-form-group mt-2 items-center justify-end md:my-0 md:flex"]')
    this.sortByLabel = this.sortBySection.locator('label')
    this.sortByDropdown = this.sortBySection.locator('select')
  }

  //Page Methods
  async goto() {
    await this.page.goto('studies')
  }

  async assertOnStudiesPage() {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.pageTitle).toHaveText('Assess progress of studies')
    await expect(this.page).toHaveURL('studies')
  }

  async assertOnStudiesPageWithSuccess() {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.pageTitle).toHaveText('Assess progress of studies')
    await expect(this.page).toHaveURL('studies?success=1')
  }

  async assertDueLabelPresent() {
    await expect(this.lblDueAssessment).toBeVisible()
    await expect(this.lblDueAssessment).toContainText('There are ')
    await expect(this.lblDueAssessment).toContainText('studies to assess')
  }

  async assertIntroGuideTxt() {
    await expect(this.txtIntroGuidance).toBeVisible()
    await expect(this.txtIntroGuidance).toHaveText(
      'Review study data and provide data updates where necessary. You will also be able to assess if studies are on or off track, and decide if any NIHR RDN support is needed.'
    )
  }

  async assertExpandableSectionPresent() {
    await expect(this.expandCollapseSection).toBeVisible()
    await expect(this.expandCollapseSection.locator('summary')).toHaveText('Why am I being asked to assess studies?')
  }

  async assertExpandableSectionState(state: string) {
    if (state.toLowerCase() == 'collapsed') {
      await expect(this.expandCollapseSectionContents).toBeHidden()
    } else {
      await expect(this.expandCollapseSectionContents).toBeVisible()
    }
  }

  async assertExpandableSectionTxt() {
    await expect(this.expandCollapseSectionContents.locator('p')).toHaveText(
      'NIHR RDN asks sponsors or their delegates to review and assess study progress for UK studies when:'
    )
    await expect(this.expandCollapseSectionContents.locator('ul > li')).toHaveText([
      'A study falls behind the agreed milestones in the UK or',
      'A study is not recruiting to target in the UK',
      'And the last progress assessment from the sponsor is over 3 months old',
    ])
  }

  async assertResultCountGreaterThan(target: number) {
    const results = await this.getNumberOfResults()
    expect(results).toBeGreaterThan(target)
  }

  async assertResultCountLessThan(target: number) {
    const results = await this.getNumberOfResults()
    expect(results).toBeLessThan(target)
  }

  async getNumberOfResults(): Promise<number> {
    await expect(this.studiesFoundHeading).toBeVisible()
    const resultsText = await this.studiesFoundHeading.textContent()
    const resultNo = convertPromiseStringToNumber(resultsText?.split(' ').at(0))
    return resultNo
  }

  async assertPaginationPresent(visible: boolean) {
    if (visible) {
      await expect(this.paginationOptions).toBeVisible()
    } else {
      await expect(this.paginationOptions).toBeHidden()
    }
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

  async assertCurrentPage(pageNo: string) {
    await expect(this.paginateCurrentPage).toBeVisible()
    await expect(this.paginateCurrentPage).toHaveText(pageNo)
  }

  async assertTotalNumberStudies(dbReq: string) {
    const uiTotalStudies = await this.getNumberOfResults()
    const dbTotalStudies = await seDatabaseReq(`${dbReq}`)
    expect(uiTotalStudies).toEqual(dbTotalStudies[0].count)
  }

  async assertSpecificNumberStudies(expectedTotal: number) {
    const uiTotalStudies = await this.getNumberOfResults()
    expect(uiTotalStudies).toEqual(expectedTotal)
  }

  async assertStudyOrgs(dbReq: string) {
    let dbStudyOrgTitlesArray: string[] = []
    const dbStudyOrgTitles = await seDatabaseReq(`${dbReq}`)
    dbStudyOrgTitles.forEach((element) => {
      dbStudyOrgTitlesArray.push(element.shortTitle)
    })
    for (const studyTitle of await this.studyListItemTitle.all()) {
      expect(dbStudyOrgTitlesArray).toContain(await studyTitle.textContent())
    }
  }

  async selectRandomStudyListItemIndex(): Promise<number> {
    const max = await this.studyListItem.count()
    const index = Math.floor(Math.random() * max)
    return index
  }

  async getStudyIdFromListViewButton(index: number): Promise<string> {
    const idLink = confirmStringNotNull(await this.viewStudyButton.nth(index).getAttribute('href'))
    return idLink.substring(9)
  }

  async assertTitleAndSponsors(dbReq: string, index: number) {
    let expectedSponsor: string = ''
    let expectedCroCtu: string = ''
    const expectedValues = await seDatabaseReq(`${dbReq}`)
    const expectedTitle = expectedValues[0].shortTitle
    const actualOrgNames = confirmStringNotNull(await this.studyListItemOrgName.nth(index).textContent())
    expectedValues.forEach((value) => {
      if (value.organisationRoleId == 1) {
        expectedSponsor = value.orgName.trim()
      } else {
        expectedCroCtu = value.orgName.trim()
      }
    })
    const actualSponsorName = await this.getSponsorName(actualOrgNames)
    const actualCroCtuName = await this.getCroCtuName(actualOrgNames)
    expect(expectedTitle).toEqual(await this.studyListItemTitle.nth(index).textContent())
    expect(expectedSponsor).toEqual(actualSponsorName)
    expect(expectedCroCtu).toEqual(actualCroCtuName)
  }

  async getSponsorName(studyListOrgName: string) {
    const sponsorEndIndex = studyListOrgName?.indexOf('(')
    if (sponsorEndIndex < 0) {
      return studyListOrgName
    } else {
      return studyListOrgName?.substring(0, sponsorEndIndex).trim()
    }
  }

  async getCroCtuName(studyListOrgName: string) {
    const sponsorEndIndex = studyListOrgName?.indexOf('(')
    const croCtuEndIndex = studyListOrgName?.lastIndexOf(')')
    if (sponsorEndIndex > 0) {
      return studyListOrgName?.substring(sponsorEndIndex + 1, croCtuEndIndex).trim()
    } else {
      return ''
    }
  }

  async assertLastAssessmentLbl(index: number) {
    expect(await this.studyListItem.nth(index).locator(this.studyListItemLastAssessmentLbl).textContent()).toEqual(
      'Last sponsor assessment'
    )
  }

  async assertLastAssessmentValue(dbReq: string, index: number) {
    const expectedValues = await seDatabaseReq(`${dbReq}`)
    const actualValue = await this.studyListItem.nth(index).locator(this.studyListItemLastAssessmentValue).textContent()
    if (expectedValues.length > 0) {
      let statusText = ''
      if (expectedValues[0].statusId == 1) {
        statusText = 'On track'
      } else {
        statusText = 'Off track'
      }
      const expectedDate = convertIsoDateToDisplayDate(new Date(expectedValues[0].createdAt))
      expect(actualValue).toEqual(`${statusText} on ${expectedDate}`)
    } else {
      expect(actualValue).toEqual('None')
    }
  }

  async assertSpecificLastAssessmentValue(expectedValue: string, index: number) {
    const actualValue = await this.studyListItem.nth(index).locator(this.studyListItemLastAssessmentValue).textContent()
    expect(actualValue).toEqual(expectedValue)
  }

  async assertDataIndicatesLbl(index: number) {
    expect(await this.studyListItem.nth(index).locator(this.studyListItemDataIndicatesLbl).textContent()).toEqual(
      'Study data indicates'
    )
  }

  async assertDataIndicatesValue(dbReq: string, index: number) {
    const expectedValues = await seDatabaseReq(`${dbReq}`)
    const actualValue = await this.studyListItem.nth(index).locator(this.studyListItemDataIndicatesValue).textContent()
    if (expectedValues.length > 1) {
      expect(actualValue).toEqual(await this.getExpectedMultipleIndicatorsAsString(expectedValues))
    } else if (expectedValues.length > 0) {
      expect(actualValue).toContain(expectedValues[0].indicatorType)
    } else {
      expect(actualValue).toEqual('No concerns')
    }
  }

  async getExpectedMultipleIndicatorsAsString(indicatorsArray: RowDataPacket[]) {
    let expectedString = ''
    let uniqueIndicatorsArray: string[] = []
    indicatorsArray.forEach((element) => {
      if (!uniqueIndicatorsArray.includes(element.indicatorType)) {
        uniqueIndicatorsArray.push(element.indicatorType)
      }
    })

    for (let index = 0; index < uniqueIndicatorsArray.length; index++) {
      expectedString += uniqueIndicatorsArray[index]
      if (index != uniqueIndicatorsArray.length - 1) {
        expectedString += ', '
      }
    }
    return expectedString
  }

  async enterSearchPhrase(searchPhrase: string) {
    await this.searchInput.fill(searchPhrase)
    await this.searchButton.click()
    await this.searchFilterPanel.waitFor()
  }

  async getDaysSinceAssessmentDue(dueAssessmentAt: Date) {
    return Math.round(numDaysBetween(new Date(), dueAssessmentAt))
  }

  async assertDueIndicatorDisplayed(index: number, dueAssessmentAt?: Date | null) {
    if (dueAssessmentAt) {
      const numberOfDaysDue = await this.getDaysSinceAssessmentDue(dueAssessmentAt)

      await expect(this.studyListItem.nth(index).locator(this.studyListItemDueIndicator)).toBeVisible()
      await expect(this.studyListItem.nth(index).locator(this.studyListItemDueIndicator)).toHaveText(
        `Due for ${numberOfDaysDue || 1} day${numberOfDaysDue > 1 ? 's' : ''}`
      )
    } else {
      await expect(this.studyListItem.nth(index).locator(this.studyListItemDueIndicator)).toBeHidden()
    }
  }

  async assertSortSectionPresent() {
    await expect(this.sortBySection).toBeVisible()
    await expect(this.sortByLabel).toBeVisible()
    await expect(this.sortByDropdown).toBeVisible()
    await expect(this.sortByLabel).toHaveText('Sort by')
  }

  async selectSortOption(option: string) {
    switch (option.toLowerCase()) {
      case 'due':
        await this.sortByDropdown.selectOption('due-assessment')
        break
      case 'asc':
        await this.sortByDropdown.selectOption('last-assessment-asc')
        break
      case 'desc':
        await this.sortByDropdown.selectOption('last-assessment-desc')
        break
      default:
        throw new Error(`${option} is not a valid option`)
    }
  }

  async assertListBeginsWithDueStudies(sortedList: RowDataPacket[]) {
    function checkForStudyDue(studies: any) {
      for (let study of studies) {
        if (study.dueAssessmentAt) {
          console.log('At least 1 study is due an assessment')
          return true
        }
      }
      console.log('All studies are currently not due an assessment')
      return false
    }

    if (checkForStudyDue(sortedList)) {
      const pageStudyCount = await this.studyListItem.count()
      for (let index = 0; index < pageStudyCount; index++) {
        const study = sortedList[index]
        if (study.dueAssessmentAt) {
          await expect(this.studyListItemTitle.nth(index)).toHaveText(study.shortTitle)
          await expect(this.studyListItem.nth(index).locator(this.studyListItemDueIndicator)).toBeVisible()
        }
      }
    } else {
      throw new Error('No studies are due an assessment, check test data...')
    }
  }

  async assertListEndsWithNonDueStudies(sortedList: RowDataPacket[]) {
    function checkForStudyNotDue(studies: any) {
      for (let study of studies) {
        if (study.dueAssessmentAt === null) {
          console.log('At least 1 study is not due an assessment, checking last study status...')
          return true
        }
      }
      console.log('All studies are currently due an assessment, checking last study status...')
      return false
    }

    await expect(this.studyLastItem).toBeVisible()
    if (checkForStudyNotDue(sortedList)) {
      await expect(this.studyLastDue).not.toBeVisible()
    } else {
      await expect(this.studyLastDue).toBeVisible()
    }
  }

  async assertListSortedDateAscending(sortedList: RowDataPacket[]) {
    const pageStudyCount = await this.studyListItem.count()
    for (let index = 0; index < pageStudyCount; index++) {
      const study = sortedList[index]
      await expect(this.studyListItemTitle.nth(index)).toHaveText(study.shortTitle)
    }
  }

  async assertListSortedDateDescending(sortedList: RowDataPacket[]) {
    const pageStudyCount = await this.studyListItem.count()
    for (let index = 0; index < pageStudyCount; index++) {
      const study = sortedList[index]
      await expect(this.studyListItemTitle.nth(index)).toHaveText(study.shortTitle)
    }
  }

  async assertStudyListIsVisible() {
    await expect(this.studyList).toBeVisible()
  }
}
