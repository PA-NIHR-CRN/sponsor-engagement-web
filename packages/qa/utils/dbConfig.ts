import mysql, { PoolOptions } from 'mysql2'
import sql from 'mssql'

// this was refactored to use a connection pool for automatic reconnection and scalability as the original db connection was flaky
// this should ensure that the db connection is available throughout the entirety of the test execution without being prematurely closed

const seDbConfig: PoolOptions = {
  host: `${process.env.SE_TEST_DB_HOST}`,
  user: 'admin',
  password: `${process.env.SE_TEST_DB_PASSWORD}`,
  database: 'sponsorengagement',
  connectTimeout: 30000,
  waitForConnections: true,
  connectionLimit: 10,
}

function createPool() {
  const pool = mysql.createPool(seDbConfig)

  pool.on('connection', (connection) => {
    console.log('New SE database connection established ✔')

    connection.on('error', (err) => {
      console.error('SE database connection error:', err)
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Connection lost! Reconnecting...')
        createPool() // reconnect if lost
      } else {
        throw err
      }
    })
  })

  pool.on('error', (err) => {
    console.error('Error in the pool:', err)
  })

  return pool
}

const connectionString = `Data Source=${process.env.CPMS_TEST_DB_IP};Initial Catalog=NIHR.CRN.CPMS.OperationalDatabase;Integrated Security=False;User Id=cpmsadmin;Password=${process.env.CPMS_TEST_DB_PASSWORD};Encrypt=true;TrustServerCertificate=true;`

function cpmsCreatePool() {
  const pool = new sql.ConnectionPool(connectionString)
  const poolConnect = pool.connect()

  pool.on('error', (err: any) => {
    console.error('CPMS database connection pool error:', err)
  })
  console.log('New CPMS database connection established ✔')
  return { pool, poolConnect }
}

export const seConnectionPool = createPool()
export const cpmsConnectionPool = cpmsCreatePool()
