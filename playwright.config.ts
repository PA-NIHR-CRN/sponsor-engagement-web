import { devices, PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  testDir: './qa/tests/features',
  outputDir: './qa/test-results',
  testMatch: /features/,
  testIgnore: '**/src/**',
  reporter: [
    ['list', { printSteps: true }],
    ['html', { outputFolder: './qa/test-report' }],
  ],
  globalSetup: './qa/hooks/GlobalSetup.ts',
  timeout: 30000,
  // workers: 6, // to enforce parallel workers in Actions Workflow
  retries: 2,
  projects: [
    {
      name: 'FindRecruitFollow',
      testIgnore: '**/accessibilityTests/**',
      use: {
        trace: 'on',
        baseURL: `${process.env.BASE_URL}`,
        headless: true,
        screenshot: 'on',
        storageState: 'qa/utils/cookieAccept.json',
        launchOptions: {
          slowMo: 0,
        },
      },
    },
    {
      name: 'FRF Firefox',
      testIgnore: '**/tests/**',
      use: {
        ...devices['Desktop Firefox'],
        trace: 'on',
        baseURL: `${process.env.BASE_URL}`,
        headless: true,
        screenshot: 'on',
        launchOptions: {
          slowMo: 0,
        },
      },
    },
    {
      name: 'FRF Safari',
      testIgnore: '**/tests/**',
      use: {
        ...devices['Desktop Safari'],
        trace: 'on',
        baseURL: `${process.env.BASE_URL}`,
        headless: true,
        screenshot: 'on',
        launchOptions: {
          slowMo: 0,
        },
      },
    },
    {
      name: 'FRF Microsoft Edge',
      testIgnore: '**/tests/**',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
        trace: 'on',
        baseURL: `${process.env.BASE_URL}`,
        headless: true,
        screenshot: 'on',
        launchOptions: {
          slowMo: 0,
        },
      },
    },
    {
      name: 'FRF Google Chrome',
      testIgnore: '**/tests/**',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        trace: 'on',
        baseURL: `${process.env.BASE_URL}`,
        headless: true,
        screenshot: 'on',
        launchOptions: {
          slowMo: 0,
        },
      },
    },
    {
      name: 'FRF Mobile Chrome',
      testIgnore: '**/tests/**',
      use: {
        ...devices['Pixel 5'],
        trace: 'on',
        baseURL: `${process.env.BASE_URL}`,
        headless: true,
        screenshot: 'on',
        launchOptions: {
          slowMo: 0,
        },
      },
    },
    {
      name: 'FRF Mobile Safari',
      testIgnore: '**/tests/**',
      use: {
        ...devices['iPhone 13'],
        trace: 'on',
        baseURL: `${process.env.BASE_URL}`,
        headless: true,
        screenshot: 'on',
        launchOptions: {
          slowMo: 0,
        },
      },
    },
  ],
}

export default config
