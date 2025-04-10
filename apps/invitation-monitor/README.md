# sponsor-engagement-web (invitation-monitor)

This is the location of the Sponsor Engagement invitation-monitor scheduled task.

---

> ## Prerequisites:

1. NodeJs 18.17.1

## Environment Variables

| Variable                                | Info                                                                                                                |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `INVITE_EMAIL_DELIVERY_THRESHOLD_HOURS` | Specifies the number of hours to wait after an invitation email is sent, to mark it as failed if no status response |
| `AWS_SDK_LOAD_CONFIG`                   | Required to use SSO                                                                                                 |

## Install locally

1. `npm install` to install dependencies.

## Run locally

1. Create a .env file from the .env.example file
2. Execute `npm run start`

## Build locally

`tsup` is used to create a single distributable file including dependencies. Build configuration is found in `package.json`.

1. Execute `npm run build`
2. Execute `node dist/index.js`
