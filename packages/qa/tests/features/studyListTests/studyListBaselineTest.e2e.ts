import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'

//Add another test file for AC4 and SE-68 (Due Logic)
const testUserId = 6
const startingOrgId = 9
const minStudiesOrgId = 3064

test.beforeAll('Setup Test Users', async () => {
  await seDatabaseReq(`UPDATE UserOrganisation SET organisationId = ${startingOrgId} WHERE userId = ${testUserId}`)
})

test.describe('Baseline Study List Page for Sponsor Contact - @se_22 se_22_baseline', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('As a Sponsor Contact I see Studies assigned to my Organisation - @se_22_baseline_ac1', async ({
    studiesPage,
  }) => {
    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
    })
    await test.step('When I am on the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })
    await test.step('Then I see the expected number of Total Studies found', async () => {
      await studiesPage.assertTotalNumberStudies(`SELECT COUNT(*) AS count FROM StudyOrganisation 
      INNER JOIN Study
      ON StudyOrganisation.studyId = Study.id
      WHERE organisationId = ${startingOrgId} 
      AND StudyOrganisation.isDeleted = false AND Study.isDeleted = false`)
    })
    await test.step('And the studies shown are linked to the Organisation I am a Contact for', async () => {
      await studiesPage.assertStudyOrgs(`SELECT shortTitle FROM Study 
      INNER JOIN StudyOrganisation
      ON StudyOrganisation.studyId = Study.id
      WHERE StudyOrganisation.organisationId = ${startingOrgId} AND StudyOrganisation.isDeleted = false 
      AND Study.isDeleted = false`)
    })
  })

  test('As a Sponsor Contact I see the expected Study List Page Layout - @se_22_baseline_ac2_layout', async ({
    studiesPage,
  }) => {
    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
    })
    await test.step('When I am on the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })
    await test.step('Then there is a label indicating the number of studies due for Assessment', async () => {
      await studiesPage.assertDueLabelPresent()
    })
    await test.step('And there is Introductory Guidance text setting the Context for the SE Tool', async () => {
      await studiesPage.assertIntroGuideTxt()
    })
    await test.step('And I can see an expandible help section titled `Why am I being asked to assess studies?`', async () => {
      await studiesPage.assertExpandibleSectionPresent()
    })
    await test.step('And the section is collapsed by default', async () => {
      await studiesPage.assertExpandibleSectionState('collapsed')
    })
  })

  test('On the Study List Page I can Expand & Collapse the help section - @se_22_baseline_ac2_toggle', async ({
    studiesPage,
  }) => {
    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
    })
    await test.step('When I am on the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })
    await test.step('Then I can see an expandible section titled `Why am I being asked to assess studies?`', async () => {
      await studiesPage.assertExpandibleSectionPresent()
    })
    await test.step('When I click the collapsed help section', async () => {
      await studiesPage.expandCollapseSection.locator('span').click()
    })
    await test.step('Then the section expands', async () => {
      await studiesPage.assertExpandibleSectionState('expanded')
    })
    await test.step('And the expanded section contain the expected information', async () => {
      await studiesPage.assertExpandibleSectionTxt()
    })
    await test.step('When I click the expanded help section', async () => {
      await studiesPage.expandCollapseSection.locator('span').click()
    })
    await test.step('Then the section collapses again', async () => {
      await studiesPage.assertExpandibleSectionState('collapsed')
    })
  })

  test('On the Study List Page I have Pagination Options when Results > 10 - @se_22_baseline_ac5_pagination', async ({
    studiesPage,
  }) => {
    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
    })
    await test.step('When I am on the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })
    await test.step('And the number of studies returned is greater than 10', async () => {
      await studiesPage.assertResultCountGreaterThan(10)
    })
    await test.step('Then I see there are Pagination options available', async () => {
      await studiesPage.assertPaginationPresent(true)
    })
  })

  test('On the Study List Page I can Paginate through the Results - @se_22_baseline_ac5_paginating', async ({
    studiesPage,
  }) => {
    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
    })
    await test.step('When I am on the First page of the Study List', async () => {
      await studiesPage.assertOnStudiesPage()
      await studiesPage.assertCurrentPage('1')
    })
    await test.step('Then I can see the Next option, but not Previous', async () => {
      await studiesPage.assertPrevNextOptions('first')
    })
    await test.step('When I click Next', async () => {
      await studiesPage.paginateNext.click()
    })
    await test.step('Then I am taken to the Second page of the Study List', async () => {
      await studiesPage.assertCurrentPage('2')
    })
    await test.step('And I can see both the Next & Previous options', async () => {
      await studiesPage.assertPrevNextOptions('middle')
    })
    await test.step('When I click Previous', async () => {
      await studiesPage.paginatePrev.click()
    })
    await test.step('Then I am taken back to the First page of the Study List', async () => {
      await studiesPage.assertCurrentPage('1')
    })
    await test.step('When I click the final Page Number in the Pages List', async () => {
      await studiesPage.paginationPageList.locator('li').last().click()
    })
    await test.step('Then I can see the Previous option, but not Next', async () => {
      await studiesPage.assertPrevNextOptions('last')
    })
  })

  test('On the Study List Page I have no Pagination Options when Results < 10 - @se_22_baseline_ac5_no_pagination', async ({
    studiesPage,
  }) => {
    await test.step('Given I have updated the Sponsor Contact Test User`s Organisation', async () => {
      await seDatabaseReq(
        `UPDATE UserOrganisation SET organisationId = ${minStudiesOrgId} WHERE userId = ${testUserId}`
      )
    })
    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
    })
    await test.step('When I am on the Studies Page', async () => {
      await studiesPage.assertOnStudiesPage()
    })
    await test.step('When the number of studies returned is less than 10', async () => {
      await studiesPage.assertResultCountLessThan(10)
    })
    await test.step('Then I see there are no Pagination options available', async () => {
      await studiesPage.assertPaginationPresent(false)
    })
  })

  test('Display Expected Generic Error Message where applicable - @se_22_baseline_generic_error', async ({
    commonItemsPage,
  }) => {
    await test.step('Given I have caused the application to throw an Error', async () => {
      await commonItemsPage.gotoErrorPage()
    })
    await test.step('And I have been be re-directed to the Login Page', async () => {
      await commonItemsPage.assertOnGenericErrorPage()
    })
  })
})
