import AxeBuilder from '@axe-core/playwright'
import { test as base } from '@playwright/test'

import CommonItemsPage from '../pages/CommonItemsPage'
import LoginPage from '../pages/LoginPage'
import StudiesPage from '../pages/StudiesPage'
import ContactsPage from '../pages/ContactsPage'

type CustomFixtures = {
  commonItemsPage: CommonItemsPage
  loginPage: LoginPage
  studiesPage: StudiesPage
  contactsPage: ContactsPage

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

  contactsPage: async ({ page }, use) => {
    await use(new ContactsPage(page))
  },

  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () => new AxeBuilder({ page })
    await use(makeAxeBuilder)
  },
})

export { expect } from '@playwright/test'
