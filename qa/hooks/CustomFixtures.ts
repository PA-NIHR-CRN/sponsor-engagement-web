import AxeBuilder from '@axe-core/playwright'
import { test as base } from '@playwright/test'

import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'

type CustomFixtures = {
  homePage: HomePage
  loginPage: LoginPage

  makeAxeBuilder: () => AxeBuilder
}

export const test = base.extend<CustomFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page))
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  },

  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () => new AxeBuilder({ page })
    await use(makeAxeBuilder)
  },
})

export { expect } from '@playwright/test'
