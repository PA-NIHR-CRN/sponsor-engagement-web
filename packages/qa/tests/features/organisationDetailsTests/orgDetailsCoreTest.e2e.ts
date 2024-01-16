import { test } from '../../../hooks/CustomFixtures'
import { seDatabaseReq } from '../../../utils/DbRequests'
import { RowDataPacket } from 'mysql2'

const singleRoleorgId = 146
let expectedSingleRoleOrgDetails: RowDataPacket[]
const multiRoleorgId = 706
let expectedMultiRoleOrgDetails: RowDataPacket[]
const orgIdNoContacts = 915
const orgIdWithContacts = 1508
let expectedContactDetails: RowDataPacket[]

test.beforeAll('Setup Test Users', async () => {
  //   await seDatabaseReq(`UPDATE UserOrganisation SET organisationId = ${startingOrgId} WHERE userId = ${testUserId}`)
  const singleRoleOrgDetails = await seDatabaseReq(`
    SELECT Organisation.name AS orgName, Organisation.rtsIdentifier, SysRefOrganisationRole.name AS roleName FROM Organisation 
    INNER JOIN OrganisationRole ON OrganisationRole.organisationId = Organisation.id
    INNER JOIN SysRefOrganisationRole ON SysRefOrganisationRole.id = OrganisationRole.roleId
    WHERE Organisation.id = ${singleRoleorgId}
    AND OrganisationRole.roleId IN (1,3,4);`)
  expectedSingleRoleOrgDetails = singleRoleOrgDetails

  const multiRoleOrgDetails = await seDatabaseReq(`
    SELECT Organisation.name AS orgName, Organisation.rtsIdentifier, SysRefOrganisationRole.name AS roleName FROM Organisation 
    INNER JOIN OrganisationRole ON OrganisationRole.organisationId = Organisation.id
    INNER JOIN SysRefOrganisationRole ON SysRefOrganisationRole.id = OrganisationRole.roleId
    WHERE Organisation.id = ${multiRoleorgId}
    AND OrganisationRole.roleId IN (1,3,4);`)
  expectedMultiRoleOrgDetails = multiRoleOrgDetails

  const contactDetails = await seDatabaseReq(`SELECT User.email, UserOrganisation.updatedAt FROM UserOrganisation
    INNER JOIN User ON User.id = UserOrganisation.userId
    WHERE UserOrganisation.organisationId = ${orgIdWithContacts} AND UserOrganisation.isDeleted = 0
    ORDER BY UserOrganisation.updatedAt desc;`)
  expectedContactDetails = contactDetails
})

test.describe('Display Sponsor Organisation Details and Current Contacts - @se_15', () => {
  test.use({ storageState: '.auth/contactManager.json' })

  test('As a Contact Manager I can see the expected Organisation Details - @se_15_ac1_single', async ({
    organisationDetailsPage,
  }) => {
    await test.step('Given I have navigated to the Organisation Details Page', async () => {
      await organisationDetailsPage.goto(singleRoleorgId.toString())
    })
    await test.step('When I am on the Organisation Details Page', async () => {
      await organisationDetailsPage.assertOnOrganisationDetailsPage(singleRoleorgId.toString())
    })
    await test.step(`Then it will have a Page Title of ${expectedSingleRoleOrgDetails[0].orgName}`, async () => {
      await organisationDetailsPage.assertOrgDetailsPageTitle(expectedSingleRoleOrgDetails[0].orgName)
    })
    await test.step('And the Organisations Role will be the Page Sub Heading', async () => {
      await organisationDetailsPage.assertOrgDetailsSubHeading(expectedSingleRoleOrgDetails)
    })
    await test.step('And it will display the Orgs RTS Identifier and Role in a Table', async () => {
      await organisationDetailsPage.assertOrgDetailsRtsIdRole(expectedSingleRoleOrgDetails)
    })
  })

  test('As a Contact Manager I can see Mutliple Roles for an Organisation on the Details Page, where applicable - @se_15_ac1_multi', async ({
    organisationDetailsPage,
  }) => {
    await test.step('Given I have navigated to the Organisation Details Page', async () => {
      await organisationDetailsPage.goto(multiRoleorgId.toString())
    })
    await test.step('When I am on the Organisation Details Page', async () => {
      await organisationDetailsPage.assertOnOrganisationDetailsPage(multiRoleorgId.toString())
    })
    await test.step(`Then it will have a Page Title of ${expectedMultiRoleOrgDetails[0].orgName}`, async () => {
      await organisationDetailsPage.assertOrgDetailsPageTitle(expectedMultiRoleOrgDetails[0].orgName)
    })
    await test.step('And the Organisations Role will be the Page Sub Heading', async () => {
      await organisationDetailsPage.assertOrgDetailsSubHeading(expectedMultiRoleOrgDetails)
    })
    await test.step('And it will display the Orgs RTS Identifier and Role in a Table', async () => {
      await organisationDetailsPage.assertOrgDetailsRtsIdRole(expectedMultiRoleOrgDetails)
    })
  })

  test('As a Contact Manager I can see the Expected Existing Contacts for an Organisation - @se_15_ac2_contacts', async ({
    organisationDetailsPage,
  }) => {
    await test.step('Given I have navigated to the Organisation Details Page', async () => {
      await organisationDetailsPage.goto(orgIdWithContacts.toString())
    })
    await test.step('And I am on the Organisation Details Page', async () => {
      await organisationDetailsPage.assertOnOrganisationDetailsPage(orgIdWithContacts.toString())
    })
    await test.step(`When I View the section titled 'Add or Remove sponsor contacts'`, async () => {
      await organisationDetailsPage.assertAddRemoveSectionPresent()
    })
    await test.step('Then it will contain some Introductory Guidance Text', async () => {
      await organisationDetailsPage.assertAddRemoveGuidanceTxt()
    })
    await test.step('And it will contain a List of Contacts for that Organisation', async () => {
      await organisationDetailsPage.assertContactListDisplayed(true)
    })
    await test.step('And the expected Number of Contacts for that Org are displayed', async () => {
      await organisationDetailsPage.assertTotalNumberOfContacts(`SELECT COUNT(DISTINCT UserOrganisation.userId) AS count 
            FROM UserOrganisation
            WHERE UserOrganisation.organisationId = ${orgIdWithContacts} AND UserOrganisation.isDeleted = 0;`)
    })
    await test.step('And each Contact displays the correct Email Address', async () => {
      await organisationDetailsPage.assertContactEmail(expectedContactDetails)
    })
    await test.step('And each Contact displays the correct Date Added', async () => {
      await organisationDetailsPage.assertContactDateAdded(expectedContactDetails)
    })
    await test.step('And each Contact displays an Option to Remove', async () => {
      await organisationDetailsPage.assertContactActions()
    })
  })

  test('As a Contact Manager I see the Expected Message When an Organisation has No Contacts - @se_15_ac2_none', async ({
    organisationDetailsPage,
  }) => {
    await test.step('Given I have navigated to the Organisation Details Page', async () => {
      await organisationDetailsPage.goto(orgIdNoContacts.toString())
    })
    await test.step('And I am on the Organisation Details Page', async () => {
      await organisationDetailsPage.assertOnOrganisationDetailsPage(orgIdNoContacts.toString())
    })
    await test.step('And Organisation has No Asscocited Contacts', async () => {
      await organisationDetailsPage.assertOrgHasNoContactsInDB(`SELECT COUNT(DISTINCT UserOrganisation.userId) AS count 
            FROM UserOrganisation
            WHERE UserOrganisation.organisationId = ${orgIdNoContacts} AND UserOrganisation.isDeleted = 0;`)
    })
    await test.step(`When I View the section titled 'Add or Remove sponsor contacts'`, async () => {
      await organisationDetailsPage.assertAddRemoveSectionPresent()
    })
    await test.step('Then it will display a `No contacts associated with this organisation` Message', async () => {
      await organisationDetailsPage.assertContactListDisplayed(false)
    })
  })
})
