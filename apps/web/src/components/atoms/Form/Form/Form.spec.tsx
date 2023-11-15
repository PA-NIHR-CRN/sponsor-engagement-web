import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import { useRouter } from 'next/router'
import type { FieldValues, UseFormHandleSubmit } from 'react-hook-form'
import { logger } from '@nihr-ui/logger'
import { Form } from './Form'

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))
jest.mock('axios')
jest.mock('@nihr-ui/logger')

logger.error = jest.fn()

afterEach(() => {
  jest.clearAllMocks()
})

test('Handles form submission successfully', async () => {
  const axiosPostMock = jest.mocked(axios.post).mockResolvedValue({
    request: { responseURL: 'https://example.com/confirmation' },
  })

  const routerPushMock = jest.fn()
  const routerReplaceMock = jest.fn()

  // Mock useRouter hook to return the mocked router functions
  ;(useRouter as jest.Mock).mockReturnValueOnce({
    push: routerPushMock,
    replace: routerReplaceMock,
  })

  const mockEvt = {}
  const handleSubmit = (callback: (values: FieldValues) => void) => {
    callback({ fullName: 'John' })
    return () => mockEvt
  }

  render(
    <Form
      action="/submit"
      handleSubmit={handleSubmit as UseFormHandleSubmit<FieldValues>}
      method="post"
      onError={jest.fn()}
    >
      <input name="name" type="text" />
      <button type="submit">Submit</button>
    </Form>
  )

  // Simulate form submission
  await userEvent.click(screen.getByText('Submit'))

  // Verify that axios.post was called with the correct data
  expect(axiosPostMock).toHaveBeenCalledWith('/submit', {
    fullName: 'John', // Add the expected form values here
  })

  // Verify that router functions were not called
  expect(routerPushMock).toHaveBeenCalledWith('/confirmation')
  expect(routerReplaceMock).not.toHaveBeenCalled()
})

test('Handles failures due to an api request error', async () => {
  const axiosPostMock = jest.mocked(axios.post).mockResolvedValue({
    request: { responseURL: undefined },
  })

  const routerPushMock = jest.fn()
  const routerReplaceMock = jest.fn()

  // Mock useRouter hook to return the mocked router functions
  ;(useRouter as jest.Mock).mockReturnValueOnce({
    push: routerPushMock,
    replace: routerReplaceMock,
    asPath: 'mock-url',
  })

  const mockEvt = {}
  const handleSubmit = (callback: (values: FieldValues) => void) => {
    callback({ fullName: 'John' })
    return () => mockEvt
  }

  const onError = jest.fn()

  render(
    <Form
      action="/submit"
      handleSubmit={handleSubmit as UseFormHandleSubmit<FieldValues>}
      method="post"
      onError={onError}
    >
      <input name="name" type="text" />
      <button type="submit">Submit</button>
    </Form>
  )

  // Simulate form submission
  await userEvent.click(screen.getByText('Submit'))

  // Verify that axios.post was called with the correct data
  expect(axiosPostMock).toHaveBeenCalledWith('/submit', { fullName: 'John' })

  // Verify that router functions were not called
  expect(routerReplaceMock).toHaveBeenCalledWith('http://localhost/mock-url?fatal=1')
  expect(routerPushMock).not.toHaveBeenCalled()
  expect(onError).toHaveBeenCalled()
})
