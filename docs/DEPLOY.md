# Deployment of NIHR FRF Web

![Pipeline](https://github.com/PA-NIHR-CRN/frf-web/actions/workflows/frf-fe-build.yml/badge.svg)

This is a [Next.js](https://nextjs.org/) project that utilises Server Side Rendering (SSR) along with Static Site Generation (SSG) and Incremental Static Regeneration (ISR) for automatic cache revalidation.

## GitHub Actions Workflow

We have a GitHub Actions workflow located in `.github/workflows/frf-web-build.yml` that builds, tests, runs code quality checks for every Pull Request.

Merges to `main` branch will trigger a staged deployment workflow in `.github/workflows/frf-web-deploy-all-env.yml`. Deployment to the dev environment is automatic and then subsequent environments (test, uat, oat, prod) require manual confirmation.

## Docker

NextJs SSG (Static site generation) requires environment variables to be available at build time before `npm run build` which means we have to bake in these variables as build args into newly built images for each deployment rather than using run time environment variables.

Build
`docker build --build-arg CONTENTFUL_SPACE_ID=XXX --build-arg CONTENTFUL_ACCESS_TOKEN=XXX --build-arg CONTENTFUL_PREVIEW_ACCESS_TOKEN=XXX --build-arg CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=XXX --build-arg CONTENTFUL_PREVIEW_MODE=XXX --build-arg CONTENTFUL_ENVIRONMENT=XXX --build-arg CONTENTFUL_CACHE_TTL=XXX --build-arg NEXT_REVALIDATE_TIME=XXX --build-arg APP_ENV=XXX . -t frf-web`

Run
`docker run -e DATABASE_URL=XXX -e GTM_ID=xxx -p 3000:3000 frf-web`

## Environments

### Development

The development environment is automatically deployed whenever feature branches are merged into `main` via a [Pull Request](https://github.com/PA-NIHR-CRN/frf-web/pulls).

[Visit Dev →](https://dev.findrecruitandfollowup.nihr.ac.uk/)

### User Acceptance Testing (UAT)

Currently not available.

[Visit UAT →](#)

### Production

Currently not available.

[Visit Production →](#)
