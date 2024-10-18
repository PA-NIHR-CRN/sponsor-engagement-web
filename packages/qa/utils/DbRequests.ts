import { RowDataPacket } from 'mysql2'
import { seConnectionPool, cpmsConnectionPool } from './dbConfig'

// this was refactored to use a connection pool for automatic reconnection and scalability as the original db connection was flaky
// this should ensure that the db connection is available throughout the entirety of the test execution without being prematurely closed

export async function seDatabaseReq(query: string): Promise<RowDataPacket[]> {
  return new Promise((resolve, reject) => {
    seConnectionPool.query<RowDataPacket[]>(`${query}`, (err, res) => {
      if (err) reject(err)
      else resolve(res)
    })
  })
}

export async function waitForSeDbRequest(query: string) {
  let dbStudyUpdate: string | any[] = []

  while (dbStudyUpdate.length === 0) {
    dbStudyUpdate = await seDatabaseReq(query)

    if (dbStudyUpdate.length !== 0) {
      break
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  return dbStudyUpdate
}

export async function cpmsDatabaseReq(query: string): Promise<any[]> {
  try {
    await cpmsConnectionPool.poolConnect

    const result = await cpmsConnectionPool.pool.request().query(query)
    return result.recordset
  } catch (err) {
    console.error('SQL error:', err)
    throw err
  }
}
