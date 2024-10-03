import { RowDataPacket } from 'mysql2'
import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq, waitForSeDbRequest } from '../../../utils/DbRequests'
import { getStudyEngagementInfo } from '../../../utils/ApiRequests'

const testUserId = 6
const startingOrgId = 9
const timeStamp = new Date().toISOString()

let startingStudyId = 0
let studyCoreDetails: RowDataPacket[]

test.beforeAll('Setup Tests', async () => {
  await seDatabaseReq(`UPDATE UserOrganisation SET organisationId = ${startingOrgId} WHERE userId = ${testUserId}`)

  const randomStudyIdSelected = await seDatabaseReq(`
    SELECT Study.id FROM Study 
    INNER JOIN StudyOrganisation ON Study.id = StudyOrganisation.studyId
    WHERE StudyOrganisation.organisationId = ${startingOrgId} AND StudyOrganisation.isDeleted = 0 AND Study.isDeleted = 0
    ORDER BY RAND() LIMIT 1;
  `)
  startingStudyId = randomStudyIdSelected[0].id

  studyCoreDetails = await seDatabaseReq(`
    SELECT cpmsId FROM sponsorengagement.Study where id = ${startingStudyId};
  `)
})

test.describe('Validation rules for auto & proposed study updates @se_183', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('Day validation rules for all dates @se_183_ac1_day', async ({ studyUpdatePage }) => {
    await seDatabaseReq(`
      DELETE FROM sponsorengagement.StudyUpdates WHERE studyId = ${startingStudyId};
    `)

    await test.step(`Given I have navigated to the Update study data page for a Commercial Study with SE Id ${startingStudyId}`, async () => {
      await studyUpdatePage.goto(startingStudyId.toString())
    })

    await test.step(`When I enter all dates with invalid days`, async () => {
      await studyUpdatePage.statusRadioClosed.click()
      await studyUpdatePage.fillStudyDates('plannedOpening', '66', '01', '2024')
      await studyUpdatePage.fillStudyDates('actualOpening', '66', '01', '2024')
      await studyUpdatePage.fillStudyDates('plannedClosure', '66', '01', '2024')
      await studyUpdatePage.fillStudyDates('actualClosure', '66', '01', '2024')
      await studyUpdatePage.ukRecruitmentTarget.fill('')
      await studyUpdatePage.furtherInfo.fill(``)
    })

    await test.step(`And I update my changes`, async () => {
      await studyUpdatePage.buttonUpdate.click()
    })

    await test.step(`Then I should see invalid day messages for all date fields`, async () => {
      const partialDate = false
      await studyUpdatePage.assertStudyDatesValidation('Planned opening', 'day', partialDate)
      await studyUpdatePage.assertStudyDatesValidation('Actual opening', 'day', partialDate)
      await studyUpdatePage.assertStudyDatesValidation('Planned closure', 'day', partialDate)
      await studyUpdatePage.assertStudyDatesValidation('Actual closure', 'day', partialDate)
    })
  })

  test('Month validation rules for all dates @se_183_ac1_month', async ({ studyUpdatePage }) => {
    await seDatabaseReq(`
      DELETE FROM sponsorengagement.StudyUpdates WHERE studyId = ${startingStudyId};
    `)

    await test.step(`Given I have navigated to the Update study data page for a Commercial Study with SE Id ${startingStudyId}`, async () => {
      await studyUpdatePage.goto(startingStudyId.toString())
    })

    await test.step(`When I enter all dates with invalid months`, async () => {
      await studyUpdatePage.statusRadioClosed.click()
      await studyUpdatePage.fillStudyDates('plannedOpening', '01', '13', '2024')
      await studyUpdatePage.fillStudyDates('actualOpening', '02', '24', '2024')
      await studyUpdatePage.fillStudyDates('plannedClosure', '03', '13', '2024')
      await studyUpdatePage.fillStudyDates('actualClosure', '04', '25', '2024')
      await studyUpdatePage.ukRecruitmentTarget.fill('')
      await studyUpdatePage.furtherInfo.fill(``)
    })

    await test.step(`And I update my changes`, async () => {
      await studyUpdatePage.buttonUpdate.click()
    })

    await test.step(`Then I should see invalid month messages for all date fields`, async () => {
      const partialDate = false
      await studyUpdatePage.assertStudyDatesValidation('Planned opening', 'month', partialDate)
      await studyUpdatePage.assertStudyDatesValidation('Actual opening', 'month', partialDate)
      await studyUpdatePage.assertStudyDatesValidation('Planned closure', 'month', partialDate)
      await studyUpdatePage.assertStudyDatesValidation('Actual closure', 'month', partialDate)
    })
  })

  test('Year validation rules for all dates @se_183_ac1_year', async ({ studyUpdatePage }) => {
    await seDatabaseReq(`
      DELETE FROM sponsorengagement.StudyUpdates WHERE studyId = ${startingStudyId};
    `)

    await test.step(`Given I have navigated to the Update study data page for a Commercial Study with SE Id ${startingStudyId}`, async () => {
      await studyUpdatePage.goto(startingStudyId.toString())
    })

    await test.step(`When I enter all dates with invalid years`, async () => {
      await studyUpdatePage.statusRadioClosed.click()
      await studyUpdatePage.fillStudyDates('plannedOpening', '01', '02', '999999')
      await studyUpdatePage.fillStudyDates('actualOpening', '03', '04', '99999')
      await studyUpdatePage.fillStudyDates('plannedClosure', '05', '06', '999')
      await studyUpdatePage.fillStudyDates('actualClosure', '07', '08', '99')
      await studyUpdatePage.ukRecruitmentTarget.fill('')
      await studyUpdatePage.furtherInfo.fill(``)
    })

    await test.step(`And I update my changes`, async () => {
      await studyUpdatePage.buttonUpdate.click()
    })

    await test.step(`Then I should see invalid year messages for all date fields`, async () => {
      const partialDate = false
      await studyUpdatePage.assertStudyDatesValidation('Planned opening', 'year', partialDate)
      await studyUpdatePage.assertStudyDatesValidation('Actual opening', 'year', partialDate)
      await studyUpdatePage.assertStudyDatesValidation('Planned closure', 'year', partialDate)
      await studyUpdatePage.assertStudyDatesValidation('Actual closure', 'year', partialDate)
    })
  })

  test('Partially complete date validation rules for all dates @se_183_ac1_partialDates', async ({
    studyUpdatePage,
  }) => {
    await seDatabaseReq(`
      DELETE FROM sponsorengagement.StudyUpdates WHERE studyId = ${startingStudyId};
    `)

    await test.step(`Given I have navigated to the Update study data page for a Commercial Study with SE Id ${startingStudyId}`, async () => {
      await studyUpdatePage.goto(startingStudyId.toString())
    })

    await test.step(`When I enter partially complete dates`, async () => {
      await studyUpdatePage.statusRadioClosed.click()
      await studyUpdatePage.fillStudyDates('plannedOpening', '', '02', '2024')
      await studyUpdatePage.fillStudyDates('actualOpening', '01', '', '2024')
      await studyUpdatePage.fillStudyDates('plannedClosure', '01', '02', '')
      await studyUpdatePage.ukRecruitmentTarget.fill('')
      await studyUpdatePage.furtherInfo.fill(``)
    })

    await test.step(`And I update my changes`, async () => {
      await studyUpdatePage.buttonUpdate.click()
    })

    await test.step(`Then I should see must must include day, month or year messages for date fields`, async () => {
      const partialDate = true
      await studyUpdatePage.assertStudyDatesValidation('Planned opening', 'day', partialDate)
      await studyUpdatePage.assertStudyDatesValidation('Actual opening', 'month', partialDate)
      await studyUpdatePage.assertStudyDatesValidation('Planned closure', 'year', partialDate)
    })
  })

  test('29th February in non leap years @se_183_ac1_feb29', async ({ studyUpdatePage }) => {
    await seDatabaseReq(`
      DELETE FROM sponsorengagement.StudyUpdates WHERE studyId = ${startingStudyId};
    `)

    await test.step(`Given I have navigated to the Update study data page for a Commercial Study with SE Id ${startingStudyId}`, async () => {
      await studyUpdatePage.goto(startingStudyId.toString())
    })

    await test.step(`When I enter the 29th February in a non leap year for all dates`, async () => {
      await studyUpdatePage.statusRadioClosed.click()
      await studyUpdatePage.fillStudyDates('plannedOpening', '29', '02', '2023')
      await studyUpdatePage.fillStudyDates('actualOpening', '29', '02', '2023')
      await studyUpdatePage.fillStudyDates('plannedClosure', '29', '02', '2023')
      await studyUpdatePage.fillStudyDates('actualClosure', '29', '02', '2023')
      await studyUpdatePage.ukRecruitmentTarget.fill('')
      await studyUpdatePage.furtherInfo.fill(``)
    })

    await test.step(`And I update my changes`, async () => {
      await studyUpdatePage.buttonUpdate.click()
    })

    await test.step(`Then I should see invalid day messages for all date fields`, async () => {
      const partialDate = false
      await studyUpdatePage.assertStudyDatesValidation('Planned opening', 'day', partialDate)
      await studyUpdatePage.assertStudyDatesValidation('Actual opening', 'day', partialDate)
      await studyUpdatePage.assertStudyDatesValidation('Planned closure', 'day', partialDate)
      await studyUpdatePage.assertStudyDatesValidation('Actual closure', 'day', partialDate)
    })
  })

  test('Null validation rules for all dates @se_183_ac3', async ({ studyUpdatePage }) => {
    await seDatabaseReq(`
      DELETE FROM sponsorengagement.StudyUpdates WHERE studyId = ${startingStudyId};
    `)

    await test.step(`Given I have navigated to the Update study data page for a Commercial Study with SE Id ${startingStudyId}`, async () => {
      await studyUpdatePage.goto(startingStudyId.toString())
    })

    await test.step(`When I leave all fields empty`, async () => {
      await studyUpdatePage.ensureAllFieldsAreNull()
    })

    await test.step(`And I update my changes`, async () => {
      await studyUpdatePage.buttonUpdate.click()
    })

    await test.step(`Then I should see validation messages for all required fields`, async () => {
      await studyUpdatePage.assertStudyDatesValidationRequired('plannedOpening')
      await studyUpdatePage.assertStudyDatesValidationRequired('actualOpening')
      await studyUpdatePage.assertStudyDatesValidationRequired('plannedClosure')
      await studyUpdatePage.assertStudyDatesValidationRequired('actualClosure')
    })
  })

  test('Invalid UK target validation rule @se_183_ac4', async ({ studyUpdatePage }) => {
    await seDatabaseReq(`
      DELETE FROM sponsorengagement.StudyUpdates WHERE studyId = ${startingStudyId};
    `)

    await test.step(`Given I have navigated to the Update study data page for a Commercial Study with SE Id ${startingStudyId}`, async () => {
      await studyUpdatePage.goto(startingStudyId.toString())
    })

    await test.step(`When I enter an invalid UK recruitment target`, async () => {
      await studyUpdatePage.ensureAllFieldsAreNull()
      await studyUpdatePage.ukRecruitmentTarget.fill('99999991')
    })

    await test.step(`And I update my changes`, async () => {
      await studyUpdatePage.buttonUpdate.click()
    })

    await test.step(`Then I should see validation messages invalid UK recruitment target`, async () => {
      await studyUpdatePage.assertUkTargetValidation()
    })
  })

  test('Planned closure to recruitment date must be after Planned opening to recruitment date @se_183_ac2', async ({
    studyUpdatePage,
  }) => {
    await seDatabaseReq(`
      DELETE FROM sponsorengagement.StudyUpdates WHERE studyId = ${startingStudyId};
    `)

    await test.step(`Given I have navigated to the Update study data page for a Commercial Study with SE Id ${startingStudyId}`, async () => {
      await studyUpdatePage.goto(startingStudyId.toString())
    })

    await test.step(`When I enter a Planned closure to recruitment date before the Planned opening date`, async () => {
      await studyUpdatePage.statusRadioClosed.click()
      await studyUpdatePage.fillStudyDates('plannedOpening', '1', '1', '2024')
      await studyUpdatePage.fillStudyDates('actualOpening', '2', '2', '2024')
      await studyUpdatePage.fillStudyDates('plannedClosure', '2', '2', '2023')
      await studyUpdatePage.fillStudyDates('actualClosure', '2', '2', '2024')
      await studyUpdatePage.ukRecruitmentTarget.fill('')
      await studyUpdatePage.furtherInfo.fill(``)
    })

    await test.step(`And I update my changes`, async () => {
      await studyUpdatePage.buttonUpdate.click()
    })

    await test.step(`Then I should see the Planned closure date must be after Planned opening date validation`, async () => {
      await studyUpdatePage.assertPlannedClosureAfterPlannedOpening()
    })
  })

  test('Actual opening to recruitment date must be today or in the past @se_183_ac2', async ({ studyUpdatePage }) => {
    await seDatabaseReq(`
      DELETE FROM sponsorengagement.StudyUpdates WHERE studyId = ${startingStudyId};
    `)

    await test.step(`Given I have navigated to the Update study data page for a Commercial Study with SE Id ${startingStudyId}`, async () => {
      await studyUpdatePage.goto(startingStudyId.toString())
    })

    await test.step(`When I enter a Actual opening to recruitment date in the future`, async () => {
      await studyUpdatePage.statusRadioClosed.click()
      await studyUpdatePage.fillStudyDates('plannedOpening', '1', '1', '2024')
      await studyUpdatePage.fillStudyDates('actualOpening', '2', '2', '2027')
      await studyUpdatePage.fillStudyDates('plannedClosure', '1', '1', '2027')
      await studyUpdatePage.fillStudyDates('actualClosure', '1', '1', '2024')
      await studyUpdatePage.ukRecruitmentTarget.fill('')
      await studyUpdatePage.furtherInfo.fill(``)
    })

    await test.step(`And I update my changes`, async () => {
      await studyUpdatePage.buttonUpdate.click()
    })

    await test.step(`Then I should see the Actual opening to recruitment date must be today or in the past date validation`, async () => {
      await studyUpdatePage.assertActualOpeningDateMustBeTodayOrPast()
    })
  })

  test('Actual closure to recruitment date must be today or in the past @se_183_ac2', async ({ studyUpdatePage }) => {
    await seDatabaseReq(`
      DELETE FROM sponsorengagement.StudyUpdates WHERE studyId = ${startingStudyId};
    `)

    await test.step(`Given I have navigated to the Update study data page for a Commercial Study with SE Id ${startingStudyId}`, async () => {
      await studyUpdatePage.goto(startingStudyId.toString())
    })

    await test.step(`When I enter a Actual closure to recruitment date in the future`, async () => {
      await studyUpdatePage.statusRadioClosed.click()
      await studyUpdatePage.fillStudyDates('plannedOpening', '1', '1', '2024')
      await studyUpdatePage.fillStudyDates('actualOpening', '2', '2', '2024')
      await studyUpdatePage.fillStudyDates('plannedClosure', '1', '1', '2027')
      await studyUpdatePage.fillStudyDates('actualClosure', '1', '1', '2027')
      await studyUpdatePage.ukRecruitmentTarget.fill('')
      await studyUpdatePage.furtherInfo.fill(``)
    })

    await test.step(`And I update my changes`, async () => {
      await studyUpdatePage.buttonUpdate.click()
    })

    await test.step(`Then I should see the Actual closure to recruitment date must be today or in the past date validation`, async () => {
      await studyUpdatePage.assertActualClosureDateMustBeTodayOrPast()
    })
  })
})
