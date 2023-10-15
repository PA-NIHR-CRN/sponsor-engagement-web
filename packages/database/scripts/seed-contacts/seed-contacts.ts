import path from 'node:path'
import * as fs from 'node:fs'
import assert from 'node:assert'
import axios from 'axios'
import { PrismaClient } from '@prisma/client'
import { logger } from 'logger'
import { parse } from 'csv-parse'
import rateLimit from 'axios-rate-limit'
import { contactHeaders, ctuHeaders, croHeaders, sponsorHeaders } from './constants'

const prisma = new PrismaClient()

const { IDG_API_URL, IDG_API_USERNAME, IDG_API_PASSWORD } = process.env

assert(IDG_API_URL)
assert(IDG_API_USERNAME)
assert(IDG_API_PASSWORD)

const api = rateLimit(
  axios.create({
    baseURL: process.env.IDG_API_URL,
    auth: {
      username: IDG_API_USERNAME,
      password: IDG_API_PASSWORD,
    },
  }),
  {
    maxRequests: 5,
    perMilliseconds: 1000,
    maxRPS: 5,
  }
)

// eslint-disable-next-line @typescript-eslint/naming-convention -- intended
interface IDGResponse {
  totalResults: number
  Resources?: {
    userName: string
  }[]
}

type SponsorHeaders = typeof sponsorHeaders
type CROHeaders = typeof croHeaders
type CTUHeaders = typeof ctuHeaders

type Sponsor = Record<SponsorHeaders[number], string>
type CRO = Record<CROHeaders[number], string>
type CTU = Record<CTUHeaders[number], string>

type Row = Sponsor | CRO | CTU

const isSponsor = (row: Row): row is Sponsor => 'Sponsor' in row
const isCRO = (row: Row): row is CRO => 'CRO' in row
const isCTU = (row: Row): row is CTU => 'CTU' in row

const seenContacts: string[] = []

const seedContacts = async <T extends Row>(fileName: string, headers: SponsorHeaders | CROHeaders | CTUHeaders) => {
  logger.info(`⧗ Contacts seed start (${fileName.toUpperCase()}) ✓`)

  const csvPath = path.resolve(__dirname, `../../csv/${fileName}.csv`)

  const fileContent = fs.readFileSync(csvPath, { encoding: 'utf-8' })

  const rows = await new Promise<T[]>((resolve, reject) => {
    parse(
      fileContent,
      {
        delimiter: ',',
        columns: [...headers],
        fromLine: 2,
      },
      (error, result: T[]) => {
        error ? reject(error) : resolve(result)
      }
    )
  })

  const dbUser = await prisma.user.findFirst({ where: { email: 'dale.christian@nihr.ac.uk' } })
  const sponsorContactRole = await prisma.sysRefRole.findFirst({ where: { name: 'SponsorContact' } })

  assert(dbUser)
  assert(sponsorContactRole)

  const promises = rows.map(async (row) => {
    const rtsIdentifier = row['RTS ID']

    let name = ''
    if (isSponsor(row)) {
      name = row.Sponsor
    } else if (isCRO(row)) {
      name = row.CRO
    } else if (isCTU(row)) {
      name = row.CTU
    }

    const organisation = await prisma.organisation.findFirst({ where: { rtsIdentifier } })

    if (!organisation) {
      logger.warn(`Organisation not found: ${name} (${rtsIdentifier})`)
      return
    }

    // Get contacts for sponsor
    const contacts = headers
      .filter((header) => contactHeaders.includes(header))
      .map((header) => row[header as keyof T])
      .filter(Boolean)
      .filter((email) => !seenContacts.includes(email as string))
      .filter((email, index, arr) => arr.indexOf(email) === index) as string[]

    seenContacts.push(...contacts)

    const identityGatewayIds = await Promise.all(
      contacts.map(async (email) => {
        const response = await api.get<IDGResponse>(`${IDG_API_URL}/Users`, {
          params: {
            startIndex: 1,
            count: 1,
            domain: 'PRIMARY',
            attributes: 'userName',
            filter: `emails eq ${email}`,
          },
        })
        const identityGatewayId = response.data.Resources?.[0]?.userName ?? ''
        if (!identityGatewayId) {
          logger.warn(`IDG ID not found: ${email}`)
        }
        return identityGatewayId
      })
    )

    // Add/update user
    const upserts = contacts.map((email, index) => {
      const userData = {
        email,
        identityGatewayId: identityGatewayIds[index],
        organisations: {
          create: {
            organisation: {
              connect: { rtsIdentifier },
            },
            createdBy: { connect: { id: dbUser.id } },
            updatedBy: { connect: { id: dbUser.id } },
          },
        },
        roles: {
          create: {
            role: { connect: { id: sponsorContactRole.id } },
            createdBy: { connect: { id: dbUser.id } },
            updatedBy: { connect: { id: dbUser.id } },
          },
        },
      }
      return prisma.user.upsert({
        where: { email },
        update: userData,
        create: userData,
      })
    })

    return prisma.$transaction(upserts)
  })

  await Promise.all(promises)

  logger.info(`✓ Contacts seed end (${fileName.toUpperCase()})`)
}

async function main() {
  await seedContacts('sponsors', sponsorHeaders)
  await seedContacts('cro', croHeaders)
  await seedContacts('ctu', ctuHeaders)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    logger.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
