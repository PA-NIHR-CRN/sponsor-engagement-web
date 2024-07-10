# sponsor-engagement-web (notify)

This is the location of the Sponsor Engagement email notifications scheduled task.

An instance of the service is deployed to each of dev/test/uat/oat/prod.

The task is configured to run every 3 months via a cron schedule defined in the `sponsor-engagement-infrastructure` repo. It can also be executed manually/on demand via the `Manually execute scheduled task` GitHub action.

---

> ## Prerequisites:

1. NodeJs 18.17.1

## Environment Variables

| Variable                | Info                                                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `APP_ENV`               | Specifies the current environment (i.e. dev/test/uat/oat/prod).                                                                      |
| `NOTIFY_ALLOW_LIST`     | Comma separated email address whitelist, if provided emails will only be sent to these addresses. Required on non-prod environments. |
| `NOTIFY_RESEND_DELAY`   | The number of days after which a user can receive a new email. Prevents duplicate emails in case the task needs to be re-run.        |
| `AWS_ACCESS_KEY_ID`     | AWS Access Key ID. See SES section below.                                                                                            |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Access Key ID. See SES section below.                                                                                     |
| `AWS_SESSION_TOKEN`     | AWS Session Token. See SES section below.                                                                                            |

## Install locally

1. `npm install` to install dependencies.

## Run locally

1. Create a .env file from the .env.example file
2. Execute `npm run start`

## Build locally

`tsup` is used to create a single distributable file including dependencies. Build configuration is found in `package.json`.

1. Execute `npm run build`
2. Execute `node dist/index.js`

## SES

Sending email notifications requires adding AWS credentials to `.env.local`. These are temporary credentials with a 1 hour expiry. From the AWS account page, click **Command line or programmatic access** and copy over the `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_SESSION_TOKEN` values.
