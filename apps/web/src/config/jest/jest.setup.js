/* eslint-env jest -- set environment to jest */

import '@testing-library/jest-dom'
import { useSession } from 'next-auth/react'
import { authenticatedSessionMock } from '../../__mocks__/session'

jest.mock('next/router', () => require('next-router-mock'))
jest.mock('next-auth/react')

jest.mocked(useSession).mockReturnValue(authenticatedSessionMock)
