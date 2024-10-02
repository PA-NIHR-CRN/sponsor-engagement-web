import mysql, { PoolOptions } from 'mysql2'

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

  // handle errors
  pool.on('connection', (connection) => {
    console.log('New database connection established ✔')

    connection.on('error', (err) => {
      console.error('Database connection error:', err)
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

export const seConnectionPool = createPool()
