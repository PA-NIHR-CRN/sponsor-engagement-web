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

    NEXT_PUBLIC_APP_ENV: 'dev' | 'test' | 'uat' | 'oat' | 'prod' | undefined
    DATABASE_URL: string
  }
}
