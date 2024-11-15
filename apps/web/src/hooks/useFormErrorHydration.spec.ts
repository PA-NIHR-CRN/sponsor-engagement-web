import { renderHook } from '@testing-library/react'
import { useRouter } from 'next/router'
import type { FieldValues, FormState } from 'react-hook-form'

import { assessmentSchema, studySchema } from '../utils/schemas'
import { useFormErrorHydration } from './useFormErrorHydration'

// Mock useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

const formState: FormState<FieldValues> = {
  defaultValues: {
    status: 'default value',
    furtherInformation: 'default value',
    plannedOpeningDate: {
      day: '14',
      month: '12',
      year: '2024',
    },
    actualOpeningDate: {
      day: '14',
      month: '12',
      year: '',
    },
  },
  submitCount: 1,
  dirtyFields: {},
  touchedFields: {},
  errors: {},
  isSubmitSuccessful: true,
  isSubmitted: true,
  isSubmitting: false,
  isValid: true,
  isValidating: false,
  isDirty: false,
  isLoading: false,
  disabled: false,
}

describe('useFormErrorHydration', () => {
  beforeEach(() => {
    // Reset the mock implementation before each test
    jest.clearAllMocks()
  })

  it('should handle server errors and clear searchParams after successful submission', () => {
    const onFoundError = jest.fn()

    const router = {
      query: {
        statusError: 'Error message 1',
        furtherInformationError: 'Error message 2',
      },
      replace: jest.fn(),
    }

    // Mock the useRouter hook to return the router object
    ;(useRouter as jest.Mock).mockReturnValue(router)

    // Render the hook
    const { result } = renderHook(() =>
      useFormErrorHydration({
        schema: assessmentSchema,
        formState,
        onFoundError,
      })
    )

    expect(result.current.errors).toEqual({
      status: { type: 'custom', message: 'Error message 1' },
      furtherInformation: { type: 'custom', message: 'Error message 2' },
    })

    // Verify that onFoundError was called with the correct arguments
    expect(onFoundError).toHaveBeenCalledTimes(2)
    expect(onFoundError).toHaveBeenCalledWith('status', { type: 'custom', message: 'Error message 1' })
    expect(onFoundError).toHaveBeenCalledWith('furtherInformation', { type: 'custom', message: 'Error message 2' })

    // Verify that router.replace was called with the correct arguments
    expect(router.replace).toHaveBeenCalledWith({ query: undefined })
  })

  it('should handle server errors arround date fields correctly', () => {
    const onFoundError = jest.fn()

    const router = {
      query: {
        plannedOpeningDateError: 'Error message 1',
        'actualOpeningDate-yearError': 'Error message 2',
      },
      replace: jest.fn(),
    }

    // Mock the useRouter hook to return the router object
    ;(useRouter as jest.Mock).mockReturnValue(router)

    // Render the hook
    const { result } = renderHook(() =>
      useFormErrorHydration({
        schema: studySchema,
        formState,
        onFoundError,
      })
    )

    expect(result.current.errors).toEqual({
      plannedOpeningDate: { type: 'custom', message: 'Error message 1' },
      'actualOpeningDate-year': { type: 'custom', message: 'Error message 2' },
    })

    // Verify that onFoundError was called with the correct arguments
    expect(onFoundError).toHaveBeenCalledTimes(2)
    expect(onFoundError).toHaveBeenCalledWith('plannedOpeningDate', { type: 'custom', message: 'Error message 1' })
    expect(onFoundError).toHaveBeenCalledWith('actualOpeningDate-year', { type: 'custom', message: 'Error message 2' })

    // Verify that router.replace was called with the correct arguments
    expect(router.replace).toHaveBeenCalledWith({ query: undefined })
  })

  it('should return formState (client side) errors when there are no server errors', () => {
    const onFoundError = jest.fn()

    const router = {
      query: {},
      replace: jest.fn(),
    }

    // Mock the useRouter hook to return the router object
    ;(useRouter as jest.Mock).mockReturnValue(router)

    // Render the hook
    const { result } = renderHook(() =>
      useFormErrorHydration({
        schema: assessmentSchema,
        formState: {
          ...formState,
          isSubmitSuccessful: false,
          errors: {
            fullName: { type: 'required', message: 'Field 1 is required' },
            jobRole: { type: 'minLength', message: 'Field 2 must have at least 5 characters' },
          },
        },
        onFoundError,
      })
    )

    expect(result.current.errors).toEqual({
      fullName: { message: 'Field 1 is required', type: 'required' },
      jobRole: { message: 'Field 2 must have at least 5 characters', type: 'minLength' },
    })

    // Verify that onFoundError was not called
    expect(onFoundError).not.toHaveBeenCalled()

    // Verify that router.replace was not called
    expect(router.replace).not.toHaveBeenCalled()
  })
})
