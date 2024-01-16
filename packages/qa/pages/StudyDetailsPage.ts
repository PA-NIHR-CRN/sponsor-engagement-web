import { expect, Locator, Page } from '@playwright/test'
import { confirmStringNotNull, convertIsoDateToDisplayDate } from '../utils/UtilFunctions'
import { RowDataPacket } from 'mysql2'

//Declare Page Objects
export default class StudyDetailsPage {
  readonly page: Page
  readonly pageTitle: Locator
  readonly progressHeader: Locator
  readonly progressSection: Locator
  readonly assessmentHeader: Locator
  readonly aboutHeader: Locator
  readonly aboutSection: Locator
  readonly tableFullTitleHeader: Locator
  readonly tableFullTitleValue: Locator
  readonly tableIrasIdHeader: Locator
  readonly tableIrasIdValue: Locator
  readonly tableProtocolRefNoHeader: Locator
  readonly tableProtocolRefNoValue: Locator
  readonly tableCpmsIdHeader: Locator
  readonly tableCpmsIdValue: Locator
  readonly tableSponsorHeader: Locator
  readonly tableSponsorValue: Locator
  readonly tableManagingSpecialtyHeader: Locator
  readonly tableManagingSpecialtyValue: Locator
  readonly tableChiefInvestigatorHeader: Locator
  readonly tableChiefInvestigatorValue: Locator
  readonly tableCroHeader: Locator
  readonly tableCroValue: Locator
  readonly tableCtuHeader: Locator
  readonly tableCtuValue: Locator
  readonly guidanceText: Locator
  readonly sponsorOrgSubTitle: Locator
  readonly progressSummarySubTitle: Locator
  readonly tableStatusHeader: Locator
  readonly tableStatusValue: Locator
  readonly tableDataIndicatesHeader: Locator
  readonly tableDataIndicatesValue: Locator
  readonly tablePlannedOpeningDateHeader: Locator
  readonly tablePlannedOpeningDateValue: Locator
  readonly tableActualOpeningDateHeader: Locator
  readonly tableActualOpeningDateValue: Locator
  readonly tablePlannedClosureDateHeader: Locator
  readonly tablePlannedClosureDateValue: Locator
  readonly tableActualClosureDateHeader: Locator
  readonly tableActualClosureDateValue: Locator
  readonly tableNetworkTargetHeader: Locator
  readonly tableNetworkTargetValue: Locator
  readonly tableNetworkTotalHeader: Locator
  readonly tableNetworkTotalValue: Locator
  readonly tableUkTargetHeader: Locator
  readonly tableUkTargetValue: Locator
  readonly tableUkTotalHeader: Locator
  readonly tableUkTotalValue: Locator
  readonly tableEstimatedReopenDateHeader: Locator
  readonly tableEstimatedReopenDateValue: Locator
  readonly assessButton: Locator
  readonly assessSuccessAlertBox: Locator
  readonly assessSuccessAlertBoxTitle: Locator
  readonly noAssessmentValue: Locator
  readonly firstSponsorAssessmentFurtherInfo: Locator
  readonly secondSponsorAssessmentFurtherInfo: Locator
  readonly firstSponsorAssessmentFurtherInfoBullets: Locator
  readonly secondSponsorAssessmentFurtherInfoBullets: Locator
  readonly firstSponsorAssessmentFurtherInfoText: Locator
  readonly secondSponsorAssessmentFurtherInfoText: Locator
  readonly firstSponsorAssessmentRow: Locator
  readonly secondSponsorAssessmentRow: Locator
  readonly firstSponsorAssessmentDate: Locator
  readonly secondSponsorAssessmentDate: Locator
  readonly firstSponsorAssessmentText: Locator
  readonly secondSponsorAssessmentText: Locator
  readonly firstSponsorAssessmentTrack: Locator
  readonly secondSponsorAssessmentTrack: Locator
  readonly dueIndicator: Locator
  readonly dueIndicatorSupportingText: Locator

  //Initialize Page Objects
  constructor(page: Page) {
    this.page = page

    //Locators
    this.pageTitle = page.locator('h2[class="govuk-heading-l govuk-!-margin-bottom-1"]')
    this.progressHeader = page.locator('h3[class="govuk-heading-m govuk-!-margin-bottom-1 p-0"]', {
      hasText: 'Progress Summary',
    })
    this.progressSection = page.locator('table[class="govuk-table govuk-!-margin-top-3"]')
    this.assessmentHeader = page.locator('h3[class="govuk-heading-m govuk-!-margin-bottom-1 p-0"]', {
      hasText: 'Sponsor assessment history',
    })
    this.aboutHeader = page.locator('h3[class="govuk-heading-m govuk-!-margin-bottom-3"]')
    this.aboutSection = page.locator('table[class="govuk-table govuk-!-margin-bottom-3"]')
    this.guidanceText = page.locator('div[class="w-full"] p').nth(0)
    this.sponsorOrgSubTitle = page.locator('span[class="govuk-body-m mb-0 text-darkGrey"]')
    this.progressSummarySubTitle = page.locator('span[class="govuk-body-s text-darkGrey"]')
    this.assessButton = page.locator('a[class="govuk-button w-auto govuk-!-margin-bottom-0"]')
    // About Study Table Values
    this.tableFullTitleHeader = page.locator('th[scope="row"]', { hasText: 'Study full title' })
    this.tableFullTitleValue = this.tableFullTitleHeader.locator('..').locator('td')
    this.tableProtocolRefNoHeader = page.locator('th[scope="row"]', { hasText: 'Protocol reference number' })
    this.tableProtocolRefNoValue = this.tableProtocolRefNoHeader.locator('..').locator('td')
    this.tableIrasIdHeader = page.locator('th[scope="row"]', { hasText: 'IRAS ID' })
    this.tableIrasIdValue = this.tableIrasIdHeader.locator('..').locator('td')
    this.tableCpmsIdHeader = page.locator('th[scope="row"]', { hasText: 'CPMS ID' })
    this.tableCpmsIdValue = this.tableCpmsIdHeader.locator('..').locator('td')
    this.tableSponsorHeader = page.locator('th[scope="row"]', { hasText: 'Sponsor' })
    this.tableSponsorValue = this.tableSponsorHeader.locator('..').locator('td')
    this.tableManagingSpecialtyHeader = page.locator('th[scope="row"]', { hasText: 'Managing specialty' })
    this.tableManagingSpecialtyValue = this.tableManagingSpecialtyHeader.locator('..').locator('td')
    this.tableChiefInvestigatorHeader = page.locator('th[scope="row"]', { hasText: 'Chief investigator' })
    this.tableChiefInvestigatorValue = this.tableChiefInvestigatorHeader.locator('..').locator('td')
    this.tableCroHeader = page.locator('th[scope="row"]', { hasText: 'CRO' })
    this.tableCroValue = this.tableCroHeader.locator('..').locator('td')
    this.tableCtuHeader = page.getByText('CTU', { exact: true })
    this.tableCtuValue = this.tableCtuHeader.locator('..').locator('td')
    //Progress Table Values
    this.tableStatusHeader = page.locator('th[scope="row"]', { hasText: 'Study Status' })
    this.tableStatusValue = this.tableStatusHeader.locator('..').locator('td')
    this.tableDataIndicatesHeader = page.locator('th[scope="row"]', { hasText: 'Study data indicates' })
    this.tableDataIndicatesValue = this.tableDataIndicatesHeader.locator('..').locator('td')
    this.tablePlannedOpeningDateHeader = page.locator('th[scope="row"]', { hasText: 'Planned opening date' })
    this.tablePlannedOpeningDateValue = this.tablePlannedOpeningDateHeader.locator('..').locator('td')
    this.tableActualOpeningDateHeader = page.locator('th[scope="row"]', { hasText: 'Actual opening date' })
    this.tableActualOpeningDateValue = this.tableActualOpeningDateHeader.locator('..').locator('td')
    this.tablePlannedClosureDateHeader = page.locator('th[scope="row"]', {
      hasText: 'Planned closure to recruitment date',
    })
    this.tablePlannedClosureDateValue = this.tablePlannedClosureDateHeader.locator('..').locator('td')
    this.tableActualClosureDateHeader = page.locator('th[scope="row"]', {
      hasText: 'Actual closure to recruitment date',
    })
    this.tableActualClosureDateValue = this.tableActualClosureDateHeader.locator('..').locator('td')
    this.tableNetworkTargetHeader = page.locator('th[scope="row"]', { hasText: 'Network recruitment target' })
    this.tableNetworkTargetValue = this.tableNetworkTargetHeader.locator('..').locator('td')
    this.tableNetworkTotalHeader = page.locator('th[scope="row"]', { hasText: 'Total network recruitment to date' })
    this.tableNetworkTotalValue = this.tableNetworkTotalHeader.locator('..').locator('td')
    this.tableUkTargetHeader = page.locator('th[scope="row"]', { hasText: 'UK recruitment target' })
    this.tableUkTargetValue = this.tableUkTargetHeader.locator('..').locator('td')
    this.tableUkTotalHeader = page.locator('th[scope="row"]', { hasText: 'Total UK recruitment to date' })
    this.tableUkTotalValue = this.tableUkTotalHeader.locator('..').locator('td')
    this.tableEstimatedReopenDateHeader = page.locator('th[scope="row"]', { hasText: 'Estimated reopening date' })
    this.tableEstimatedReopenDateValue = this.tableEstimatedReopenDateHeader.locator('..').locator('td')
    //Assessment Success
    this.assessSuccessAlertBox = page.locator(
      'div[class="govuk-notification-banner govuk-notification-banner--success"]'
    )
    this.assessSuccessAlertBoxTitle = page.locator('h2[id="govuk-notification-banner-title"]')
    //Sponsor Assessment Table
    this.noAssessmentValue = page.locator('p[class="govuk-body-s"]')
    this.firstSponsorAssessmentFurtherInfo = page.locator('div[id="radix-:r3:"] div')
    this.secondSponsorAssessmentFurtherInfo = page.locator('div[id="radix-:r5:"] div')
    this.firstSponsorAssessmentFurtherInfoBullets = this.firstSponsorAssessmentFurtherInfo.locator('ul li')
    this.secondSponsorAssessmentFurtherInfoBullets = this.secondSponsorAssessmentFurtherInfo.locator('ul li')
    this.firstSponsorAssessmentFurtherInfoText = this.firstSponsorAssessmentFurtherInfo.locator('p')
    this.secondSponsorAssessmentFurtherInfoText = this.secondSponsorAssessmentFurtherInfo.locator('p')
    this.firstSponsorAssessmentRow = page.locator('button[id="radix-:r2:"]')
    this.secondSponsorAssessmentRow = page.locator('button[id="radix-:r4:"]')
    this.firstSponsorAssessmentDate = this.firstSponsorAssessmentRow.locator('div')
    this.secondSponsorAssessmentDate = this.secondSponsorAssessmentRow.locator('div')
    this.firstSponsorAssessmentText = this.firstSponsorAssessmentRow.locator(
      'span[class="ml-[35px] md:ml-0 govuk-body-s mb-0"]'
    )
    this.secondSponsorAssessmentText = this.secondSponsorAssessmentRow.locator(
      'span[class="ml-[35px] md:ml-0 govuk-body-s mb-0"]'
    )
    this.firstSponsorAssessmentTrack = this.firstSponsorAssessmentText.locator('strong')
    this.secondSponsorAssessmentTrack = this.secondSponsorAssessmentText.locator('strong')
    this.dueIndicator = page.locator('span[class="govuk-tag govuk-tag--red mr-2"]')
    this.dueIndicatorSupportingText = this.dueIndicator.locator('..')
  }

  //Page Methods
  async goto(studyId: string) {
    await this.page.goto(`studies/${studyId}`)
  }

  async assertOnStudyDetailsPage(studyId: string) {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.progressHeader).toBeVisible()
    await expect(this.assessmentHeader).toBeVisible()
    await expect(this.aboutHeader).toBeVisible()
    await expect(this.aboutHeader).toHaveText('About this study')
    await expect(this.page).toHaveURL(`studies/${studyId}`)
  }

  async gotoSuccess(studyId: string) {
    await this.page.goto(`studies/${studyId}?success=1`)
  }

  async assertOnStudyDetailsPageWithSuccess(studyId: string) {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.progressHeader).toBeVisible()
    await expect(this.assessmentHeader).toBeVisible()
    await expect(this.aboutHeader).toBeVisible()
    await expect(this.assessSuccessAlertBox).toBeVisible()
    await expect(this.assessSuccessAlertBoxTitle).toHaveText('Success')
    await expect(this.page).toHaveURL(`studies/${studyId}?success=1`)
  }

  async assertAboutStudySectionPresent() {
    await expect(this.aboutHeader).toBeVisible()
    await expect(this.aboutHeader).toHaveText('About this study')
    await expect(this.aboutSection).toBeVisible()
  }

  async assertStudyFullTitle(expectedFullTitle: string) {
    await expect(this.tableFullTitleHeader).toBeVisible()
    await expect(this.tableFullTitleValue).toBeVisible()
    await expect(this.tableFullTitleValue).toHaveText(expectedFullTitle)
  }

  async assertProtocolRefNo(expectedProtocolRefNo: string) {
    if (expectedProtocolRefNo == 'false') {
      await expect(this.tableProtocolRefNoHeader).toBeHidden()
      await expect(this.tableProtocolRefNoValue).toBeHidden()
    } else {
      if (expectedProtocolRefNo == null) {
        expectedProtocolRefNo = 'None available'
      }
      await expect(this.tableProtocolRefNoHeader).toBeVisible()
      await expect(this.tableProtocolRefNoValue).toBeVisible()
      await expect(this.tableProtocolRefNoValue).toHaveText(expectedProtocolRefNo)
    }
  }

  async assertStudyIrasId(expectedIrasId: string) {
    if (expectedIrasId == null) {
      expectedIrasId = 'None available'
    }
    await expect(this.tableIrasIdHeader).toBeVisible()
    await expect(this.tableIrasIdValue).toBeVisible()
    await expect(this.tableIrasIdValue).toHaveText(expectedIrasId)
  }

  async assertStudyCpmsId(expectedCpmsId: string) {
    await expect(this.tableCpmsIdHeader).toBeVisible()
    await expect(this.tableCpmsIdValue).toBeVisible()
    await expect(this.tableCpmsIdValue).toHaveText(expectedCpmsId)
  }

  async assertStudySponsor(expectedSponsor: string) {
    await expect(this.tableSponsorHeader).toBeVisible()
    await expect(this.tableSponsorValue).toBeVisible()
    await expect(this.tableSponsorValue).toHaveText(expectedSponsor)
  }

  async assertManagingSpecialty(expectedManagingSpecialty: string) {
    await expect(this.tableManagingSpecialtyHeader).toBeVisible()
    await expect(this.tableManagingSpecialtyValue).toBeVisible()
    await expect(this.tableManagingSpecialtyValue).toHaveText(expectedManagingSpecialty)
  }

  async assertChiefInvestigator(expectedChiefFirstName: string, expectedChiefLastName: string) {
    let expectedChiefInvestigator: string
    if (expectedChiefFirstName == null) {
      expectedChiefInvestigator = 'None available'
    } else {
      expectedChiefInvestigator = expectedChiefFirstName + ' ' + expectedChiefLastName
    }
    await expect(this.tableChiefInvestigatorHeader).toBeVisible()
    await expect(this.tableChiefInvestigatorValue).toBeVisible()
    await expect(this.tableChiefInvestigatorValue).toHaveText(expectedChiefInvestigator)
  }

  async assertCroPresent(expectedCroValue: string) {
    if (expectedCroValue == 'false') {
      await expect(this.tableCroHeader).not.toBeVisible()
      await expect(this.tableCroValue).not.toBeVisible()
    } else {
      await expect(this.tableCroHeader).toBeVisible()
      await expect(this.tableCroValue).toBeVisible()
      await expect(this.tableCroValue).toHaveText(expectedCroValue)
    }
  }

  async assertCtuPresent(expectedCtuValue: string) {
    if (expectedCtuValue == 'false') {
      await expect(this.tableCtuHeader).not.toBeVisible()
      await expect(this.tableCtuValue).not.toBeVisible()
    } else {
      await expect(this.tableCtuHeader).toBeVisible()
      await expect(this.tableCtuValue).toBeVisible()
      await expect(this.tableCtuValue).toHaveText(expectedCtuValue)
    }
  }

  async assertGuidanceText() {
    await expect(this.guidanceText).toBeVisible()
    await expect(this.guidanceText).toHaveText(
      'You can review the progress of this study at any time. You will need to assess if the study is on or off track and if any NIHR CRN support is needed.'
    )
  }

  async assertStudyShortTitle(expectedShortTitle: string) {
    await expect(this.pageTitle).toBeVisible()
    const actualText = confirmStringNotNull(await this.pageTitle.textContent())
    expect(actualText.substring(19)).toEqual(expectedShortTitle)
  }

  async assertStudySponsorSubTitle(expectedSponsor: string) {
    await expect(this.sponsorOrgSubTitle).toBeVisible()
    const actualText = confirmStringNotNull(await this.sponsorOrgSubTitle.textContent())
    const croCtuIndex = await this.getStartIndexForCtoCtuName(actualText)
    if (croCtuIndex != -1) {
      expect(actualText.substring(15, croCtuIndex).trim()).toEqual(expectedSponsor)
    } else {
      expect(actualText.substring(15).trim()).toEqual(expectedSponsor)
    }
  }

  async assertStudyCroCtuSubTitle(expectedCroCtu: string) {
    await expect(this.sponsorOrgSubTitle).toBeVisible()
    const actualText = confirmStringNotNull(await this.sponsorOrgSubTitle.textContent())
    const croCtuStartIndex = (await this.getStartIndexForCtoCtuName(actualText)) + 1
    const croCtuEndIndex = await this.getEndIndexForCtoCtuName(actualText)
    expect(actualText.substring(croCtuStartIndex, croCtuEndIndex).trim()).toEqual(expectedCroCtu)
  }

  async getStartIndexForCtoCtuName(textToCheck: string): Promise<number> {
    return textToCheck.indexOf('(')
  }

  async getEndIndexForCtoCtuName(textToCheck: string): Promise<number> {
    return textToCheck.lastIndexOf(')')
  }

  async assertProgressSummarySectionPresent() {
    await expect(this.progressHeader).toBeVisible()
    await expect(this.progressHeader).toHaveText('Progress Summary')
    await expect(this.progressSection).toBeVisible()
  }

  async assertProgressSummarySectionSubtitle() {
    await expect(this.progressSummarySubTitle).toBeVisible()
    await expect(this.progressSummarySubTitle).toHaveText(
      'Based on the latest data uploaded to CPMS by the study team.'
    )
  }

  async assertStudyStatus(expectedStatus: string) {
    await expect(this.tableStatusHeader).toBeVisible()
    await expect(this.tableStatusValue).toBeVisible()
    await expect(this.tableStatusValue).toHaveText(expectedStatus)
  }

  async assertDataIndicators(expectedDataIndicators: RowDataPacket[]) {
    await expect(this.tableDataIndicatesHeader).toBeVisible()
    await expect(this.tableDataIndicatesValue).toBeVisible()
    if (expectedDataIndicators.length == 0) {
      expect(this.tableDataIndicatesValue).toHaveText('This study is progressing as planned')
    } else {
      expectedDataIndicators.forEach((record) => {
        if (record.isDeleted != 1) {
          expect(this.tableDataIndicatesValue).toContainText(record.indicatorValue)
        }
      })
    }
  }

  async assertPlannedOpeningDate(expectedValues: RowDataPacket[]) {
    const expectedDate = convertIsoDateToDisplayDate(new Date(expectedValues[0].plannedOpeningDate))
    await expect(this.tablePlannedOpeningDateHeader).toBeVisible()
    await expect(this.tablePlannedOpeningDateValue).toBeVisible()
    await expect(this.tablePlannedOpeningDateValue).toHaveText(expectedDate)
  }

  async assertActualOpeningDate(expectedValues: RowDataPacket[]) {
    await expect(this.tableActualOpeningDateHeader).toBeVisible()
    await expect(this.tableActualOpeningDateValue).toBeVisible()
    if (expectedValues[0].actualOpeningDate != null) {
      const expectedDate = convertIsoDateToDisplayDate(new Date(expectedValues[0].actualOpeningDate))
      await expect(this.tableActualOpeningDateValue).toHaveText(expectedDate)
    } else {
      await expect(this.tableActualOpeningDateValue).toHaveText('-')
    }
  }

  async assertPlannedClosureDate(expectedValues: RowDataPacket[]) {
    const expectedDate = convertIsoDateToDisplayDate(new Date(expectedValues[0].plannedClosureDate))
    await expect(this.tablePlannedClosureDateHeader).toBeVisible()
    await expect(this.tablePlannedClosureDateValue).toBeVisible()
    await expect(this.tablePlannedClosureDateValue).toHaveText(expectedDate)
  }

  async assertActualClosureDate(expectedValues: RowDataPacket[]) {
    await expect(this.tableActualClosureDateHeader).toBeVisible()
    await expect(this.tableActualClosureDateValue).toBeVisible()
    if (expectedValues[0].actualClosureDate != null) {
      const expectedDate = convertIsoDateToDisplayDate(new Date(expectedValues[0].actualClosureDate))
      await expect(this.tableActualClosureDateValue).toHaveText(expectedDate)
    } else {
      await expect(this.tableActualClosureDateValue).toHaveText('-')
    }
  }

  async assertNetworkTarget(expectedTarget: number) {
    await expect(this.tableNetworkTargetHeader).toBeVisible()
    await expect(this.tableNetworkTargetValue).toBeVisible()
    if (expectedTarget != null) {
      await expect(this.tableNetworkTargetValue).toHaveText(expectedTarget.toString())
    } else {
      await expect(this.tableNetworkTargetValue).toHaveText('-')
    }
  }

  async assertNetworkTotal(expectedTotal: number) {
    await expect(this.tableNetworkTotalHeader).toBeVisible()
    await expect(this.tableNetworkTotalValue).toBeVisible()
    await expect(this.tableNetworkTotalValue).toHaveText(expectedTotal.toString())
  }

  async assertUkTarget(expectedTarget: number) {
    await expect(this.tableUkTargetHeader).toBeVisible()
    await expect(this.tableUkTargetValue).toBeVisible()
    if (expectedTarget != null) {
      await expect(this.tableUkTargetValue).toHaveText(expectedTarget.toString())
    } else {
      await expect(this.tableUkTargetValue).toHaveText('-')
    }
  }

  async assertUkTotal(expectedTotal: number) {
    await expect(this.tableUkTotalHeader).toBeVisible()
    await expect(this.tableUkTotalValue).toBeVisible()
    await expect(this.tableUkTotalValue).toHaveText(expectedTotal.toString())
  }

  async checkStudyHasNoConcerns(expectedDataIndicators: RowDataPacket[]) {
    expect(expectedDataIndicators).toHaveLength(0)
  }

  async checkStudyHasNullValues(expectedValues: RowDataPacket[]) {
    expect(expectedValues[0].actualOpeningDate).toBeNull()
    expect(expectedValues[0].actualClosureDate).toBeNull()
    expect(expectedValues[0].sampleSize).toBeNull()
  }

  async assertStudyStatusSuspended(expectedStatus: string) {
    expect(expectedStatus).toEqual('Suspended')
  }

  async assertEstimatedReopenDatePresent(expectedValues: RowDataPacket[]) {
    const expectedDate = convertIsoDateToDisplayDate(new Date(expectedValues[0].expectedReopenDate))
    await expect(this.tableEstimatedReopenDateHeader).toBeVisible()
    await expect(this.tableEstimatedReopenDateValue).toBeVisible()
    await expect(this.tableEstimatedReopenDateValue).toHaveText(expectedDate)
  }

  async assertEstimatedReopenDateNotPresent() {
    await expect(this.tableEstimatedReopenDateHeader).not.toBeVisible()
    await expect(this.tableEstimatedReopenDateValue).not.toBeVisible()
  }

  async assertStudyRoute(expectedStatus: string, actualStatus: string) {
    if (expectedStatus.toLowerCase() == 'commercial') {
      expect(actualStatus).toEqual('Commercial')
    } else {
      expect(actualStatus).toEqual('Non-commercial')
    }
  }

  async getSponsorOrgNameFromResultsArray(sqlResults: RowDataPacket[]): Promise<string> {
    let sponsorName: string = ''
    sqlResults.forEach((org) => {
      if (org.organisationRoleId == 1) {
        return org.name
      }
    })
    return sponsorName
  }

  async assertNoAssessmentProvided() {
    await expect(this.noAssessmentValue).toBeVisible()
    await expect(this.noAssessmentValue).toHaveText('This study has not had any assessments provided')
  }

  async assertSponsorAssessmentPresent(index: number) {
    switch (index) {
      case 0:
        await expect(this.firstSponsorAssessmentRow).toBeVisible()
        break
      case 1:
        await expect(this.secondSponsorAssessmentRow).toBeVisible()
        break
      default:
        throw new Error(`${index} is not a valid index`)
    }
  }

  async assertSponsorAssessmentCollapsed(index: number, collapsed: boolean) {
    let sponsorAssessmentLocator: Locator
    switch (index) {
      case 0:
        sponsorAssessmentLocator = this.firstSponsorAssessmentRow
        break
      case 1:
        sponsorAssessmentLocator = this.secondSponsorAssessmentRow
        break
      default:
        throw new Error(`${index} is not a valid index`)
    }
    if (collapsed) {
      await expect(sponsorAssessmentLocator).toHaveAttribute('data-state', 'closed')
    } else {
      await expect(sponsorAssessmentLocator).toHaveAttribute('data-state', 'open')
    }
  }

  async assertSponsorAssessmentDate() {
    await expect(this.firstSponsorAssessmentDate).toBeVisible()
    const todaysDate = convertIsoDateToDisplayDate(new Date())
    await expect(this.firstSponsorAssessmentDate).toHaveText(todaysDate)
  }

  async assertSponsorAssessmentOnOffTrack(option: string) {
    if (option.toLowerCase() == 'on') {
      await expect(this.firstSponsorAssessmentTrack).toContainText('On track')
    } else {
      await expect(this.firstSponsorAssessmentTrack).toContainText('Off track')
    }
  }

  async assertAssessedBy() {
    await expect(this.firstSponsorAssessmentText).toContainText('assessed by sesponsorcontact@test.id.nihr.ac.uk')
  }

  async assertAssessmentHasNoFurtherInfo() {
    await expect(this.firstSponsorAssessmentFurtherInfo).toBeEmpty()
  }

  async assertAssessmentFurtherInfoSelections(assessmentIndex: number, bulletIndex: number, expectedValue: string) {
    switch (assessmentIndex) {
      case 0:
        await expect(this.firstSponsorAssessmentFurtherInfoBullets.nth(bulletIndex)).toHaveText(expectedValue)
        break
      case 1:
        await expect(this.secondSponsorAssessmentFurtherInfoBullets.nth(bulletIndex)).toHaveText(expectedValue)
        break
      default:
        throw new Error(`${assessmentIndex} is not a valid index`)
    }
  }

  async assertAssessmentFurtherInfoText(assessmentIndex: number, expectedValue: string) {
    switch (assessmentIndex) {
      case 0:
        await expect(this.firstSponsorAssessmentFurtherInfoText).toHaveText(expectedValue)
        break
      case 1:
        await expect(this.secondSponsorAssessmentFurtherInfoText).toHaveText(expectedValue)
        break
      default:
        throw new Error(`${assessmentIndex} is not a valid index`)
    }
  }

  async assertDueIndicatorDisplayed(isDisplayed: boolean) {
    if (isDisplayed) {
      await expect(this.dueIndicator).toBeVisible()
      await expect(this.dueIndicatorSupportingText).toBeVisible()
      await expect(this.dueIndicator).toHaveText('Due')
      await expect(this.dueIndicatorSupportingText).toContainText('This study needs a new sponsor assessment.')
    } else {
      await expect(this.dueIndicator).toBeHidden()
      await expect(this.dueIndicatorSupportingText).toBeHidden()
    }
  }
}
