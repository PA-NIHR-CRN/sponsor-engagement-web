import axios from 'axios'
import type { ZodType, z } from 'zod'
import rateLimit from 'axios-rate-limit'
import type { createUserRequestSchema, getUserRequestSchema } from './schemas'
import { getUserResponseSchema, createUserResponseSchema } from './schemas'

const { IDG_API_URL, IDG_API_USERNAME, IDG_API_PASSWORD } = process.env

const api = rateLimit(
  axios.create({
    baseURL: IDG_API_URL,
    auth: {
      username: IDG_API_USERNAME || '',
      password: IDG_API_PASSWORD || '',
    },
  }),
  {
    maxRequests: 5,
    perMilliseconds: 1000,
    maxRPS: 5,
  }
)

type Infer<T extends ZodType> = z.infer<T>

export const requests = {
  getUser: async (email: string) => {
    const params: Infer<typeof getUserRequestSchema> = {
      startIndex: 1,
      count: 1,
      domain: 'PRIMARY',
      attributes: 'userName',
      filter: `emails eq ${email}`,
    }

    const response = await api.get<Infer<typeof getUserResponseSchema>>(`${IDG_API_URL}/Users`, { params })
    return getUserResponseSchema.safeParse(response.data)
  },
  createUser: async ({
    givenName,
    familyName,
    userName = crypto.randomUUID(),
    password,
    emails,
  }: {
    givenName?: string
    familyName?: string
    userName?: string
    password: string
    emails: string[]
  }) => {
    const data: Infer<typeof createUserRequestSchema> = {
      schemas: [],
      name: {
        givenName,
        familyName,
      },
      userName,
      password,
      emails: emails.map((value) => ({ value })),
    }

    const response = await api.post<Infer<typeof createUserResponseSchema>>(`${IDG_API_URL}/Users`, data)
    return createUserResponseSchema.safeParse(response.data)
  },
}
