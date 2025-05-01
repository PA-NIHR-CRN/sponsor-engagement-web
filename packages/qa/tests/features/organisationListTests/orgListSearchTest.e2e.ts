import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'

const nameSearchPhraseSpecific = 'Pfizer Inc.'
const nameSearchSpecificId = '9'
const nameSearchPhraseBroad = 'London'
const sponsorContactTestUserId = 6

test.describe('Search the Organisations List - @se_16 @se_252', () => {
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

  test('As a Contact Manager, I can search for all Organisations a Sponsor Contact is associated to, by searching with their email address - @se_252_ac1', async ({
    organisationsPage,
  }) => {
    const res = await seDatabaseReq(
      `SELECT User.email FROM User 
       WHERE EXISTS (SELECT 1 FROM UserOrganisation WHERE User.id = UserOrganisation.userId and User.isDeleted = 0 and UserOrganisation.isDeleted = 0);`
    )

    const emailSearchTerm = res[0]?.email

    if (!emailSearchTerm) {
      throw new Error('No users associated with any organisations - check test data!')
    }

    await test.step('Given I have navigated to the Organisation List Page', async () => {
      await organisationsPage.goto()
    })

    await test.step('And I am on the Organisation List Page', async () => {
      await organisationsPage.assertOnOrganisationsPage()
    })

    await test.step('And there is a Labelled Search Input', async () => {
      await organisationsPage.assertSearchInputPresent()
    })

    await test.step(`When I Enter the Search Phrase: '${emailSearchTerm}'`, async () => {
      await organisationsPage.enterSearchPhrase(emailSearchTerm)
    })

    await test.step('Then the Expected Number of Organisations are Found', async () => {
      await organisationsPage.assertTotalNumberOrgs(`SELECT COUNT(DISTINCT Organisation.id) AS count FROM Organisation 
            INNER JOIN UserOrganisation ON UserOrganisation.organisationId = Organisation.id
            INNER JOIN User ON User.id = UserOrganisation.userId
            WHERE User.email = '${emailSearchTerm}' AND Organisation.isDeleted = 0 AND UserOrganisation.isDeleted = 0 AND User.isDeleted = 0;`)
    })
  })
})

test.describe('Search for Organisations as a Sponsor Contact - @se_252', () => {
  test.use({ storageState: '.auth/sponsorContact.json' })

  test('As a Sponsor Contact, I can search for all Organisations that I and another Sponsor Contact are associated to, by searching with their email address - @se_252_ac2', async ({
    organisationsPage,
    page,
  }) => {
    const res = await seDatabaseReq(
      `Select User.id, User.email 
        FROM User
        INNER JOIN UserOrganisation on UserOrganisation.userId = User.id
        WHERE UserOrganisation.organisationId in (SELECT organisationId FROM UserOrganisation WHERE userId = ${sponsorContactTestUserId} AND isDeleted = 0)
        AND User.isDeleted = 0 AND UserOrganisation.isDeleted = 0;`
    )

    const emailSearchTerm = res[0]?.email

    if (!emailSearchTerm) {
      throw new Error('No organisations associated with test user and at least one other user - check test data!')
    }

    const selectedUserId = res[0].id

    await test.step('Given I have navigated to the Organisation List Page', async () => {
      await page.goto('/organisations')
    })

    await test.step('And I am on the Organisation List Page', async () => {
      await organisationsPage.assertOnOrganisationsPage()
    })

    await test.step('And there is a Labelled Search Input', async () => {
      await organisationsPage.assertSearchInputPresent()
    })

    await test.step(`When I Enter the Search Phrase: '${emailSearchTerm}'`, async () => {
      await organisationsPage.enterSearchPhrase(emailSearchTerm)
    })

    await test.step('Then the Expected Number of Organisations are Found', async () => {
      await organisationsPage.assertTotalNumberOrgs(`SELECT COUNT(DISTINCT Organisation.id) AS count FROM Organisation 
            INNER JOIN UserOrganisation ON UserOrganisation.organisationId = Organisation.id
            INNER JOIN User ON User.id = UserOrganisation.userId
            WHERE User.id = '${selectedUserId}' OR User.id = '${sponsorContactTestUserId}' AND Organisation.isDeleted = 0 AND UserOrganisation.isDeleted = 0 AND User.isDeleted = 0 GROUP BY organisationId HAVING COUNT(*) > 1;`)
    })
  })
})
