/* eslint-env jest -- set environment to jest */
import '@testing-library/jest-dom'

import { TextDecoder, TextEncoder } from 'node:util'

jest.mock('axios-rate-limit')

// Mocks Next's router to ensure useRouter hook calls don't trigger errors
jest.mock('next/router', () => require('next-router-mock'))

// Fixes the "ReferenceError: TextEncoder is not defined" errors
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

global.structuredClone = (v) => JSON.parse(JSON.stringify(v))

Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
})
