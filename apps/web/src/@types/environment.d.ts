declare namespace NodeJS {
  interface ProcessEnv {
    NEXTAUTH_URL: string
    NEXTAUTH_SECRET: string
    NEXTAUTH_IDLE_TIMEOUT: string
    NEXTAUTH_SESSION_EXPIRY: string
    NEXTAUTH_DEBUG: string
    AUTH_WELL_KNOWN_URL: string
    AUTH_CLIENT_ID: string
    AUTH_CLIENT_SECRET: string
    IDG_API_URL: string
    IDG_API_USERNAME: string
    IDG_API_PASSWORD: string
    APP_ENV: 'dev' | 'test' | 'uat' | 'oat' | 'prod' | undefined
    DATABASE_URL: string
    NEXT_PUBLIC_GTM_ID: string
    CONTENTFUL_SPACE_ID: string
    CONTENTFUL_ACCESS_TOKEN: string
    CONTENTFUL_ENVIRONMENT: string
    CONTENTFUL_BANNER_ENTRY_ID: string
    CONTENTFUL_PREVIEW_MODE: string
    CONTENTFUL_PREVIEW_ACCESS_TOKEN: string
    AWS_SECRET_NAME: string
    AWS_REGION: string
    ODP_ROLE_GROUP_ID: string
    NEXT_PUBLIC_GTM_ID: string
  }
}
