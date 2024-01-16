import { devices, PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  testDir: './tests/features',
  outputDir: './test-results',
  testMatch: /features/,
  testIgnore: '**/apps/**',
  reporter: [
    ['list', { printSteps: true }],
    ['html', { outputFolder: './test-report' }],
  ],
  globalSetup: './hooks/GlobalSetup.ts',
  globalTeardown: './hooks/GlobalTeardown.ts',
  timeout: 30000,
  workers: 1, // to enforce serial execution
  retries: 2,
  projects: [
    // Setup project for Authorization
    {
      name: 'setup',
      testDir: 'tests/authSetup',
      testMatch: 'auth.setup.e2e.ts',
      use: {
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
      name: 'SponsorEngagement',
      dependencies: ['setup'],
      testIgnore: '**/accessibilityTests/**',
      use: {
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
      name: 'SE Firefox',
      dependencies: ['setup'],
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
      name: 'SE Safari',
      dependencies: ['setup'],
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
      name: 'SE Microsoft Edge',
      dependencies: ['setup'],
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
      name: 'SE Google Chrome',
      dependencies: ['setup'],
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
      name: 'SE Mobile Chrome',
      dependencies: ['setup'],
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
      name: 'SE Mobile Safari',
      dependencies: ['setup'],
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
