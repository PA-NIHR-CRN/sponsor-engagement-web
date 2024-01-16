import * as sql from 'mssql'
import { RowDataPacket } from 'mysql2'
import { seConnection, cpmsDbConfig } from './dbConfig'

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

export async function seDatabaseReq(query: string): Promise<RowDataPacket[]> {
  return new Promise((resolve, reject) => {
    seConnection.query<RowDataPacket[]>(`${query}`, (err, res) => {
      if (err) reject(err)
      else resolve(res)
    })
  })
}
