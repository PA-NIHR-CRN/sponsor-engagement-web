import { test } from '../../../hooks/CustomFixtures'

const nameSearchPhraseSpecific = 'Pfizer Inc.'
const nameSearchSpecificId = '9'
const nameSearchPhraseBroad = 'London'

test.describe('Search the Organisations List - @se_16', () => {
  test.use({ storageState: '.auth/contactManager.json' })

  test('As a Contact Manager I can search for a Specific Org by its Full Name - @se_16_name_specific', async ({
    organisationsPage,
  }) => {
    await test.step('Given I have navigated to the Organisation List Page', async () => {
      await organisationsPage.goto()
    })
    await test.step('And I am on the Organisation List Page', async () => {
      await organisationsPage.assertOnOrganisationsPage()
    })
    await test.step('And there is a Labelled Search Input', async () => {
      await organisationsPage.assertSearchInputPresent()
    })
    await test.step(`When I Enter the Search Phrase: '${nameSearchPhraseSpecific}'`, async () => {
      await organisationsPage.enterSearchPhrase(nameSearchPhraseSpecific)
    })
    await test.step('Then only 1 study is found', async () => {
      await organisationsPage.assertSpecificNumberStudies(1)
    })
    await test.step('And the expected Study Item is displayed on the List', async () => {
      await organisationsPage.assertNameAndSingleRole(
        `SELECT Organisation.name AS orgName, SysRefOrganisationRole.name AS roleName FROM Organisation  
                INNER JOIN OrganisationRole ON OrganisationRole.organisationId = Organisation.id
                INNER JOIN SysRefOrganisationRole ON SysRefOrganisationRole.id = OrganisationRole.roleId
                WHERE Organisation.id = ${nameSearchSpecificId} AND Organisation.isDeleted = 0 
                AND OrganisationRole.roleId IN (1,3,4);`,
        0
      )
    })
  })

  test('As a Contact Manager I can search for all Organisations, that contain my Search Phrase in their Name - @se_16_name_contain', async ({
    organisationsPage,
  }) => {
    await test.step('Given I have navigated to the Organisation List Page', async () => {
      await organisationsPage.goto()
    })
    await test.step('And I am on the Organisation List Page', async () => {
      await organisationsPage.assertOnOrganisationsPage()
    })
    await test.step('And there is a Labelled Search Input', async () => {
      await organisationsPage.assertSearchInputPresent()
    })
    await test.step(`When I Enter the Search Phrase: '${nameSearchPhraseBroad}'`, async () => {
      await organisationsPage.enterSearchPhrase(nameSearchPhraseBroad)
    })
    await test.step('Then the Expected Number of Organisations are Found', async () => {
      await organisationsPage.assertTotalNumberOrgs(`SELECT COUNT(DISTINCT Organisation.id) AS count FROM Organisation 
            INNER JOIN OrganisationRole ON OrganisationRole.organisationId = Organisation.id
            WHERE Organisation.name LIKE '%${nameSearchPhraseBroad}%' AND Organisation.isDeleted = 0
            AND OrganisationRole.roleId IN (1,3,4);`)
    })
  })
})
