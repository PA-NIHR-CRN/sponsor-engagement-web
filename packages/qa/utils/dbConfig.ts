import mysql, { ConnectionOptions } from 'mysql2'

// export const cpmsDbConfig = {
//   user: 'cpmsuser',
//   password: `${process.env.CPMS_TEST_DB_PASSWORD}`, //set in .github/workflows/playwright.yml using GitHub secrets, hardcode when running locally
//   server: `${process.env.CPMS_TEST_DB_SERVER}`, //set in .github/workflows/playwright.yml using GitHub secrets, hardcode when running locally
//   database: 'NIHR.CRN.CPMS.OperationalDatabase',
//   options: {
//     encrypt: false,
//     trustServerCertificate: false,
//   },
// }

const seDbConfig: ConnectionOptions = {
  host: `${process.env.SE_TEST_DB_HOST}`, //set in .github/workflows/playwright.yml using GitHub secrets, hardcode when running locally
  user: 'admin',
  password: `${process.env.SE_TEST_DB_PASSWORD}`, //set in .github/workflows/playwright.yml using GitHub secrets, hardcode when running locally
  database: 'sponsorengagement',
}
export const seConnection = mysql.createConnection(seDbConfig)
