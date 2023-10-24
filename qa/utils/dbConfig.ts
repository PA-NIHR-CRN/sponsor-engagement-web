import * as sql from 'mssql'
//INITAL CONFIG FOR CPMS DB REQUESTS
//BUILD UPON AND ADD FOR SE DB
const sqlConfig = {
  user: 'chris.mcneill',
  password: `${process.env.CPMS_TEST_DB_PASSWORD}`, //set in .github/workflows/playwright.yml using GitHub secrets, hardcode when running locally
  server: `${process.env.CPMS_TEST_DB_SERVER}`, //set in .github/workflows/playwright.yml using GitHub secrets, hardcode when running locally
  database: 'NIHR.CRN.CPMS.OperationalDatabase',
  options: {
    encrypt: false,
    trustServerCertificate: false,
  },
}

export async function cpmsDatabaseReq() {
  let result
  try {
    await sql.connect(sqlConfig)
    result = await sql.query`SELECT * FROM SysRefStudyStatus`
    // console.dir(result);
  } catch (error) {
    console.error(error)
    throw Error('DB request Failed to Execute correctly, see attached Console Logs')
  }
  return result
}
