import { devices, PlaywrightTestConfig } from '@playwright/test'
import * as dotenv from 'dotenv'

dotenv.config()

const config: PlaywrightTestConfig = {
  testDir: './tests/features',
  outputDir: './test-results',
  testMatch: /features/,
  testIgnore: '**/apps/**',
  reporter: [
    ['list', { printSteps: true }],
    ['html', { outputFolder: './test-report', open: 'never' }],
  ],
  globalSetup: './hooks/GlobalSetup.ts',
  globalTeardown: './hooks/GlobalTeardown.ts',
  timeout: process.env.LOCAL_DEV ? 30000 : 35000, // longer timeout in ci
  workers: 1, // to enforce serial execution
  retries: process.env.LOCAL_DEV ? 0 : 0, // enforce retries only in ci
  projects: [
    // Setup project for Authorization
    {
      name: 'setup',
      testDir: 'tests/authSetup',
      testMatch: 'auth.setup.e2e.ts',
      use: {
        trace: 'on',
        video: 'on',
        baseURL: `${process.env.E2E_BASE_URL}`,
        headless: true,
        screenshot: { mode: 'on', fullPage: true, omitBackground: false },
        javaScriptEnabled: true, // must be enabled for authentication
        launchOptions: {
          slowMo: 0,
        },
      },
    },
    // desktop
    {
      name: 'seDefault',
      dependencies: ['setup'],
      testIgnore: process.env.ENABLE_ACCESSIBILITY ? '' : '**/accessibilityTests/**',
      use: {
        trace: 'on',
        video: 'on',
        baseURL: `${process.env.E2E_BASE_URL}`,
        headless: true,
        screenshot: 'on',
        javaScriptEnabled: process.env.LOCAL_DEV ? true : true, // allows testing with JS disabled (default = true)
        launchOptions: {
          slowMo: 0,
        },
      },
    },
    {
      name: 'seFirefox',
      dependencies: ['setup'],
      testIgnore: process.env.ENABLE_ACCESSIBILITY ? '' : '**/accessibilityTests/**',
      use: {
        ...devices['Desktop Firefox'],
        trace: 'on',
        baseURL: `${process.env.E2E_BASE_URL}`,
        headless: true,
        screenshot: 'on',
        launchOptions: {
          slowMo: 0,
        },
      },
    },
    {
      name: 'seSafari',
      dependencies: ['setup'],
      testIgnore: process.env.ENABLE_ACCESSIBILITY ? '' : '**/accessibilityTests/**',
      use: {
        ...devices['Desktop Safari'],
        trace: 'on',
        baseURL: `${process.env.E2E_BASE_URL}`,
        headless: true,
        screenshot: 'on',
        launchOptions: {
          slowMo: 0,
        },
      },
    },
    {
      name: 'seEdge',
      dependencies: ['setup'],
      testIgnore: process.env.ENABLE_ACCESSIBILITY ? '' : '**/accessibilityTests/**',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
        trace: 'on',
        baseURL: `${process.env.E2E_BASE_URL}`,
        headless: true,
        screenshot: 'on',
        launchOptions: {
          slowMo: 0,
        },
      },
    },
    {
      name: 'seChrome',
      dependencies: ['setup'],
      testIgnore: process.env.ENABLE_ACCESSIBILITY ? '' : '**/accessibilityTests/**',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        trace: 'on',
        baseURL: `${process.env.E2E_BASE_URL}`,
        headless: true,
        screenshot: 'on',
        launchOptions: {
          slowMo: 0,
        },
      },
    },
    // mobile
    {
      name: 'seMobileAndroid',
      dependencies: ['setup'],
      testIgnore: process.env.ENABLE_ACCESSIBILITY ? '' : '**/accessibilityTests/**',
      use: {
        ...devices['Pixel 5'],
        trace: 'on',
        baseURL: `${process.env.E2E_BASE_URL}`,
        headless: true,
        screenshot: 'on',
        launchOptions: {
          slowMo: 0,
        },
      },
    },
    {
      name: 'seMobileIphone',
      dependencies: ['setup'],
      testIgnore: process.env.ENABLE_ACCESSIBILITY ? '' : '**/accessibilityTests/**',
      use: {
        ...devices['iPhone 13'],
        trace: 'on',
        baseURL: `${process.env.E2E_BASE_URL}`,
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
