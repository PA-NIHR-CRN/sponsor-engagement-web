# sponsor-engagement-web (invitation-monitor)

This is the location of the Sponsor Engagement invitation-monitor scheduled task.

---

> ## Prerequisites:

1. NodeJs 18.17.1

## Environment Variables

| Variable                | Info                                             |
| ----------------------- | ------------------------------------------------ |
| `AWS_ACCESS_KEY_ID`     | AWS Access Key ID. See SES section below.        |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Access Key ID. See SES section below. |
| `AWS_SESSION_TOKEN`     | AWS Session Token. See SES section below.        |

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

Checking email statuses requires adding AWS credentials to `.env`. These are temporary credentials with a 1 hour expiry. From the AWS account page, click **Command line or programmatic access** and copy over the `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_SESSION_TOKEN` values.
