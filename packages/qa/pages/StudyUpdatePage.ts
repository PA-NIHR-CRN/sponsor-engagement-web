import { expect, Locator, Page } from '@playwright/test'
import { RowDataPacket } from 'mysql2'
import { seDatabaseReq, waitForSeDbRequest } from '../utils/DbRequests'

//Declare Page Objects
export default class StudyUpdatePage {
  readonly page: Page
  readonly allStudiesBreadcrumb: Locator
  readonly studyDetailsBreadcrumb: Locator
  readonly bannerTitle: Locator
  readonly pageTitle: Locator
  readonly sponsorOrganisation: Locator
  readonly studyTitle: Locator
  readonly guidanceText: Locator

  readonly statusRadioInSetup: Locator
  readonly statusHintInSetup: Locator
  readonly statusRadioOpenRec: Locator
  readonly statusHintOpenRec: Locator
  readonly statusRadioClosed: Locator
  readonly statusHintClosed: Locator
  readonly statusRadioWithdrawn: Locator
  readonly statusHintWithdrawn: Locator
  readonly statusRadioSuspended: Locator
  readonly statusHintSuspended: Locator
  readonly plannedOpeningDD: Locator
  readonly plannedOpeningMM: Locator
  readonly plannedOpeningYYYY: Locator
  readonly actualOpeningDD: Locator
  readonly actualOpeningMM: Locator
  readonly actualOpeningYYYY: Locator
  readonly plannedClosureDD: Locator
  readonly plannedClosureMM: Locator
  readonly plannedClosureYYYY: Locator
  readonly actualClosureDD: Locator
  readonly actualClosureMM: Locator
  readonly actualClosureYYYY: Locator
  readonly estimatedReopenDD: Locator
  readonly estimatedReopenMM: Locator
  readonly estimatedReopenYYYY: Locator
  readonly ukRecruitmentTarget: Locator
  readonly furtherInfo: Locator
  readonly buttonUpdate: Locator
  readonly buttonNext: Locator
  readonly buttonCancel: Locator
  readonly requestSupport: Locator
  readonly updateSuccessBanner: Locator
  readonly updateSuccessContent: Locator
  readonly updateValidationBanner: Locator
  readonly updateValidationList: Locator
  readonly plannedOpeningInlineError: Locator
  readonly actualOpeningInlineError: Locator
  readonly plannedClosureInlineError: Locator
  readonly actualClosureInlineError: Locator
  readonly estimatedReopenInlineError: Locator
  readonly ukRecruitmentTargetInlineError: Locator
  readonly updatingText: Locator

  //Initialize Page Objects
  constructor(page: Page) {
    this.page = page

    //Locators
    this.bannerTitle = page.locator(
      'h1[class="govuk-heading-m govuk-!-margin-bottom-0 govuk-!-margin-left-4 hidden text-white sm:block"]'
    )
    this.pageTitle = page.locator('h2[class="govuk-heading-l govuk-!-margin-bottom-4"]')
    this.allStudiesBreadcrumb = page.locator('.govuk-breadcrumbs__list > .govuk-breadcrumbs__list-item:nth-child(1)')
    this.studyDetailsBreadcrumb = page.locator('.govuk-breadcrumbs__list > .govuk-breadcrumbs__list-item:nth-child(2)')

    //Study
    this.sponsorOrganisation = page.locator('.govuk-body-m.mb-0.text-darkGrey')
    this.studyTitle = page.locator('.govuk-heading-m.text-primary')
    this.guidanceText = page.locator('.govuk-inset-text')

    //Form
    this.statusRadioInSetup = page.locator('#status').first()
    this.statusHintInSetup = page.locator('#status-hint').first()
    this.statusRadioOpenRec = page.locator('#status-1')
    this.statusHintOpenRec = page.locator('#status-1-hint')
    this.statusRadioClosed = page.locator('#status-2')
    this.statusHintClosed = page.locator('#status-2-hint')
    this.statusRadioWithdrawn = page.locator('#status-3')
    this.statusHintWithdrawn = page.locator('#status-3-hint')
    this.statusRadioSuspended = page.locator('#status-4')
    this.statusHintSuspended = page.locator('#status-4-hint')
    this.plannedOpeningDD = page.locator('#plannedOpeningDate-day')
    this.plannedOpeningMM = page.locator('#plannedOpeningDate-month')
    this.plannedOpeningYYYY = page.locator('#plannedOpeningDate-year')
    this.actualOpeningDD = page.locator('#actualOpeningDate-day')
    this.actualOpeningMM = page.locator('#actualOpeningDate-month')
    this.actualOpeningYYYY = page.locator('#actualOpeningDate-year')
    this.plannedClosureDD = page.locator('#plannedClosureDate-day')
    this.plannedClosureMM = page.locator('#plannedClosureDate-month')
    this.plannedClosureYYYY = page.locator('#plannedClosureDate-year')
    this.actualClosureDD = page.locator('#actualClosureDate-day')
    this.actualClosureMM = page.locator('#actualClosureDate-month')
    this.actualClosureYYYY = page.locator('#actualClosureDate-year')
    this.estimatedReopenDD = page.locator('#estimatedReopeningDate-day')
    this.estimatedReopenMM = page.locator('#estimatedReopeningDate-month')
    this.estimatedReopenYYYY = page.locator('#estimatedReopeningDate-year')
    this.ukRecruitmentTarget = page.locator('#recruitmentTarget')
    this.furtherInfo = page.locator('#furtherInformation')
    this.buttonUpdate = page.locator('button.govuk-button:has-text("Update")')
    this.buttonNext = page.locator('button.govuk-button:has-text("Next")')
    this.buttonCancel = page.locator('.govuk-button.govuk-button--secondary')
    this.requestSupport = page.locator('[data-testid="request-support"]')
    this.updateSuccessBanner = page.locator('.govuk-notification-banner.govuk-notification-banner--success')
    this.updateSuccessContent = page.locator('.govuk-notification-banner__heading')
    this.updateValidationBanner = page.locator('#form-summary-errors')
    this.updateValidationList = page.locator('.govuk-list.govuk-error-summary__list')
    this.plannedOpeningInlineError = page.locator('#plannedOpeningDate-error')
    this.actualOpeningInlineError = page.locator('#actualOpeningDate-error')
    this.plannedClosureInlineError = page.locator('#plannedClosureDate-error')
    this.actualClosureInlineError = page.locator('#actualClosureDate-error')
    this.estimatedReopenInlineError = page.locator('#estimatedReopeningDate-error')
    this.ukRecruitmentTargetInlineError = page.locator('#recruitmentTarget-error')
    this.updatingText = page.locator('.govuk-warning-text__text')
  }

  //Page Methods
  async goto(studyId: string) {
    await this.page.goto(`studies/${studyId}/edit`)
  }

  async assertOnUpdateStudyPage(studyId: string) {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.pageTitle).toContainText('Update United Kingdom study data')
    await expect(this.page).toHaveURL(`studies/${studyId}/edit`)
  }

  async assertSponsorOrg(studySponsors: any) {
    const findSelectedObject = (sponsors: any[]) => {
      const cro = sponsors.find((sponsor) => sponsor.OrganisationRole === 'Contract Research Organisation')
      const ctu = sponsors.find((sponsor) => sponsor.OrganisationRole === 'Managing Clinical Trials Unit')
      const sponsor = sponsors.find((sponsor) => sponsor.OrganisationRole === 'Clinical Research Sponsor ')

      if (cro) {
        return cro.OrganisationName
      } else if (ctu) {
        return ctu.OrganisationName
      } else if (sponsor) {
        return sponsor.OrganisationName
      }
    }

    const expectedSponsor = findSelectedObject(studySponsors)

    await expect(this.sponsorOrganisation).toBeVisible()
    await expect(this.sponsorOrganisation).toHaveText(`Study sponsor: ${expectedSponsor}`)
  }

  async assertStudyTitle(expectedTitle: string) {
    await expect(this.studyTitle).toBeVisible()
    await expect(this.studyTitle).toHaveText(`Study short title: ${expectedTitle}`)
  }

  async assertGuidanceText() {
    await expect(this.guidanceText).toBeVisible()
    await expect(this.guidanceText).toHaveText(
      'Changes to the study status, the key dates and recruitment targets will be communicated to RDN, where possible, your changes will update the study record automatically in CPMS, other changes might be subject to review by the RDN team.'
    )
  }

  async assertStudyStatusSection() {
    await expect(this.statusRadioInSetup).toBeVisible()
    await expect(this.statusHintInSetup).toContainText('Not yet open to recruitment')

    await expect(this.statusRadioOpenRec).toBeVisible()
    await expect(this.statusHintOpenRec).toContainText('Open to recruit participants in at least one UK site')

    await expect(this.statusRadioClosed).toBeVisible()
    await expect(this.statusHintClosed).toContainText(
      'Completed recruitment and any subsequent patient related activities'
    )

    await expect(this.statusRadioSuspended).toBeVisible()
    await expect(this.statusHintSuspended).toContainText('Recruitment of participants has halted')

    await expect(this.statusRadioWithdrawn).toBeVisible()
    await expect(this.statusHintWithdrawn).toContainText('Withdrawn during the setup phase')
  }

  async assertStudyStatus(status: string) {
    if (status in ['In Setup', 'In Setup, Approval Received', 'In Setup, Pending Approval']) {
      await expect(this.statusRadioInSetup).toBeChecked()
    }
    if (status in ['Open to Recruitment', 'Open, With Recruitment']) {
      await expect(this.statusRadioOpenRec).toBeChecked()
    }
    if (status in ['Closed to Recruitment, In Follow Up']) {
      await expect(this.statusRadioClosed).toBeChecked()
    }
    if (status in ['Suspended', 'Suspended (from Open, With Recruitment)', 'Suspended (from Open to Recruitment)']) {
      await expect(this.statusRadioSuspended).toBeChecked()
    }
    if (status in ['Withdrawn in Pre-Setup', 'Withdrawn During Setup']) {
      await expect(this.statusRadioWithdrawn).toBeChecked()
    }
  }

  async assertPlannedOpeningFieldsVisible() {
    await expect(this.plannedOpeningDD).toBeVisible()
    await expect(this.plannedOpeningMM).toBeVisible()
    await expect(this.plannedOpeningYYYY).toBeVisible()
  }
  async assertActualOpeningFieldsVisible() {
    await expect(this.actualOpeningDD).toBeVisible()
    await expect(this.actualOpeningMM).toBeVisible()
    await expect(this.actualOpeningYYYY).toBeVisible()
  }
  async assertPlannedClosureFieldsVisible() {
    await expect(this.plannedClosureDD).toBeVisible()
    await expect(this.plannedClosureMM).toBeVisible()
    await expect(this.plannedClosureYYYY).toBeVisible()
  }
  async assertActualClosureFieldsVisible() {
    await expect(this.actualClosureDD).toBeVisible()
    await expect(this.actualClosureMM).toBeVisible()
    await expect(this.actualClosureYYYY).toBeVisible()
  }
  async assertEstimatedReopeningFieldsVisible() {
    await expect(this.estimatedReopenDD).toBeVisible()
    await expect(this.estimatedReopenMM).toBeVisible()
    await expect(this.estimatedReopenYYYY).toBeVisible()
  }

  async assertStudyDateSelections(status: string) {
    // visible to all statuses
    await this.assertPlannedOpeningFieldsVisible()

    if (
      status in
      [
        'Closed to Recruitment',
        'Closed to Recruitment, Follow Up Complete',
        'Open to Recruitment',
        'Open, With Recruitment',
        'Closed to Recruitment, In Follow Up',
        'Suspended',
      ]
    ) {
      await this.assertActualOpeningFieldsVisible()
    }

    // visible to all statuses
    await this.assertPlannedClosureFieldsVisible()

    if (
      status in
      ['Closed to Recruitment', 'Closed to Recruitment, Follow Up Complete', 'Closed to Recruitment, In Follow Up']
    ) {
      await this.assertActualClosureFieldsVisible()
    }

    if (status in ['Suspended']) {
      await this.assertEstimatedReopeningFieldsVisible()
    }
  }

  async assertRecruitmentTargetInput() {
    await expect(this.ukRecruitmentTarget).toBeVisible()
  }

  async assertFurtherInfoInput() {
    await expect(this.furtherInfo).toBeVisible()
  }

  async assertStudyDate(date: string, dateType: string) {
    if (date) {
      const yyyy = date.substring(0, 4)
      let mm = date.substring(5, 7)
      let dd = date.substring(8, 10)
      mm = parseInt(mm, 10).toString()
      dd = parseInt(dd, 10).toString()

      await expect(this.page.locator(`#${dateType}Date-day`)).toHaveValue(dd)
      await expect(this.page.locator(`#${dateType}Date-month`)).toHaveValue(mm)
      await expect(this.page.locator(`#${dateType}Date-year`)).toHaveValue(yyyy)
    } else {
      await expect(this.page.locator(`#${dateType}Date-day`)).toHaveValue('')
      await expect(this.page.locator(`#${dateType}Date-month`)).toHaveValue('')
      await expect(this.page.locator(`#${dateType}Date-year`)).toHaveValue('')
    }
  }

  async fillStudyDates(dateType: string, dd: string, mm: string, yyyy: string) {
    await this.page.locator(`#${dateType}Date-day`).fill(dd)
    await this.page.locator(`#${dateType}Date-month`).fill(mm)
    await this.page.locator(`#${dateType}Date-year`).fill(yyyy)
  }

  async assertRecruitmentTarget(target: string) {
    await expect(this.ukRecruitmentTarget).toBeVisible()
    if (target === null) {
      await expect(this.ukRecruitmentTarget).toHaveValue('')
    } else {
      const string = target.toString()
      await expect(this.ukRecruitmentTarget).toHaveValue(string)
    }
  }

  async assertFurtherInfo(info: string) {
    await expect(this.ukRecruitmentTarget).toBeVisible()
    await expect(this.ukRecruitmentTarget).toHaveText(info)
  }

  async assertRdnSupport() {
    await expect(this.requestSupport).toBeVisible()
  }

  async assertSeDbUpdateProposed(dbStudyUpdate: RowDataPacket[], timeStamp: string) {
    await expect(dbStudyUpdate.studyStatus).toBeNull()
    await expect(dbStudyUpdate.comment).toBe(`se e2e auto test - ${timeStamp}`)
    await expect(dbStudyUpdate.studyStatusGroup).toBe('Closed')
  }

  async assertSeDbUpdateDirect(dbStudyUpdate: RowDataPacket[], timeStamp: string) {
    await expect(dbStudyUpdate.studyStatus).not.toBeNull()
    await expect(dbStudyUpdate.comment).toBe(`se e2e auto test - ${timeStamp}`)
    await expect(dbStudyUpdate.studyStatusGroup).not.toBeNull()
  }

  async ensureAllFieldsAreNull() {
    await this.statusRadioClosed.click()
    await this.fillStudyDates('plannedOpening', '', '', '')
    await this.fillStudyDates('actualOpening', '', '', '')
    await this.fillStudyDates('plannedClosure', '', '', '')
    await this.fillStudyDates('actualClosure', '', '', '')
    await this.ukRecruitmentTarget.fill('')
  }

  async assertStudyDatesValidationRequired(dateType: string) {
    await expect(this.updateValidationBanner).toBeVisible()
    await expect(this.updateValidationBanner).toContainText('There is a problem')

    switch (dateType) {
      case 'plannedOpening':
        await expect(this.plannedOpeningInlineError).toBeVisible()
        await expect(this.plannedOpeningInlineError).toHaveText(
          'Error: Planned UK opening to recruitment date is a mandatory field'
        )
        await expect(this.updateValidationList).toContainText(
          'Planned UK opening to recruitment date is a mandatory field'
        )
        break
      case 'actualOpening':
        await expect(this.actualOpeningInlineError).toBeVisible()
        await expect(this.actualOpeningInlineError).toHaveText(
          'Error: Actual UK opening to recruitment date is a mandatory field'
        )
        await expect(this.updateValidationList).toContainText(
          'Actual UK opening to recruitment date is a mandatory field'
        )
        break
      case 'plannedClosure':
        await expect(this.plannedClosureInlineError).toBeVisible()
        await expect(this.plannedClosureInlineError).toHaveText(
          'Error: Planned UK closure to recruitment date is a mandatory field'
        )
        await expect(this.updateValidationList).toContainText(
          'Planned UK closure to recruitment date is a mandatory field'
        )
        break
      case 'actualClosure':
        await expect(this.actualClosureInlineError).toBeVisible()
        await expect(this.actualClosureInlineError).toHaveText(
          'Error: Actual UK closure to recruitment date is a mandatory field'
        )
        await expect(this.updateValidationList).toContainText(
          'Actual UK closure to recruitment date is a mandatory field'
        )
        break
      case 'estimatedReopening':
        await expect(this.estimatedReopenInlineError).toBeVisible()
        await expect(this.estimatedReopenInlineError).toHaveText('')
        await expect(this.updateValidationList).toContainText('')
        break
      default:
        throw new Error(`${dateType} is not a valid date option`)
    }
  }

  async assertStudyDatesValidation(dateType: string, dmy: string, partial: boolean) {
    const dateTypeToLabelMapping: Record<string, string> = {
      plannedOpening: 'Planned UK opening',
      actualOpening: 'Actual UK opening',
      actualClosure: 'Actual UK closure',
      plannedClosure: 'Planned UK closure',
      estimatedReopening: 'Estimated UK opening',
    }

    const dateTypeToIdMapping: Record<string, string> = {
      plannedOpening: 'plannedOpeningDate',
      actualOpening: 'actualOpeningDate',
      actualClosure: 'actualClosureDate',
      plannedClosure: 'plannedClosureDate',
      estimatedReopening: 'estimatedReopeningDate',
    }

    const label = dateTypeToLabelMapping[dateType]
    const fieldId = dateTypeToIdMapping[dateType]

    if (!label || !fieldId) {
      throw new Error(`${dateType} is not a valid date option`)
    }

    let message = ''

    if (dmy === 'year' && partial === false) {
      message = 'Year must include 4 numbers'
    } else if (partial === true) {
      if (dateType === 'estimatedReopening') {
        message = `${label} date must include a ${dmy}`
      } else {
        message = `${label} to recruitment date must include a ${dmy}`
      }
    } else {
      if (dateType === 'estimatedReopening') {
        message = `${label} date requires a valid ${dmy}`
      } else {
        message = `${label} to recruitment date requires a valid ${dmy}`
      }
    }

    const input = this.page.locator(`#${fieldId}-${dmy}`)

    await expect(this.updateValidationBanner).toBeVisible()
    await expect(this.updateValidationBanner).toContainText('There is a problem')

    const summaryLink = this.updateValidationList.locator(`a[href="#${fieldId}-${dmy}"]`)

    await expect(summaryLink).toBeVisible()
    await expect(summaryLink).toHaveText(message)

    await expect(input).toBeVisible()
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveClass(/govuk-input--error/)
  }

  async assertPlannedClosureAfterPlannedOpening() {
    await expect(this.updateValidationBanner).toBeVisible()
    await expect(this.updateValidationBanner).toContainText('There is a problem')
    await expect(this.plannedClosureInlineError).toBeVisible()
    await expect(this.plannedClosureInlineError).toHaveText(
      'Error: Planned UK closure to recruitment date must be after Planned UK opening to recruitment date'
    )
    await expect(this.updateValidationList).toContainText(
      'Planned UK closure to recruitment date must be after Planned UK opening to recruitment date'
    )
  }

  async assertActualOpeningDateMustBeTodayOrPast() {
    await expect(this.updateValidationBanner).toBeVisible()
    await expect(this.updateValidationBanner).toContainText('There is a problem')
    await expect(this.actualOpeningInlineError).toBeVisible()
    await expect(this.actualOpeningInlineError).toHaveText(
      'Error: Actual UK opening to recruitment date cannot be in the future'
    )
    await expect(this.updateValidationList).toContainText('Actual UK opening to recruitment date')
  }

  async assertActualClosureDateMustBeTodayOrPast() {
    await expect(this.updateValidationBanner).toBeVisible()
    await expect(this.updateValidationBanner).toContainText('There is a problem')
    await expect(this.actualClosureInlineError).toBeVisible()
    await expect(this.actualClosureInlineError).toHaveText(
      'Error: Actual UK closure to recruitment date cannot be in the future'
    )
    await expect(this.updateValidationList).toContainText(
      'Actual UK closure to recruitment date cannot be in the future'
    )
  }

  async assertUkTargetValidation(error: string) {
    await expect(this.updateValidationBanner).toBeVisible()
    await expect(this.updateValidationBanner).toContainText('There is a problem')
    await expect(this.ukRecruitmentTargetInlineError).toBeVisible()

    switch (error) {
      case 'invalid':
        await expect(this.ukRecruitmentTargetInlineError).toHaveText(`Error: Enter a valid UK target`)
        await expect(this.updateValidationList).toContainText(`Enter a valid UK target`)
        break
      case 'null':
        await expect(this.ukRecruitmentTargetInlineError).toHaveText(`Error: UK target is a mandatory field`)
        await expect(this.updateValidationList).toContainText(`UK target is a mandatory field`)
        break
      default:
        throw new Error(`${error} is not a validation option`)
    }
  }

  async assertUnexpectedErrorOccurred() {
    await expect(this.updateValidationBanner).toBeVisible()
    await expect(this.updateValidationBanner).toContainText('There is a problem')
    await expect(this.updateValidationList).toContainText(
      `Actual UK closure to recruitment date must be after Actual UK opening to recruitment date`
    )
  }

  async submitProposedChange(timeStamp: string) {
    await this.statusRadioClosed.click()
    await this.fillStudyDates('plannedOpening', '12', '06', '2025')
    await this.fillStudyDates('actualOpening', '12', '06', '2024')
    await this.fillStudyDates('plannedClosure', '12', '06', '2027')
    await this.fillStudyDates('actualClosure', '12', '06', '2024')
    await this.ukRecruitmentTarget.fill('101')
    await this.furtherInfo.fill(`se e2e auto test - ${timeStamp}`)
    await this.buttonUpdate.click()
  }

  async assertUpdateSuccess(id: number, timeStamp: string) {
    const dbStudyUpdate = await waitForSeDbRequest(
      `SELECT * FROM sponsorengagement.StudyUpdates WHERE studyId = ${id} ORDER by createdAt LIMIT 1;`
    )

    await this.assertSeDbUpdateProposed(dbStudyUpdate[0], timeStamp)
  }

  async assertUpdatingMessage() {
    await expect(this.updatingText).toBeVisible()
    await expect(this.updatingText).toContainText(
      `It may take a few seconds for the record to update. Please stay on this page until redirected.`
    )
  }
}
