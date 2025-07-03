import AxeBuilder from '@axe-core/playwright'
import { test as base } from '@playwright/test'

import CommonItemsPage from '../pages/CommonItemsPage'
import LoginPage from '../pages/LoginPage'
import StudiesPage from '../pages/StudiesPage'
import OrganisationsPage from '../pages/OrganisationsPage'
import StudyDetailsPage from '../pages/StudyDetailsPage'
import StudyUpdatePage from '../pages/StudyUpdatePage'
import AssessmentPage from '../pages/AssessmentPage'
import RequestSupportPage from '../pages/RequestSupportPage'
import OrganisationDetailsPage from '../pages/OrganisationDetailsPage'
import RemoveContactPage from '../pages/RemoveContactPage'
import CreatePasswordPage from '../pages/CreatePasswordPage'
import SignedOutPage from '../pages/SignedOutPage'
import CpmsStudiesPage from '../pages/cpmsStudiesPage'
import ContactManagersPage from '../pages/ContactManagersPage'
import RemoveContactManagersPage from '../pages/RemoveContactManagersPage'

type CustomFixtures = {
  commonItemsPage: CommonItemsPage
  loginPage: LoginPage
  studiesPage: StudiesPage
  organisationsPage: OrganisationsPage
  studyDetailsPage: StudyDetailsPage
  studyUpdatePage: StudyUpdatePage
  assessmentPage: AssessmentPage
  requestSupportPage: RequestSupportPage
  organisationDetailsPage: OrganisationDetailsPage
  removeContactPage: RemoveContactPage
  createPasswordPage: CreatePasswordPage
  signedOutPage: SignedOutPage
  cpmsStudiesPage: CpmsStudiesPage
  contactManagerPage: ContactManagersPage
  removeContactManagersPage: RemoveContactManagersPage
  makeAxeBuilder: () => AxeBuilder
}

export const test = base.extend<CustomFixtures>({
  commonItemsPage: async ({ page }, use) => {
    await use(new CommonItemsPage(page))
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  },

  studiesPage: async ({ page }, use) => {
    await use(new StudiesPage(page))
  },

  organisationsPage: async ({ page }, use) => {
    await use(new OrganisationsPage(page))
  },

  studyDetailsPage: async ({ page }, use) => {
    await use(new StudyDetailsPage(page))
  },

  studyUpdatePage: async ({ page }, use) => {
    await use(new StudyUpdatePage(page))
  },

  assessmentPage: async ({ page }, use) => {
    await use(new AssessmentPage(page))
  },

  requestSupportPage: async ({ page }, use) => {
    await use(new RequestSupportPage(page))
  },

  organisationDetailsPage: async ({ page }, use) => {
    await use(new OrganisationDetailsPage(page))
  },

  removeContactPage: async ({ page }, use) => {
    await use(new RemoveContactPage(page))
  },

  createPasswordPage: async ({ page }, use) => {
    await use(new CreatePasswordPage(page))
  },

  signedOutPage: async ({ page }, use) => {
    await use(new SignedOutPage(page))
  },

  cpmsStudiesPage: async ({ page }, use) => {
    await use(new CpmsStudiesPage(page))
  },

  contactManagerPage: async ({ page }, use) => {
    await use(new ContactManagersPage(page))
  },

  removeContactManagersPage: async ({ page }, use) => {
    await use(new RemoveContactManagersPage(page))
  },

  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () => new AxeBuilder({ page })
    await use(makeAxeBuilder)
  },
})

export { expect } from '@playwright/test'
