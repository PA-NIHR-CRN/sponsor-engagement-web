import { useRouter } from 'next/router'
import { useEffect } from 'react'
import type { FieldError, FormState, Path } from 'react-hook-form'

import type { Schemas } from '../utils/form'
import { getErrorsFromSearchParams, hasErrorsInSearchParams } from '../utils/form'

/**
 * This hook detects field-level errors in the URL searchParams on page load
 *
 * For js users, it extracts them and injects them into RHF state via the useEffect
 * It then clears the searchParams so that subsequent page refreshes show an empty form.
 *
 * For non-js users, server returned errors will get returned directly and bypass RHF state.
 * They are then passed directly down to the input components.
 */
export function useFormErrorHydration<T extends Record<string, unknown>>({
  schema,
  formState,
  onFoundError,
}: {
  schema: Schemas
  formState: FormState<T>
  onFoundError: (field: Path<T>, error: FieldError) => void
}) {
  const router = useRouter()

  const hasServerErrors = hasErrorsInSearchParams(schema, router.query)
  const serverErrors = getErrorsFromSearchParams(schema, router.query)

  useEffect(() => {
    if (hasServerErrors) {
      if (!formState.defaultValues) return

      Object.keys(formState.defaultValues).forEach((field) => {
        const value = formState.defaultValues?.[field]

        if (typeof value === 'object') {
          Object.keys(value as object).forEach((nestedField) => {
            if (router.query[`${field}-${nestedField}Error`]) {
              onFoundError(`${field}-${nestedField}` as Path<T>, {
                type: 'custom',
                message: router.query[`${field}-${nestedField}Error`] as string,
              })
            }
          })
        }

        if (router.query[`${field}Error`]) {
          onFoundError(field as Path<T>, {
            type: 'custom',
            message: router.query[`${field}Error`] as string,
          })
        }
      })

      if (formState.isSubmitSuccessful) {
        void router.replace({ query: undefined })
      }
    }
  }, [router.asPath, router, hasServerErrors, onFoundError, formState.defaultValues, formState.isSubmitSuccessful])

  return {
    errors: hasServerErrors ? serverErrors : formState.errors,
  }
}
