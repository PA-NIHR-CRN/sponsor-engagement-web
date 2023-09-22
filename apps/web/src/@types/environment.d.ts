declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_APP_ENV: 'dev' | 'test' | 'uat' | 'oat' | 'prod'
    DATABASE_URL: string
  }
}
