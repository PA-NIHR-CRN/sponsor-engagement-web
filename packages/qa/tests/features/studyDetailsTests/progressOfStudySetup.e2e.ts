import { test } from '../../../hooks/CustomFixtures'

const studies = [
  { name: '44993', cpmsId: 44993 },
  { name: '42855', cpmsId: 42855 },
  { name: '44727', cpmsId: 44727 },
  { name: '44649', cpmsId: 44649 },
  { name: '45210', cpmsId: 45210 },
]

test.describe('Study setup progress investigation', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  for (const study of studies) {
    test(`Check progress state for CPMS ${study.cpmsId}`, async ({ studiesPage }) => {
      await studiesPage.goto()

      await studiesPage.assertOnStudiesPage()

      await studiesPage.enterSearchPhrase(study.cpmsId.toString())

      await studiesPage.assertStudySetupProgressPanelDisplayed()
    })
  }
})
