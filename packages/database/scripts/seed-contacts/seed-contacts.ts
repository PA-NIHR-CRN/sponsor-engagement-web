import path from 'node:path'
import * as fs from 'node:fs'
import assert from 'node:assert'
import axios from 'axios'
import { PrismaClient, type Prisma } from '@prisma/client'
import { logger } from 'logger'
import { parse } from 'csv-parse'
import { stringify } from 'csv-stringify/sync'
import rateLimit from 'axios-rate-limit'
import { contactHeaders, ctuHeaders, croHeaders, sponsorHeaders, reportHeaders } from './constants'

const prisma = new PrismaClient()

const { IDG_API_URL, IDG_API_USERNAME, IDG_API_PASSWORD } = process.env

assert(IDG_API_URL)
assert(IDG_API_USERNAME)
assert(IDG_API_PASSWORD)

const api = rateLimit(
  axios.create({
    baseURL: IDG_API_URL,
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

const skippedOrganisations: {
  name: string
  role: string
  rtsIdentifier: string
  contacts: string[]
}[] = []

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

  const dbUser = await prisma.user.upsert({
    where: {
      email: 'administrator@nihr.ac.uk',
    },
    update: {},
    create: {
      email: 'administrator@nihr.ac.uk',
      name: 'Administrator',
      identityGatewayId: '',
    },
  })

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

    // Get contacts for sponsor
    const contacts = headers
      .filter((header) => contactHeaders.includes(header))
      .map((header) => row[header as keyof T] as string)
      .filter(Boolean)
      .map((email) => email.trim().toLowerCase())
      .filter((email, index, arr) => arr.indexOf(email) === index)

    const organisation = await prisma.organisation.findFirst({ where: { rtsIdentifier } })

    if (!organisation) {
      skippedOrganisations.push({ name, rtsIdentifier, role: fileName.toUpperCase(), contacts })
      return
    }

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

    const users: Prisma.UserGetPayload<undefined>[] = []

    // Add/update user
    const upserts = contacts.map((email, index) => {
      const userData = {
        email,
        identityGatewayId: identityGatewayIds[index],
        organisations: {
          createMany: {
            data: {
              organisationId: organisation.id,
              createdById: dbUser.id,
              updatedById: dbUser.id,
            },
            skipDuplicates: true,
          },
        },
        roles: {
          createMany: {
            data: {
              roleId: sponsorContactRole.id,
              createdById: dbUser.id,
              updatedById: dbUser.id,
            },
            skipDuplicates: true,
          },
        },
      }
      return prisma.user.upsert({
        where: { email },
        update: userData,
        create: userData,
      })
    })

    // Processing serially to avoid unique index collisions
    for await (const user of upserts) {
      users.push(user)
    }

    return prisma.account.createMany({
      data: users.map((user) => ({
        userId: user.id,
        type: 'oauth',
        provider: 'oidc',
        providerAccountId: user.identityGatewayId,
      })),
      skipDuplicates: true,
    })
  })

  await Promise.all(promises)

  logger.info(`✓ Contacts seed end (${fileName.toUpperCase()})`)
}

async function main() {
  await seedContacts('sponsor', sponsorHeaders)
  await seedContacts('cro', croHeaders)
  await seedContacts('ctu', ctuHeaders)

  const reportPath = path.resolve(__dirname, `../../csv/reports/contacts_migration.csv`)

  fs.writeFileSync(
    reportPath,
    stringify([
      reportHeaders,
      ...skippedOrganisations.map(({ name, role, rtsIdentifier, contacts }) => [
        name,
        role,
        rtsIdentifier,
        ...contacts,
      ]),
    ])
  )
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
