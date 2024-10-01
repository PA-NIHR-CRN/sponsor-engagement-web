import mysql, { ConnectionOptions } from 'mysql2'

// const seDbConfig: ConnectionOptions = {
//   host: `${process.env.SE_TEST_DB_HOST}`, //set in .github/workflows/playwright.yml using GitHub secrets, hardcode when running locally
//   user: 'admin',
//   password: `${process.env.SE_TEST_DB_PASSWORD}`, //set in .github/workflows/playwright.yml using GitHub secrets, hardcode when running locally
//   database: 'sponsorengagement',
//   connectTimeout: 15000,
// }
// export const seConnection = mysql.createConnection(seDbConfig)

const seDbConfig: ConnectionOptions = {
  host: `${process.env.SE_TEST_DB_HOST}`,
  user: 'admin',
  password: `${process.env.SE_TEST_DB_PASSWORD}`,
  database: 'sponsorengagement',
  connectTimeout: 15000,
}

function createConnection() {
  const connection = mysql.createConnection(seDbConfig)

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err)
      setTimeout(createConnection, 2000)
    } else {
      console.log('Database connected successfully!')
    }
  })

  // handle errors
  connection.on('error', (err) => {
    console.error('Database connection error:', err)
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('Connection lost. Reconnecting...')
      createConnection() // reconnect
    } else {
      throw err // rethrow if different error
    }
  })

  return connection
}

export const seConnection = createConnection()
