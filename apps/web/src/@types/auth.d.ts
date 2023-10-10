// eslint-disable-next-line @typescript-eslint/no-unused-vars -- required for type augmentation
import type { DefaultSession } from 'next-auth'
import type { UserOrganisation } from 'database'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** Primary key ID associated with the user's local account. */
      id: number

      /** Full name associated with a user's IDG account. */
      name: string

      /** Email address associated with a user's IDG account. */
      email: string

      /** The role ids associated with the user's local account. */
      roles: number[]

      /** The organisations associated with the user's local account. */
      organisations: UserOrganisation[]
    } | null
  }
}
