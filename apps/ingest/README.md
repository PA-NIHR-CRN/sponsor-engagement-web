# sponsor-engagement-web (ingest)

This is the location of the Sponsor Engagement ingest scheduled task.

An instance of the service is deployed to each of dev/test/uat/oat/prod.

The task is configured to run daily via a cron schedule defined in the `sponsor-engagement-infrastructure` repo. It can also be executed manually/on demand via the `Manually execute scheduled task` GitHub action.

---

> ## Prerequisites:

1. NodeJs 18.17.1

## Environment Variables

| Variable       | Info               |
| -------------- | ------------------ |
| `API_URL`      | CPMS API URL.      |
| `API_USERNAME` | CPMS API Username. |
| `API_PASSWORD` | CPMS API Password. |

## Install locally

1. `npm install` to install dependencies.

## Run locally

1. Create a .env file from the .env.example file
2. Execute `npm run start`

## Build locally

`tsup` is used to create a single distributable file including dependencies. Build configuration is found in `package.json`.

1. Execute `npm run build`
2. Execute `node dist/index.js`

## Info

The ingest task queries the CPMS API and processes studies iteratively in batches of 250. The task also handles soft deletion of studies and their relationships. (Note: organisations are not deleted because it was desired to keep them visible in the application for Contact Managers). During ingestion the `isDueAssessment` flag is set for studies that meet the criteria for being due assessment.
