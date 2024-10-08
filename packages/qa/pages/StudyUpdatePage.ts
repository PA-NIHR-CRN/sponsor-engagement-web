import { expect, Locator, Page } from '@playwright/test'
import { RowDataPacket } from 'mysql2'
import { seDatabaseReq, waitForSeDbRequest } from '../utils/DbRequests'

//Declare Page Objects
export default class StudyUpdatePage {
  readonly page: Page
  readonly bannerTitle: Locator
  readonly pageTitle: Locator
  readonly sponsorOrganisation: Locator
  readonly studyTitle: Locator
  readonly guidanceText: Locator

  readonly statusRadioInSetup: Locator
  readonly statusHintInSetup: Locator
  readonly statusRadioOpenRec: Locator
  readonly statusHintOpenRec: Locator
  readonly statusRadioClosedInFollow: Locator
  readonly statusHintClosedInFollow: Locator
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

  //Initialize Page Objects
  constructor(page: Page) {
    this.page = page

    //Locators
    this.bannerTitle = page.locator(
      'h1[class="govuk-heading-m govuk-!-margin-bottom-0 govuk-!-margin-left-4 hidden text-white sm:block"]'
    )
    this.pageTitle = page.locator('h2[class="govuk-heading-l govuk-!-margin-bottom-4"]')

    //Study
    this.sponsorOrganisation = page.locator('.govuk-body-m.mb-0.text-darkGrey')
    this.studyTitle = page.locator('.govuk-heading-m.text-primary')
    this.guidanceText = page.locator('.govuk-inset-text')

    //Form
    this.statusRadioInSetup = page.locator('#status').first()
    this.statusHintInSetup = page.locator('#status-hint').first()
    this.statusRadioOpenRec = page.locator('#status-1')
    this.statusHintOpenRec = page.locator('#status-1-hint')
    this.statusRadioClosedInFollow = page.locator('#status-2')
    this.statusHintClosedInFollow = page.locator('#status-2-hint')
    this.statusRadioClosed = page.locator('#status-3')
    this.statusHintClosed = page.locator('#status-3-hint')
    this.statusRadioWithdrawn = page.locator('#status-4')
    this.statusHintWithdrawn = page.locator('#status-4-hint')
    this.statusRadioSuspended = page.locator('#status-5')
    this.statusHintSuspended = page.locator('#status-5-hint')
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
  }

  //Page Methods
  async goto(studyId: string) {
    await this.page.goto(`studies/${studyId}/edit`)
  }

  async assertOnUpdateStudyPage(studyId: string) {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.bannerTitle).toContainText('Update study data')
    await expect(this.pageTitle).toContainText('Update study data')
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
    await expect(this.statusHintInSetup).toHaveText(`Not yet open to recruitment.`)
    await expect(this.statusRadioOpenRec).toBeVisible()
    await expect(this.statusHintOpenRec).toHaveText(
      `Ready (open) to recruit participants in at least one UK site. Provide an actual opening date below.`
    )
    await expect(this.statusRadioClosedInFollow).toBeVisible()
    await expect(this.statusHintClosedInFollow).toHaveText(
      `Ongoing, (i.e. participants are being treated or observed), but recruitment is complete. Provide an actual closure date below.`
    )
    await expect(this.statusRadioClosed).toBeVisible()
    await expect(this.statusHintClosed).toHaveText(
      `Completed recruitment and any subsequent patient related activities (follow up). Provide an actual closure date below.`
    )
    await expect(this.statusRadioSuspended).toBeVisible()
    await expect(this.statusHintSuspended).toHaveText(
      `Recruitment of participants has halted, but may resume. Provide an estimated re-opening date below.`
    )
    await expect(this.statusRadioWithdrawn).toBeVisible()
    await expect(this.statusHintWithdrawn).toHaveText(
      `Withdrawn during the setup phase and will not be opening to recruitment in the UK.`
    )
  }

  async assertStudyStatus(status: string) {
    if (status in ['In Setup', 'In Setup, Approval Received', 'In Setup, Pending Approval']) {
      await expect(this.statusRadioInSetup).toBeChecked()
    }
    if (status in ['Open to Recruitment', 'Open, With Recruitment']) {
      await expect(this.statusRadioOpenRec).toBeChecked()
    }
    if (status in ['Closed to Recruitment', 'Closed to Recruitment, Follow Up Complete']) {
      await expect(this.statusRadioClosedInFollow).toBeChecked()
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
    await this.furtherInfo.fill(``)
  }

  async assertStudyDatesValidationRequired(dateType: string) {
    await expect(this.updateValidationBanner).toBeVisible()
    await expect(this.updateValidationBanner).toContainText('There is a problem')

    switch (dateType) {
      case 'plannedOpening':
        await expect(this.plannedOpeningInlineError).toBeVisible()
        await expect(this.plannedOpeningInlineError).toHaveText(
          'Error: Planned opening to recruitment date is a mandatory field'
        )
        await expect(this.updateValidationList).toContainText(
          'Planned opening to recruitment date is a mandatory field'
        )
        break
      case 'actualOpening':
        await expect(this.actualOpeningInlineError).toBeVisible()
        await expect(this.actualOpeningInlineError).toHaveText(
          'Error: Actual opening to recruitment date is a mandatory field'
        )
        await expect(this.updateValidationList).toContainText('Actual opening to recruitment date is a mandatory field')
        break
      case 'plannedClosure':
        await expect(this.plannedClosureInlineError).toBeVisible()
        await expect(this.plannedClosureInlineError).toHaveText(
          'Error: Planned closure to recruitment date is a mandatory field'
        )
        await expect(this.updateValidationList).toContainText(
          'Planned closure to recruitment date is a mandatory field'
        )
        break
      case 'actualClosure':
        await expect(this.actualClosureInlineError).toBeVisible()
        await expect(this.actualClosureInlineError).toHaveText(
          'Error: Actual closure to recruitment date is a mandatory field'
        )
        await expect(this.updateValidationList).toContainText('Actual closure to recruitment date is a mandatory field')
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
    let plannedOrActualMessage = ''
    let estimatedReopenMessage = ''

    if (dmy === 'year' && partial === false) {
      plannedOrActualMessage = `Year must include 4 numbers`
      estimatedReopenMessage = plannedOrActualMessage
    } else if ((dmy === 'year' && partial === true) || (dmy !== 'year' && partial === true)) {
      plannedOrActualMessage = `${dateType} to recruitment date must include a ${dmy}`
      estimatedReopenMessage = `${dateType} date must include a ${dmy}`
    } else {
      plannedOrActualMessage = `${dateType} to recruitment date requires a valid ${dmy}`
      estimatedReopenMessage = `${dateType} date requires a valid ${dmy}`
    }

    await expect(this.updateValidationBanner).toBeVisible()
    await expect(this.updateValidationBanner).toContainText('There is a problem')

    switch (dateType) {
      case 'Planned opening':
        const plannedOpeningError = `#plannedOpeningDate-${dmy}-error`
        await expect(this.page.locator(plannedOpeningError)).toBeVisible()
        await expect(this.page.locator(plannedOpeningError)).toHaveText(`Error: ${plannedOrActualMessage}`)
        await expect(this.updateValidationList).toContainText(plannedOrActualMessage)
        break
      case 'Actual opening':
        const actualOpeningError = `#actualOpeningDate-${dmy}-error`
        await expect(this.page.locator(actualOpeningError)).toBeVisible()
        await expect(this.page.locator(actualOpeningError)).toHaveText(`Error: ${plannedOrActualMessage}`)
        await expect(this.updateValidationList).toContainText(plannedOrActualMessage)
        break
      case 'Planned closure':
        const plannedClosureError = `#plannedClosureDate-${dmy}-error`
        await expect(this.page.locator(plannedClosureError)).toBeVisible()
        await expect(this.page.locator(plannedClosureError)).toHaveText(`Error: ${plannedOrActualMessage}`)
        await expect(this.updateValidationList).toContainText(plannedOrActualMessage)
        break
      case 'Actual closure':
        const actualClosureError = `#actualClosureDate-${dmy}-error`
        await expect(this.page.locator(actualClosureError)).toBeVisible()
        await expect(this.page.locator(actualClosureError)).toHaveText(`Error: ${plannedOrActualMessage}`)
        await expect(this.updateValidationList).toContainText(plannedOrActualMessage)
        break
      case 'Estimated reopening':
        const estimatedReopeningError = `#estimatedReopeningDate-${dmy}-error`
        await expect(this.page.locator(estimatedReopeningError)).toBeVisible()
        await expect(this.page.locator(estimatedReopeningError)).toHaveText(`Error: ${estimatedReopenMessage}`)
        await expect(this.updateValidationList).toContainText(estimatedReopenMessage)
        break
      default:
        throw new Error(`${dateType} is not a valid date option`)
    }
  }

  async assertPlannedClosureAfterPlannedOpening() {
    await expect(this.updateValidationBanner).toBeVisible()
    await expect(this.updateValidationBanner).toContainText('There is a problem')
    await expect(this.plannedClosureInlineError).toBeVisible()
    await expect(this.plannedClosureInlineError).toHaveText(
      'Error: Planned closure to recruitment date must be after Planned opening to recruitment date'
    )
    await expect(this.updateValidationList).toContainText(
      'Planned closure to recruitment date must be after Planned opening to recruitment date'
    )
  }

  async assertActualOpeningDateMustBeTodayOrPast() {
    await expect(this.updateValidationBanner).toBeVisible()
    await expect(this.updateValidationBanner).toContainText('There is a problem')
    await expect(this.actualOpeningInlineError).toBeVisible()
    await expect(this.actualOpeningInlineError).toHaveText(
      'Error: Actual opening to recruitment date must be today or in the past'
    )
    await expect(this.updateValidationList).toContainText(
      'Actual opening to recruitment date must be today or in the past'
    )
  }

  async assertActualClosureDateMustBeTodayOrPast() {
    await expect(this.updateValidationBanner).toBeVisible()
    await expect(this.updateValidationBanner).toContainText('There is a problem')
    await expect(this.actualClosureInlineError).toBeVisible()
    await expect(this.actualClosureInlineError).toHaveText(
      'Error: Actual closure to recruitment date must be today or in the past'
    )
    await expect(this.updateValidationList).toContainText(
      'Actual closure to recruitment date must be today or in the past'
    )
  }

  async assertUkTargetValidation() {
    await expect(this.updateValidationBanner).toBeVisible()
    await expect(this.updateValidationBanner).toContainText('There is a problem')
    await expect(this.ukRecruitmentTargetInlineError).toBeVisible()
    await expect(this.ukRecruitmentTargetInlineError).toHaveText(`Error: Enter a valid UK target`)
    await expect(this.updateValidationList).toContainText(`Enter a valid UK target`)
  }

  async assertUnexpectedErrorOccurred() {
    await expect(this.updateValidationBanner).toBeVisible()
    await expect(this.updateValidationBanner).toContainText('There is a problem')
    await expect(this.updateValidationList).toContainText(
      `An unexpected error occurred whilst processing the form, please try again later.`
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
}
