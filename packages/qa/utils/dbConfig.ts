import mysql, { PoolOptions } from 'mysql2'
import sql from 'mssql'

// this was refactored to use a connection pool for automatic reconnection and scalability as the original db connection was flaky
// this should ensure that the db connection is available throughout the entirety of the test execution without being prematurely closed

const seServer =
  process.env.SE_TEST_DB_HOST ||
  (() => {
    throw new Error('SE_TEST_DB_HOST is not defined')
  })()
const sePassword =
  process.env.SE_TEST_DB_PASSWORD ||
  (() => {
    throw new Error('SE_TEST_DB_PASSWORD is not defined')
  })()

const seDbConfig: PoolOptions = {
  host: seServer,
  user: 'admin',
  password: sePassword,
  database: 'sponsorengagement',
  connectTimeout: 30000,
  waitForConnections: true,
  connectionLimit: 10,
}

function seCreatePool() {
  const pool = mysql.createPool(seDbConfig)

  pool.on('connection', (connection) => {
    console.log('New SE database connection established ✔')

    connection.on('error', (err) => {
      console.error('SE database connection error:', err)
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Connection lost! Reconnecting...')
        seCreatePool() // reconnect if lost
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

const cpmsServer =
  process.env.CPMS_TEST_DB_IP ||
  (() => {
    throw new Error('CPMS_TEST_DB_IP is not defined')
  })()
const cpmsPassword =
  process.env.CPMS_TEST_DB_PASSWORD ||
  (() => {
    throw new Error('CPMS_TEST_DB_PASSWORD is not defined')
  })()

const cpmsDbConfig = {
  server: cpmsServer,
  port: 1433, // already default but setting explicitly to avoid ci issues
  database: 'NIHR.CRN.CPMS.OperationalDatabase',
  user: 'cpmsadmin',
  password: cpmsPassword,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
}

function cpmsCreatePool() {
  const pool = new sql.ConnectionPool(cpmsDbConfig)
  const poolConnect = pool
    .connect()
    .then(() => {
      console.log('New CPMS database connection established ✔')
    })
    .catch((err: any) => {
      console.error('Error connecting to the CPMS database:', err)
    })

  pool.on('error', (err: any) => {
    console.error('CPMS database connection pool error:', err)
  })

  return { pool, poolConnect }
}

export const seConnectionPool = seCreatePool()
export const cpmsConnectionPool = cpmsCreatePool()
