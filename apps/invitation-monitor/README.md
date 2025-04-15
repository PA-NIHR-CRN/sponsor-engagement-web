# sponsor-engagement-web (invitation-monitor)

This is the location of the Sponsor Engagement invitation-monitor scheduled task.

The task is configured to run daily via a cron schedule defined in the `sponsor-engagement-infrastructure` repo. It can also be executed manually/on demand via the `Manually execute scheduled task` GitHub action.

---

> ## Prerequisites:

1. NodeJs 18.17.1

## Environment Variables

| Variable                                | Info                                                                                                                |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `INVITE_EMAIL_DELIVERY_THRESHOLD_HOURS` | Specifies the number of hours to wait after an invitation email is sent, to mark it as failed if no status response |
| `AWS_SDK_LOAD_CONFIG`                   | Set to 1 when using AWS SSO.                                                                                        |
| `FETCH_EMAIL_RETRY_MAX_DELAY_MS`        | Specifies the delay in milliseconds between retry attempts when fetching email status from AWS                      |

## Install locally

1. `npm install` to install dependencies.

## Setting up AWS SSO

To use AWS SDK, you must first authenticate using AWS SSO. This requires AWS CLI to be installed.

1. Execute `aws configure sso` to create a profile. You will be prompted to provide several values. For `sso_start_url` and `sso_region`, navigate to the AWS account page, select an account and click **Access keys** , and copy these values. The rest can be use the default values.

2. Execute `aws sso login --profile <PROFILE_NAME>`

3. Execute `export AWS_PROFILE=<PROFILE_NAME>`

Ensure you have `AWS_SDK_LOAD_CONFIG=1` in your .env file.

## Run locally

1. Create a .env file from the .env.example file
2. Execute `npm run start`

## Build locally

`tsup` is used to create a single distributable file including dependencies. Build configuration is found in `package.json`.

1. Execute `npm run build`
2. Execute `node dist/index.js`

## SES

Fetching email statuses and sending emails requires AWS SSO to be set up. See section above, 'Setting up AWS SSO' for authenticating with AWS SSO.
