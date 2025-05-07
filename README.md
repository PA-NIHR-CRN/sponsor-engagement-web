# sponsor-engagement-web

This is the main Repo for the Sponsor Engagement Web code.

The infrastructure lives over in https://github.com/PA-NIHR-CRN/sponsor-engagement-infrastructure.

An instance of the service is deployed to each of dev/test/uat/oat/prod.

---

## Monorepo

This project employs a monorepo architecture with `turborepo` being used to manage workspaces as well as build the different services that Sponsor Engagement requires to function. The modules are split between the `apps` directory which contains the NextJS web application and scheduled task applications and the `packages` directory which contains shared, reusable libraries which can be used across all existing as well as any future apps.

### Apps

| Name     | Info                              |
| -------- | --------------------------------- |
| `web`    | NextJS web application            |
| `ingest` | CPMS ingest scheduled task        |
| `notify` | Notification email scheduled task |

### Packages

| Name                   | Info                                                                        |
| ---------------------- | --------------------------------------------------------------------------- |
| `auth`                 | Auth service providing IDG integration                                      |
| `configs`              | Shared configuration files (currently only used for Tailwind CSS config)    |
| `database`             | Database service containing prisma schema and client                        |
| `email`                | Email service providing SES integration                                     |
| `eslint-config-custom` | ESLint configuration files                                                  |
| `logger`               | Logger service using pino for structured log output                         |
| `qa`                   | QA package for automated e2e tests using Playwright                         |
| `templates`            | Contains email templates and handles bundling of templates using Handlebars |
| `tsconfig`             | TypeScript configuration files                                              |
| `ui`                   | Reusable GDS React component library                                        |

> ## Prerequisites:

1. NodeJs 18.17.1

## Install locally

1. `npm install` to install dependencies. It is not necessary to perform an install for each app/package individually.

## Run web application (NextJS)

1. From within the `web` app directory, create a `.env.local` file from the `.env.example` and update its values
2. From within the `web` app directory, do `npm run dev` to run the local Next.js server
3. Alternatively, you can run `npm run dev --workspace=web|ingest|notify` to run each of the apps from the root of the repository

## Debugging locally using VS Code

You can debug these applications locally, leveraging VS Code. Here's an example `launch.json` file to enable you to debug each app locally.

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug ingest",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev --workspace=ingest",
      "cwd": "${workspaceFolder}/apps/ingest"
    },
    {
      "name": "Debug notify",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev --workspace=notify",
      "cwd": "${workspaceFolder}/apps/notify"
    },
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev --workspace=web",
      "cwd": "${workspaceFolder}/apps/web"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev --workspace=web",
      "serverReadyAction": {
        "pattern": "- Local:.+(https?://.+)",
        "uriFormat": "%s",
        "action": "debugWithChrome"
      },
      "cwd": "${workspaceFolder}/apps/web"
    }
  ]
}
```

## Global commands

These commands should be run from the repository root.

| Command           | Info                                                                |
| ----------------- | ------------------------------------------------------------------- |
| `npm run dev`     | This will use the turbo CLI to run the dev command for all apps     |
| `npm run build`   | This will use the turbo CLI to run the build command for all apps   |
| `npm run start`   | This will use the turbo CLI to run the start command for all apps   |
| `npm run lint`    | This will use the turbo CLI to run the lint command for all apps    |
| `npm run test`    | This will use the turbo CLI to run the test command for all apps    |
| `npm run test:ci` | This will use the turbo CLI to run the test:ci command for all apps |

## Debugging unit tests

It's useful to be able to debug unit tests. You can do this in VS Code by using the `Jest Runner` plugin. When debugging unit tests in the web application, you'll need to tweak your `jest.config.ts` file and update the following snippet from:

```js
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})
```

to:

```js
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './apps/web',
})
```

## Database

To regenerate the local Prisma client run: `npm run db:generate` from within the `database` package.

### Deploying migrations to the database:

To create and apply a new migration locally

- Set your `DATABASE_URL` environment variable on the command line: `export DATABASE_URL="mysql://<user>@<host>:3306/<database-name>?connection_limit=3&pool_timeout=10"` and then run `npm run migrate:dev`. When prompted, enter a name for the new migration.

To apply existing migrations

- Set your `DATABASE_URL` environment variable on the command line: `export DATABASE_URL="mysql://<user>@<host>:3306/<database-name>?connection_limit=3&pool_timeout=10"` and then run `npm run migrate:deploy`.

To seed your local database with study data, you can run the ingest scheduled task against the CPMS DEV environment.
To seed your local database with Sponsor Engagement reference data, first set your `DATABASE_URL` environment variable on the command line: `export DATABASE_URL="mysql://<user>@<host>:3306/<database-name>?connection_limit=3&pool_timeout=10"` and then run `npm run seed` from with the `database` package.

## Emails

Sending email notifications requires adding AWS credentials to `.env.local`. These are temporary credentials with a 1 hour expiry. From the AWS account page, click **Command line or programmatic access** and copy over the `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_SESSION_TOKEN` values.
