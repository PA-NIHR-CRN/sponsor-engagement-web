// Jest Environment Variables Configuration
// These environment variables are injected into the Jest configuration (jest.config.ts) and are required for successful validation of the environment variable schema in the next.config.js file.

process.env.NEXTAUTH_URL = 'https://mockedurl.nihr.ac.uk'
process.env.NEXTAUTH_SECRET = 'xxx'
process.env.NEXTAUTH_IDLE_TIMEOUT = 600
process.env.NEXTAUTH_SESSION_EXPIRY = 2592000
process.env.AUTH_URL = 'https://mockedurl.nihr.ac.uk'
process.env.AUTH_CLIENT_ID = 'mockedClientId'
process.env.AUTH_CLIENT_SECRET = 'mockedClientSecret'
process.env.AUTH_WELL_KNOWN_URL = 'mockedWellKnownUrl'
process.env.PORT = 3000
process.env.IDG_API_URL = 'https://mockedurl.nihr.ac.uk'
process.env.IDG_API_USERNAME = 'mockedUsername'
process.env.IDG_API_PASSWORD = 'mockedPassword'
process.env.NEXTAUTH_DEBUG = 'enabled'
process.env.NEXT_PUBLIC_APP_ENV = ''
process.env.DATABASE_URL = ''
