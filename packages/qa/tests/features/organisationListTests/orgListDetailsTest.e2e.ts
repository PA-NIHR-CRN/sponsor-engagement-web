import { test } from '../../../hooks/CustomFixtures'

const multiRoleSearchPhrase = 'Mapi SAS'
const multiRoleSearchId = '706'

test.describe('Sponsor Organisation List Page for Contact Managers - @se_14', () => {
  test.use({ storageState: '.auth/contactManager.json' })

  test('As a Contact Manager I can see the expected Organisation List Page Layout - @se_14_ac1_layout', async ({
    organisationsPage,
  }) => {
    await test.step('Given I have navigated to the Organisation List Page', async () => {
      await organisationsPage.goto()
    })
    await test.step('When I am on the Organisation List Page', async () => {
      await organisationsPage.assertOnOrganisationsPage()
    })
    await test.step('Then it will have a Page Title of `Manage sponsor contacts`', async () => {
      await organisationsPage.assertOrganisationsPageTitle()
    })
    await test.step('And it will have Guidance Text explaining the pages Purpose', async () => {
      await organisationsPage.assertOrganisationsGuidanceTxt()
    })
    await test.step('And it will display the Number of Organisations in the SE Tool', async () => {
      await organisationsPage.assertOrgsFoundDisplayed()
    })
    await test.step('And it will display the Orgs in a List titled `Organisation`', async () => {
      await organisationsPage.assertOrgsListDisplayed()
    })
  })

  test('As a Contact Manager I can see that the expected Number of Organisations are available - @se_14_ac1_orgNo', async ({
    organisationsPage,
  }) => {
    await test.step('Given I have navigated to the Organisation List Page', async () => {
      await organisationsPage.goto()
    })
    await test.step('When I am on the Organisation List Page', async () => {
      await organisationsPage.assertOnOrganisationsPage()
    })
    await test.step('Then I see the expected number of Total Active Sponsor,CRO & CTU Organisations in the SE Tool', async () => {
      await organisationsPage.assertTotalNumberOrgs(`SELECT COUNT(DISTINCT Organisation.id) AS count
            FROM Organisation 
            INNER JOIN OrganisationRole ON OrganisationRole.organisationId = Organisation.id
            WHERE Organisation.isDeleted = 0
            AND OrganisationRole.roleId IN (1,3,4);`)
    })
  })

  test('As a Contact Manager I can see High Level Detail for an Organisation on the List - @se_14_ac2_details', async ({
    organisationsPage,
  }) => {
    let orgListItemIndex: number = 0
    let orgIdFromList: string = ''
    await test.step('Given I have navigated to the Organisation List Page', async () => {
      await organisationsPage.goto()
    })
    await test.step('And I am on the Organisation List Page', async () => {
      await organisationsPage.assertOnOrganisationsPage()
    })
    await test.step('When I view an Organisation on the list', async () => {
      orgListItemIndex = await organisationsPage.selectRandomOrgListItemIndex()
      orgIdFromList = await organisationsPage.getOrgIdFromListTitle(orgListItemIndex)
    })
    await test.step('Then I can see the Name and Role matches the Expected Values', async () => {
      await organisationsPage.assertNameAndSingleRole(
        `SELECT Organisation.name AS orgName, SysRefOrganisationRole.name AS roleName FROM Organisation  
                INNER JOIN OrganisationRole ON OrganisationRole.organisationId = Organisation.id
                INNER JOIN SysRefOrganisationRole ON SysRefOrganisationRole.id = OrganisationRole.roleId
                WHERE Organisation.id = ${orgIdFromList} AND Organisation.isDeleted = 0 
                AND OrganisationRole.roleId IN (1,3,4);`,
        orgListItemIndex
      )
    })
  })

  test('As a Contact Manager I can see Mutliple Roles for an Organisation on the List, where applicable - @se_14_ac2_multi_role', async ({
    organisationsPage,
  }) => {
    const debRequest = `SELECT Organisation.name AS orgName, SysRefOrganisationRole.name AS roleName FROM Organisation  
        INNER JOIN OrganisationRole ON OrganisationRole.organisationId = Organisation.id
        INNER JOIN SysRefOrganisationRole ON SysRefOrganisationRole.id = OrganisationRole.roleId
        WHERE Organisation.id = ${multiRoleSearchId} AND Organisation.isDeleted = 0 
        AND OrganisationRole.roleId IN (1,3,4);`

    await test.step('Given I have navigated to the Organisation List Page', async () => {
      await organisationsPage.goto()
      await organisationsPage.assertOnOrganisationsPage()
    })
    await test.step(`And I Enter the Search Phrase: '${multiRoleSearchPhrase}'`, async () => {
      await organisationsPage.enterSearchPhrase(multiRoleSearchPhrase)
    })
    await test.step('And only 1 study is found', async () => {
      await organisationsPage.assertSpecificNumberStudies(1)
    })
    await test.step('When that Organisation has Multiple Roles', async () => {
      await organisationsPage.assertOrgHasMutipleRoleInDb(debRequest)
    })
    await test.step('Then I can see the Name and Roles match the Expected Values', async () => {
      await organisationsPage.assertNameAndMultiRole(debRequest, 0)
    })
  })

  test('As a Contact Manager I have a Manage Button which takes me to Details Page for an Org - @se_14_ac2_manage', async ({
    organisationsPage,
    organisationDetailsPage,
  }) => {
    let orgListItemIndex: number = 0
    let orgIdFromList: string = ''
    await test.step('Given I have navigated to the Organisation List Page', async () => {
      await organisationsPage.goto()
    })
    await test.step('And I am on the Organisation List Page', async () => {
      await organisationsPage.assertOnOrganisationsPage()
    })
    await test.step('When I view an Organisation on the list', async () => {
      orgListItemIndex = await organisationsPage.selectRandomOrgListItemIndex()
      orgIdFromList = await organisationsPage.getOrgIdFromListTitle(orgListItemIndex)
    })
    await test.step('Then the Organisation List Item has a `Manage` button', async () => {
      await organisationsPage.assertManageButtonPresent(orgListItemIndex)
    })
    await test.step('When I click the `Manage` button', async () => {
      await organisationsPage.orgListItemManageButton.nth(orgListItemIndex).click()
    })
    await test.step('Then I am taken to the Details page for that Organisation', async () => {
      await organisationDetailsPage.assertOnOrganisationDetailsPage(orgIdFromList)
    })
    await test.step('When I return to the Org List Page', async () => {
      await organisationsPage.goto()
      await organisationsPage.assertOnOrganisationsPage()
    })
    await test.step('And I click Organisations Title', async () => {
      await organisationsPage.orgListItemNameLink.nth(orgListItemIndex).click()
    })
    await test.step('Then I am taken to the Details page for that Organisation', async () => {
      await organisationDetailsPage.assertOnOrganisationDetailsPage(orgIdFromList)
    })
  })

  test('As a Contact Manager I can Paginate through the Results on the Organisation List Page - @se_14_ac3', async ({
    organisationsPage,
  }) => {
    await test.step('Given I have navigated to the Organisation List Page', async () => {
      await organisationsPage.goto()
    })
    await test.step('And I see there are Pagination options available', async () => {
      await organisationsPage.assertPaginationPresent(true)
    })
    await test.step('When I am on the First page of the Organisation List', async () => {
      await organisationsPage.assertOnOrganisationsPage()
      await organisationsPage.assertCurrentPage('1')
    })
    await test.step('Then I can see the Next option, but not Previous', async () => {
      await organisationsPage.assertPrevNextOptions('first')
    })
    await test.step('When I click Next', async () => {
      await organisationsPage.paginateNext.click()
    })
    await test.step('Then I am taken to the Second page of the Org List', async () => {
      await organisationsPage.assertCurrentPage('2')
    })
    await test.step('And I can see both the Next & Previous options', async () => {
      await organisationsPage.assertPrevNextOptions('middle')
    })
    await test.step('When I click Previous', async () => {
      await organisationsPage.paginatePrev.click()
    })
    await test.step('Then I am taken back to the First page of the Org List', async () => {
      await organisationsPage.assertCurrentPage('1')
    })
    await test.step('When I click the final Page Number in the Pages List', async () => {
      await organisationsPage.paginationPageList.locator('li').last().click()
    })
    await test.step('Then I can see the Previous option, but not Next', async () => {
      await organisationsPage.assertPrevNextOptions('last')
    })
  })
})
