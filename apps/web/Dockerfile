FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY prisma ./prisma/
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED 1

# BUILD ARGS
# These are required for NextJs SSG (Static site generation)
ARG CONTENTFUL_SPACE_ID
ARG CONTENTFUL_ACCESS_TOKEN
ARG CONTENTFUL_PREVIEW_ACCESS_TOKEN
ARG CONTENTFUL_MANAGEMENT_ACCESS_TOKEN
ARG CONTENTFUL_PREVIEW_MODE
ARG CONTENTFUL_ENVIRONMENT
ARG CONTENTFUL_CACHE_TTL
ARG NEXT_REVALIDATE_TIME
ARG APP_ENV

# The environment variables are assigned directly to the corresponding build arg
ENV CONTENTFUL_SPACE_ID $CONTENTFUL_SPACE_ID
ENV CONTENTFUL_ACCESS_TOKEN $CONTENTFUL_ACCESS_TOKEN
ENV CONTENTFUL_PREVIEW_ACCESS_TOKEN $CONTENTFUL_PREVIEW_ACCESS_TOKEN
ENV CONTENTFUL_MANAGEMENT_ACCESS_TOKEN $CONTENTFUL_MANAGEMENT_ACCESS_TOKEN
ENV CONTENTFUL_PREVIEW_MODE $CONTENTFUL_PREVIEW_MODE
ENV CONTENTFUL_ENVIRONMENT $CONTENTFUL_ENVIRONMENT
ENV CONTENTFUL_CACHE_TTL $CONTENTFUL_CACHE_TTL
ENV NEXT_REVALIDATE_TIME $NEXT_REVALIDATE_TIME
ENV NEXT_PUBLIC_APP_ENV $APP_ENV

RUN npm run build

RUN npx prisma generate

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Disable telemetry during runtime
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# ENVIRONMENT VARIABLES
# These are used at runtime during NextJs SSR (Server side rendering)
ARG CONTENTFUL_SPACE_ID
ARG CONTENTFUL_ACCESS_TOKEN
ARG CONTENTFUL_PREVIEW_ACCESS_TOKEN
ARG CONTENTFUL_MANAGEMENT_ACCESS_TOKEN
ARG CONTENTFUL_PREVIEW_MODE
ARG CONTENTFUL_ENVIRONMENT
ARG CONTENTFUL_CACHE_TTL
ARG NEXT_REVALIDATE_TIME
ARG APP_ENV

ENV CONTENTFUL_SPACE_ID $CONTENTFUL_SPACE_ID
ENV CONTENTFUL_ACCESS_TOKEN $CONTENTFUL_ACCESS_TOKEN
ENV CONTENTFUL_PREVIEW_ACCESS_TOKEN $CONTENTFUL_PREVIEW_ACCESS_TOKEN
ENV CONTENTFUL_MANAGEMENT_ACCESS_TOKEN $CONTENTFUL_MANAGEMENT_ACCESS_TOKEN
ENV CONTENTFUL_PREVIEW_MODE $CONTENTFUL_PREVIEW_MODE
ENV CONTENTFUL_ENVIRONMENT $CONTENTFUL_ENVIRONMENT
ENV CONTENTFUL_CACHE_TTL $CONTENTFUL_CACHE_TTL
ENV NEXT_REVALIDATE_TIME $NEXT_REVALIDATE_TIME
ENV NEXT_PUBLIC_APP_ENV $APP_ENV

# Any variables not required at build time can be inserted via the task definition generation step in the workflow
ENV GTM_ID = ''
ENV DATABASE_URL = ''
ENV CONTENTFUL_WEBHOOK_API_KEY = ''

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]