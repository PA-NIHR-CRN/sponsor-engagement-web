# Deployment of NIHR SE Web App

![Pipeline](https://github.com/PA-NIHR-CRN/sponsor-engagement-web/actions/workflows/deploy.yml/badge.svg)

This is a [Next.js](https://nextjs.org/) project that utilises Server Side Rendering (SSR)

## GitHub Actions Workflow

We have a GitHub Actions workflow located in `.github/workflows/pull-request.yml` that builds, tests, runs code quality checks for every Pull Request.

Merges to `main` branch will trigger a staged deployment workflow in `.github/workflows/deploy.yml`. Deployment to the dev environment is automatic and then subsequent environments (test, uat, oat, prod) require manual confirmation.

## Docker

NextJs SSG (Static site generation) requires environment variables to be available at build time before `npm run build` which means we have to bake in these variables as build args into newly built images for each deployment rather than using run time environment variables.

Build

# TODO

Run

# TODO

## Environments

[Visit Dev →](https://dev.assessmystudy.nihr.ac.uk/)
[Visit Test →](https://test.assessmystudy.nihr.ac.uk/)
[Visit UAT →](https://uat.assessmystudy.nihr.ac.uk/)
[Visit OAT →](https://oat.assessmystudy.nihr.ac.uk/)
[Visit Prod →](https://assessmystudy.nihr.ac.uk/)
