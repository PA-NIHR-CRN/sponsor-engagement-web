# sponsor-engagement-web

This is the main Repo for the Sponsor Engagement Web code.

The infrastructure lives over in https://github.com/PA-NIHR-CRN/sponsor-engagement-infrastructure

An instance of the service is deployed to each of dev/test/uat/oat/prod.

---

## GitHub Actions

A handful of GitHub Actions workflows are defined. These are described below:

TBC

> ## Prerequisites:

1. NodeJs 18.17.1

## Install locally

1. `npm install` to install dependencies
2. Create a `.env.local` file from the `.env.example` and update its values
3. `nm run dev` to run the local Next.js server

## Environment variables

TBC

## Database

To generate database migrations + rebuild the local Prisma client run: `npm run migrate:dev`.

## Emails

Sending email notifications requires adding AWS credentials to `.env.local`. These are temporary credentials with a 1 hour expiry. From the AWS account page, click **Command line or programmatic access** and copy over the `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_SESSION_TOKEN` values.
