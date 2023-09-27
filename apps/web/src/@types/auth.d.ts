// eslint-disable-next-line @typescript-eslint/no-unused-vars -- required for type augmentation
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** Full name associated with a users IDG account. */
      name: string

      /** Email address associated with a users IDG account. */
      email: string

      /** The role ids associated with the users local account. */
      roles: number[]
    } | null
  }
}
