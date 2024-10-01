import { expect, Locator, Page } from '@playwright/test'
import { RowDataPacket } from 'mysql2'

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
    this.statusRadioInSetup = page.locator('#status')
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
    this.updateValidationBanner = page.locator('')
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
    if (status in ['Suspended']) {
      await expect(this.statusRadioSuspended).toBeChecked()
    }
    if (status in ['Withdrawn in Pre-Setup', 'Withdrawn During Setup']) {
      await expect(this.statusRadioWithdrawn).toBeChecked()
    }
  }

  async assertStudyDateSelections(status: string) {
    await expect(this.plannedOpeningDD).toBeVisible()
    await expect(this.plannedOpeningMM).toBeVisible()
    await expect(this.plannedOpeningYYYY).toBeVisible()

    await expect(this.actualOpeningDD).toBeVisible()
    await expect(this.actualOpeningMM).toBeVisible()
    await expect(this.actualOpeningYYYY).toBeVisible()

    await expect(this.plannedClosureDD).toBeVisible()
    await expect(this.plannedClosureMM).toBeVisible()
    await expect(this.plannedClosureYYYY).toBeVisible()

    await expect(this.actualClosureDD).toBeVisible()
    await expect(this.actualClosureMM).toBeVisible()
    await expect(this.actualClosureYYYY).toBeVisible()

    // TODO: enable this condition once dev has caught up
    // if (status in ['Withdrawn in Pre-Setup', 'Withdrawn During Setup']) {
    await expect(this.estimatedReopenDD).toBeVisible()
    await expect(this.estimatedReopenMM).toBeVisible()
    await expect(this.estimatedReopenYYYY).toBeVisible()
    // }
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
}
