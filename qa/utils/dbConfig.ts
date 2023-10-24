import * as sql from 'mssql'
import mysql, { ConnectionOptions, RowDataPacket } from 'mysql2'
//INITIAL CONFIG FOR CPMS DB & SE DB REQUESTS
const cpmsDbConfig = {
  user: 'chris.mcneill',
  password: `${process.env.CPMS_TEST_DB_PASSWORD}`, //set in .github/workflows/playwright.yml using GitHub secrets, hardcode when running locally
  server: `${process.env.CPMS_TEST_DB_SERVER}`, //set in .github/workflows/playwright.yml using GitHub secrets, hardcode when running locally
  database: 'NIHR.CRN.CPMS.OperationalDatabase',
  options: {
    encrypt: false,
    trustServerCertificate: false,
  },
}

const seDbConfig: ConnectionOptions = {
  host: `${process.env.SE_TEST_DB_HOST}`, //set in .github/workflows/playwright.yml using GitHub secrets, hardcode when running locally
  user: 'admin',
  password: `${process.env.SE_TEST_DB_PASSWORD}`, //set in .github/workflows/playwright.yml using GitHub secrets, hardcode when running locally
  database: 'sponsorengagement',
}
const seConnection = mysql.createConnection(seDbConfig)

export async function cpmsDatabaseReq() {
  let result
  try {
    await sql.connect(cpmsDbConfig)
    result = await sql.query`SELECT * FROM SysRefStudyStatus`
  } catch (error) {
    console.error(error)
    throw Error('CPMS DB request Failed to Execute correctly, see attached Console Logs')
  }
  return result.recordset
}

export async function seDatabaseReq(): Promise<RowDataPacket[]> {
  return new Promise((resolve, reject) => {
    seConnection.query<RowDataPacket[]>('SELECT * FROM Study WHERE cpmsId= 15389 OR cpmsId=20440', (err, res) => {
      if (err) reject(err)
      else resolve(res)
    })
  })
}
