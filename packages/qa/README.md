# Sponsor Engagement E2E Tests

Written in Typescript, using Playwright with page object model & test steps.

Playwright [Documentation](https://playwright.dev/docs/intro)

## Authors

- [Chris McNeill - PA Consulting](https://github.com/chrismcneill89)
- [Adam Nicolaou-Jones - PA consulting](https://github.com/onlyadam)

## Setup

Install Node on your local machine. e.g. If using a Mac `brew install node`  
Or Download and Install from [here](https://nodejs.org/en/download/)

1. Clone repo to local directory
2. From the projects root folder run the command `npm i` to install Playwright and other dependencies
3. Source environment variables and secrets
4. Check Playwright config (`packages/qa/playwright.config.ts`)

### Environment variables & secrets

You will need to either create a new `.env` file under `packages/qa` or run:
`cp -n .env.example .env` from the `packages/qa` directory

Then populate the variables by retrieving from the following sources:

```text
  # env             # the SE environment you wish to test (currently only supports test)
  E2E_BASE_URL=     # (currently only supports test)

  # db              # creds can be found in https://docs.google.com/document/d/1J9I1b4hb28rd9vl34Oe7XPCeZqk8yVsyG84KJgXS6k0
  SE_TEST_DB_HOST=
  SE_TEST_DB_PASSWORD=

  # se test users   # creds can be found in https://docs.google.com/document/d/1J9I1b4hb28rd9vl34Oe7XPCeZqk8yVsyG84KJgXS6k0
  SPONSOR_CONTACT_PASS=
  SPONSOR_CONTACT_MANAGER_PASS=
  CONTACT_MANAGER_PASS=
  SE_NO_LOCAL_ACCOUNT_PASS=

  # cpms test users # creds can be found in https://docs.google.com/spreadsheets/d/1cNsHznOMg9DDkFJnrHUbgK2EoGFys9Hwy5c9n1rO0I4
  CPMS_NPM_PASS=

  # api
  SE_TEST_API_URL=  # creds can be found in https://eu-west-2.console.aws.amazon.com/secretsmanager/secret?name=crnccd-secret-test-se-app-config&region=eu-west-2
  SE_TEST_API_USERNAME=
  SE_TEST_API_PASSWORD=

  # local test config
  LOCAL_DEV=true              # used for ignoring ci settings
  #ENABLE_ACCESSIBILITY=true  # used for enabling accessibility without commit risk (commented out by default)
```

### Playwright config

All work related to the E2E tests reside in the **packages/qa** folder of the project. Playwright is configured in the `playwright.config.ts` file
it contains global properties, as well as project specific properties inside a **projects** array.

By default the tests run using the **SponsorEngagement** project with the **setup** project always running before it which sets and stores Authentication states for the Test Users.

Note that the presence on `LOCAL_DEV=true` in `.env` allows you to easily override CI specific settings fear of committing changes (see `retries` for example).

## Execute test locally (express)

Confirm you have completed the following:

1. Installed node
2. Run `npm i` from the root directory
3. Retrieved and populated `packages/qa/.env`
4. Checked `packages/qa/playwright.config.ts`
5. Set the directory `cd packages/qa/`

If the above has been completed then simply run:

- `npx playwright test --project=seDefault` - runs all tests and print results to the console.

**Note:** alternatively you can run `npm run test:default`

## Execute test locally (advanced)

### Specify tests to execute

To run tests using tags:

- Run all tests with a given tag, then run:
  `npx playwright test --project=seDefault --grep <tag name>` - example: `npx playwright test --project=seDefault --grep @se_123_ac1`

- Run all tests without a given tag, then run:
  `npx playwright test --project=seDefault --grep-invert <tag name>` - example: `npx playwright test --project=seDefault --grep-invert @wip`

**Note:** you can tag the individual `test()` or the `test.describe()`

To run individual tests or a specific group using flags:

- add the `.only` method on any individual tests blocks - example: `test.only()`

- add the `.only` method on any describe blocks - example: `test.describe.only()`

**Note:** you can also use `skip` in exactly the same way to skip a test or group of tests.

### Execute tests locally with multiple browsers/devices

By default tests run in chromium but there are several pre configured browsers & mobile device set up in `playwright.config.ts` can be used locally.
Each browser or device is called a project and can be specified in the command line before execution by setting the project name like this:
`npx playwright test --project=<projectName>`

The available projects are:

- `npx playwright test --project=seDefault` - uses chromium
- `npx playwright test --project=seFirefox` - uses firefox
- `npx playwright test --project=seSafari` - uses safari (not available on PC devices)
- `npx playwright test --project=seEdge` - uses edge
- `npx playwright test --project=seChrome` - uses chrome
- `npx playwright test --project=seMobileAndroid` - uses chrome (emulated on an android device)
- `npx playwright test --project=seMobileIphone` - uses safari (emulated on an iPhone device)

**Note:** You can also use the `packages/qa/package.json` scripts, running `npm run test:<browser>` & replacing `<browser>` with `[default, firefox, safari, edge, chrome, android, iphone]`.

## Execute accessibility tests locally

Accessibility tests are executed using the [@axe-core/playwright](https://playwright.dev/docs/accessibility-testing) library.

As we don't need to run the accessibility tests with every ci or local run the tests are ignored by default in the `playwright.config.ts` file.
This is done by conditionally looking for `ENABLE_ACCESSIBILITY=true` (not present in GitHub actions) which if not found then ignores all tests in `**/accessibilityTests/**`.
This removes the risk of accidentally committing temporary config changes that might effect the ci execution.

To enabled & execute the accessibility tests simply:

1. Add or uncomment `ENABLE_ACCESSIBILITY=true` in `packages/qa/.env`
2. Run all test as normal with `npx playwright test` or just the accessibility tests with `npx playwright test --project=seDefault --grep "@accessibility"`
3. After remember to comment out or remove `ENABLE_ACCESSIBILITY=true` in `packages/qa/.env`

**Note:** You could also use any of the following to run the accessibility tests:

- Run `npm run test:axe` runs the tests in a sub shell removing the need to manage the env variable
- Add the `.only` method on any individual tests blocks, e.g. `test.only()`
- Sdd the `.only` method on any describe blocks, e.g. `test.describe.only()`

## Execute tests CI (GitHub Actions)

The e2e test Github Actions workflows are found under `./.github/workflows`, currently there are two:

- The workflow to manually run the tests run is configured in `run-e2e-tests.yml`.
- The workflow that runs the tests as part of the deployment pipeline is configured in `deploy.yml`.

### run-e2e-tests.yml (Sponsor Engagement E2E Tests)

This pipeline allows running the e2e tests from the given branch against the currently deployed test environment and has no requirements.

To trigger:

1. Open the [Sponsor Engagement E2E Tests page](https://github.com/PA-NIHR-CRN/sponsor-engagement-web/actions/workflows/run-e2e-tests.yml)
2. Click `Run workflow`
3. Specify a branch
4. Optionally specify a test report
5. Optionally specify a test tag to use
6. Click `Run workflow` and manually approve the workflow

**Note:** You can observe the workflow summary or drill into it to see the live summary and console read out.

### deploy.yml (Deploy Web App)

This pipeline runs the e2e tests from the given branch against the currently deployed test environment and requires that
build, dev and test have all completed successfully before it can start.
It is also required to successfully complete without failures for UAT, OAT & Prod environments to be deployed.

**Warning:** Triggering this workflow will deploy the given branch to lower environments (or higher if manually approved)!

To trigger:

1. Open the [Deploy Web App page](https://github.com/PA-NIHR-CRN/sponsor-engagement-web/actions/workflows/deploy.yml)
2. Click `Run workflow`
3. Specify a branch
4. Click `Run workflow` and manually approve the workflows where required

**Note:** You will be required to manually approve the stages including; DEV, Test & Test E2E for the jobs to begin.

### Download CI execution test reports

Regardless of whether the HTML report is published, each test run will upload the report as an artifact.
This can be accessed in the `Artifacts` section of the completed summary page.

To view it click the artifact link and it will be downloaded as a Zip file

**Note:** The traces section of the report will not work as The Playwright Trace Viewer must be loaded over the http:// or https:// protocols

## ----- GitHub pages --------------------------------------------------------------------------

**Warning: Do not delete `gh-pages` branch from the repo**

When a report is to be published to the GitHub page this will trigger a different Actions workflow  
This workflow is called **pages-build-deployment**  
It is configured to run off the `gh-pages` branch  
This configuration can be seen in the repo [settings](https://github.com/PA-NIHR-CRN/sponsor-engagement-web/settings/pages)
Any change to the `gh-pages` pages branch will trigger the workflow  
If the **Upload test report** input is not false,  
Then the `Download HTML Report Artifact` & `Publish to GH Pages` steps in the `playwright.yml` file are executed  
This pushes the newly generated `test-report` folder to the `gh-pages` branch  
Triggering the **pages-build-deployment** workflow

### GitHub test report

The Test Report summary page will look something like the image shown below  
It shows a collapsible list of each test feature file and any tests it contains  
Tests that have passed will have a Green tick next to them, failing tests have a red cross  
For example the image below shows a test report with 2 feature files named `postAndSearchOrgs` and `postAndSearchTermsets`  
The `postAndSearchOrgs` feature has a single test block called `Search Organisation Endpoint`  
The test block contains 2 tests `Response matches expected JSON Schema & Default Page Size is 10` which has failed  
And `GET Organisation by Name 'test', all Orgs returned contain the word 'test'` which has passed

<img width="996" alt="reportHomePage" src="https://user-images.githubusercontent.com/57842230/199301677-5810df39-82c8-4773-8f9a-192349f24fcd.png">
  
You can filter the results using the tabs at the top of the report to show:

- Only tests that Passed
- Only tests that Failed
- Only tests that are Flaky
- Only tests that were Skipped

<img width="980" alt="reportFails" src="https://user-images.githubusercontent.com/57842230/199304970-185fa311-f4ca-4769-bbf6-cd4cfd68cc54.png">

Clicking a test will take you to the test details page  
Here you can see any errors that have been detected, along with each step in the test  
Console .logs .info .error etc steps are excluded from test steps  
Test failures picked up using Playwrights built in assertions are automatically added to the Errors section, along with the reason for failure  
Along with any Errors that are thrown in the code if a certain condition is/is not met, for example in a try catch block

<img width="988" alt="reportErrorSteps" src="https://user-images.githubusercontent.com/57842230/199369236-83d325fc-d457-4175-9b96-ee73bf64f318.png">
  
The test details page also contains a Traces section with the Call/Network trace for that particular test  
There is also an Attachments section. Any outputs to the console, in the context of that particular test, will be shown here in a `stdout` file  
When writing tests we should log things such as relevant Response Bodies to the console to aid debugging.
  
<img width="997" alt="reportTracesOutput" src="https://user-images.githubusercontent.com/57842230/199370505-a7d9b770-ae9c-4687-9384-2f60cb9ef886.png">
  
Clicking the trace object (the image) takes you into the API call logs relevant to that particular test  
**NOTE THAT THIS ONLY WORKS IF VIEWING THE REPORT OVER HTTP(S), FOR EXAMPLE ON A GITHUB PAGE OR LOCALHOST**  
It shows the requests made and the responses received on the left, and Call, Console, Network & Source tabs on the right  
Clicking on a request or response will show details for it on the right, relevant to the tab selected  
The Call tab shows details such as request duration, request method, parameters and header logs, as shown below

<img width="1669" alt="reportTraceCall" src="https://user-images.githubusercontent.com/57842230/199381854-80a34827-0192-44d0-ba0f-816f11f12f91.png">
  
The Console tab shows anything output to the console for the request/response  
The Source tab shows the line of source code from which the request/response was generated in the test  
The Network tab shows the Response Code, Request Headers, Response Headers and Response Body, in a similar format to Postman  
  
<img width="1658" alt="reportTraceNetwork" src="https://user-images.githubusercontent.com/57842230/199382891-5c8e3f26-928c-46bf-91a5-89657cb5b6f1.png">
  
The Trace View is a useful tool for testers to debug exactly why a test has failed
