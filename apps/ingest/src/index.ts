import { PrismaClient } from 'database'

async function ingest() {
  const prismaClient = new PrismaClient()
  const data = await prismaClient.study.findFirst()
  console.log(JSON.stringify(data, null, 4))
}

ingest()
