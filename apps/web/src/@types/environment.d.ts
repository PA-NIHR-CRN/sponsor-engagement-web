declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_REVALIDATE_TIME: string
    NEXT_PUBLIC_APP_ENV: 'dev' | 'test' | 'uat' | 'oat' | 'prod'
    GTM_ID: string
  }
}
