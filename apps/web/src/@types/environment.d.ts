declare namespace NodeJS {
  interface ProcessEnv {
    AUTH_WELL_KNOWN_URL: string
    AUTH_CLIENT_ID: string
    AUTH_CLIENT_SECRET: string
    NEXT_PUBLIC_APP_ENV: 'dev' | 'test' | 'uat' | 'oat' | 'prod' | undefined
    DATABASE_URL: string
    IDG_API_URL: string
    IDG_API_USERNAME: string
    IDG_API_PASSWORD: string
  }
}
