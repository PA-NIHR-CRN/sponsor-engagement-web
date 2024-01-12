# sponsor-engagement-web

This is the main Repo for the Sponsor Engagement Web code.

The infrastructure lives over in https://github.com/PA-NIHR-CRN/sponsor-engagement-infrastructure

An instance of the service is deployed to each of dev/test/uat/oat/prod.

---

## GitHub Actions

A handful of GitHub Actions workflows are defined. These are described below:

TBC

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

Note: global commands can be filtered to specific apps. E.g. `npm run dev -- --filter=web`

## Environment variables

TBC

## Database

To regenerate the local Prisma client run: `npm run db:generate` from within the `database` package.

## Emails

Sending email notifications requires adding AWS credentials to `.env.local`. These are temporary credentials with a 1 hour expiry. From the AWS account page, click **Command line or programmatic access** and copy over the `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_SESSION_TOKEN` values.
