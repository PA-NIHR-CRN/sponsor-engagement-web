import { RowDataPacket } from 'mysql2'
import { seConnection } from './dbConfig'

export async function seDatabaseReq(query: string): Promise<RowDataPacket[]> {
  return new Promise((resolve, reject) => {
    seConnection.query<RowDataPacket[]>(`${query}`, (err, res) => {
      if (err) reject(err)
      else resolve(res)
    })
  })
}
