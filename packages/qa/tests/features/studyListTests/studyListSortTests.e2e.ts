import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'
import { RowDataPacket } from 'mysql2'

const testUserId = 6
const startingOrgId = 2
let studyListSortedByDueDb: RowDataPacket[]
let studyListSortedByAscDb: RowDataPacket[]
let studyListSortedByDescDb: RowDataPacket[]

test.beforeAll('Setup Test Users', async () => {
  await seDatabaseReq(`UPDATE UserOrganisation SET organisationId = ${startingOrgId} WHERE userId = ${testUserId}`)

  const studyListSortByDue = await seDatabaseReq(`
    SELECT DISTINCT Study.id, Study.cpmsId, Study.shortTitle, Study.isDueAssessment,
    (SELECT createdAt FROM Assessment WHERE Assessment.studyId = Study.id 
    AND Assessment.isDeleted = 0 ORDER BY createdAt desc LIMIT 1) createdAt FROM Study
    INNER JOIN StudyOrganisation ON StudyOrganisation.studyId = Study.id
    WHERE Study.isDeleted = 0
    AND StudyOrganisation.organisationId = ${startingOrgId}
    ORDER BY isDueAssessment desc, Study.id asc;
  `)
  studyListSortedByDueDb = studyListSortByDue

  const studyListSortByAsc = await seDatabaseReq(`
    SELECT DISTINCT Study.id, Study.cpmsId, Study.shortTitle, Study.isDueAssessment,
    (SELECT createdAt FROM Assessment WHERE Assessment.studyId = Study.id 
    AND Assessment.isDeleted = 0 ORDER BY createdAt desc LIMIT 1) createdAt FROM Study
    INNER JOIN StudyOrganisation ON StudyOrganisation.studyId = Study.id
    WHERE Study.isDeleted = 0
    AND StudyOrganisation.organisationId = ${startingOrgId}
    ORDER BY createdAt asc, Study.id asc;
  `)
  studyListSortedByAscDb = studyListSortByAsc

  const studyListSortByDesc = await seDatabaseReq(`
    SELECT DISTINCT Study.id, Study.cpmsId, Study.shortTitle, Study.isDueAssessment,
    (SELECT createdAt FROM Assessment WHERE Assessment.studyId = Study.id 
    AND Assessment.isDeleted = 0 ORDER BY createdAt desc LIMIT 1) createdAt FROM Study
    INNER JOIN StudyOrganisation ON StudyOrganisation.studyId = Study.id
    WHERE Study.isDeleted = 0
    AND StudyOrganisation.organisationId = ${startingOrgId}
    ORDER BY createdAt desc, Study.id asc;
  `)
  studyListSortedByDescDb = studyListSortByDesc
})

test.describe('Sort the Studies List - @se_36', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('As a Sponsor I can see that Study List is Sorted By `Due assessment` by default- @se_36_due_default', async ({
    studiesPage,
  }) => {
    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
      await studiesPage.assertOnStudiesPage()
    })
    await test.step(`And the Sort Section is Present on the page`, async () => {
      await studiesPage.assertSortSectionPresent()
    })
    await test.step(`When the Sort Option of 'Due assessment' is selected by default`, async () => {
      await studiesPage.assertCurrentPage('1')
    })
    await test.step('Then Studies Due an Assessment appear First in the Study List', async () => {
      await studiesPage.assertListBeginsWithDueStudies(studyListSortedByDueDb)
    })
    await test.step('When I Navigate to the Final Page of the Study List', async () => {
      await studiesPage.paginationPageList.locator('li').last().click()
      await studiesPage.assertPrevNextOptions('last')
    })
    await test.step('Then Studies Not Due an Assessment appear Last in the Study List', async () => {
      await studiesPage.assertListEndsWithNonDueStudies(studyListSortedByDueDb)
    })
  })

  test('As a Sponsor can Sort the Study List By `Last Assessment Date (Ascending)` - @se_36_asc', async ({
    studiesPage,
  }) => {
    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
      await studiesPage.assertOnStudiesPage()
    })
    await test.step(`And the Sort Section is Present on the page`, async () => {
      await studiesPage.assertSortSectionPresent()
    })
    await test.step(`When the Sort Option of 'Last Assessment Date (Ascending)' is selected`, async () => {
      await studiesPage.selectSortOption('asc')
      await studiesPage.assertStudyListIsVisible()
    })
    await test.step('Then Studies with No Assessments, and Oldest Last Assessments, appear First in the Study List in Ascending Order', async () => {
      await studiesPage.assertListSortedDateAscending(studyListSortedByAscDb)
    })
  })

  test('As a Sponsor can Sort the Study List By `Last Assessment Date (Descending)` - @se_36_desc', async ({
    studiesPage,
  }) => {
    await test.step('Given I have navigated to the Studies Page', async () => {
      await studiesPage.goto()
      await studiesPage.assertOnStudiesPage()
    })
    await test.step(`And the Sort Section is Present on the page`, async () => {
      await studiesPage.assertSortSectionPresent()
    })
    await test.step(`When the Sort Option of 'Last Assessment Date (Descending)' is selected`, async () => {
      await studiesPage.selectSortOption('desc')
      await studiesPage.assertStudyListIsVisible()
    })
    await test.step('Then Studies with the Newest Last Assessments, appear First in the Study List in Ascending Order', async () => {
      await studiesPage.assertListSortedDateDescending(studyListSortedByDescDb)
    })
  })
})
