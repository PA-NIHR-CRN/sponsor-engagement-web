import * as z from 'zod'

export type ContactManagerAddInputs = z.infer<typeof contactManagerAddSchema>

export const contactManagerAddSchema = z
  .object({
    emailAddress: z.string().email('Enter a valid email address').min(1, { message: 'Enter an email address' }),
  })
  .required()

export type RemoveContactManagerInputs = z.infer<typeof removeContactManagerSchema>

export const removeContactManagerSchema = z
  .object({
    contactManagerUserId: z.string(),
  })
  .required()
