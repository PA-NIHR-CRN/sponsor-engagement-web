import { config as dotEnvConfig } from 'dotenv'

async function globalSetup() {
  dotEnvConfig()
}

export default globalSetup
