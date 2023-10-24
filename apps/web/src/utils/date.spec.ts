import dayjs from 'dayjs'
import MockDate from 'mockdate'
import { formatDate } from './date'

beforeEach(() => {
  MockDate.set(new Date('2001-01-01'))
})

afterEach(() => {
  MockDate.reset()
})

describe('formatDate', () => {
  it('returns a correctly formatted date', () => {
    expect(formatDate(dayjs().toISOString())).toEqual('1 January 2001')
  })

  it('returns a correctly formatted date in a shorter format', () => {
    expect(formatDate(dayjs().toISOString(), 'short')).toEqual('01 Jan 2001')
  })
})
