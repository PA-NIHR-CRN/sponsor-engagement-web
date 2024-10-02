// import { RowDataPacket } from 'mysql2'
// import { seConnection } from './dbConfig'

// export async function seDatabaseReq(query: string): Promise<RowDataPacket[]> {
//   return new Promise((resolve, reject) => {
//     seConnection.query<RowDataPacket[]>(`${query}`, (err, res) => {
//       if (err) reject(err)
//       else resolve(res)
//     })
//   })
// }

// pool refactor:
import { RowDataPacket } from 'mysql2'
import { seConnectionPool } from './dbConfig'

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
