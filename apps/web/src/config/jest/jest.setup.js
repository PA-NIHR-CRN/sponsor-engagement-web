/* eslint-env jest -- set environment to jest */

import '@testing-library/jest-dom'

jest.mock('next/router', () => require('next-router-mock'))
