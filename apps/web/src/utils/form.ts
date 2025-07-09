import type { ParsedUrlQuery } from 'node:querystring'

import type { FieldError, FieldErrors } from 'react-hook-form'
import Zod from 'zod'

import type { DateInputValue } from '@/components/atoms/Form/DateInput/types'

import { editStudyDateFields } from './editStudyForm'
import {
  type assessmentSchema,
  type contactManagerAddSchema,
  type organisationAddSchema,
  type organisationRemoveContactSchema,
  type registrationSchema,
  type studySchema,
} from './schemas'

export type Schemas =
  | typeof assessmentSchema
  | typeof organisationAddSchema
  | typeof organisationRemoveContactSchema
  | typeof registrationSchema
  | typeof studySchema
  | typeof contactManagerAddSchema

/**
 * Checks if there's any form errors present in the URL searchParams for a given schema
 */
export function hasErrorsInSearchParams(schema: Schemas, searchParams: ParsedUrlQuery) {
  const shape = schema instanceof Zod.ZodEffects ? schema._def.schema.shape : schema.shape

  return Object.keys(shape).some((field) => {
    if ((editStudyDateFields as string[]).includes(field)) {
      // Check if there is a parent level error
      if (searchParams[`${field}Error`]) {
        return searchParams[`${field}Error`]
      }

      // Loop through date parts for errors
      const dateFields = ['day', 'month', 'year']
      return dateFields.some((dateField) => searchParams[`${field}-${dateField}Error`])
    }
    return searchParams[`${field}Error`]
  })
}

/**
 * Extracts the persisted form values state from the URL searchParams for a given schema
 */
export function getValuesFromSearchParams(
  schema: Schemas,
  searchParams: ParsedUrlQuery
): Record<string, string | string[] | undefined | DateInputValue> {
  const shape = schema instanceof Zod.ZodEffects ? schema._def.schema.shape : schema.shape

  return Object.fromEntries(
    Object.keys(shape).map((field) => {
      const value = searchParams[field]

      if (value) {
        // Checkbox groups return a comma delimited list of values
        if (value.includes(',')) {
          return [field, String(searchParams[field]).split(',')]
        }

        // Nested date fields - curently only date fields are in edit study form
        if ((editStudyDateFields as string[]).includes(field)) {
          const dateParts = { day: '', month: '', year: '' }

          Object.keys(dateParts).forEach((dateField) => {
            if (searchParams[`${field}-${dateField}`]) {
              dateParts[dateField] = searchParams[`${field}-${dateField}`]
            }
          })

          return [field, dateParts]
        }

        // Everything else just returns a value
        return [field, value]
      }

      return [field, undefined]
    })
  )
}

/**
 * Extracts the persisted form error state from the URL searchParams for a given schema
 */
export function getErrorsFromSearchParams(schema: Schemas, searchParams: ParsedUrlQuery) {
  const shape = schema instanceof Zod.ZodEffects ? schema._def.schema.shape : schema.shape

  const keys = Object.keys(shape)

  // https://github.com/microsoft/TypeScript/issues/44373
  const keysArray: (typeof keys)[number][] = Object.keys(shape)

  return keysArray.reduce<FieldErrors>((errors, field) => {
    if ((editStudyDateFields as string[]).includes(field)) {
      const dateFields = ['day', 'month', 'year']

      dateFields.forEach((dateField) => {
        if (searchParams[`${field}-${dateField}Error`]) {
          const error: FieldError = {
            type: 'custom',
            message: searchParams[`${field}-${dateField}Error`] as string,
          }
          errors[`${field}-${dateField}`] = error
        }
      })
    }

    if (searchParams[`${field}Error`]) {
      const error: FieldError = {
        type: 'custom',
        message: searchParams[`${field}Error`] as string,
      }
      errors[field] = error
    }
    return errors
  }, {})
}
