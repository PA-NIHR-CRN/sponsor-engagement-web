import dayjs from 'dayjs'
import MockDate from 'mockdate'

import { areAllDatePartsEmpty, constructDatePartsFromDate, constructDateStrFromParts, formatDate } from './date'

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

describe('constructDateStrFromParts', () => {
  it.each([undefined, null])('should return undefined if input is %s', (value: undefined | null) => {
    const result = constructDateStrFromParts(value)
    expect(result).toBeUndefined()
  })

  it.each(['year', 'month', 'day'])('should return undefined if %s is NaN', (datePart: string) => {
    const invalidDateParts = { year: '2021', month: '02', day: '01' }
    const result = constructDateStrFromParts({ ...invalidDateParts, [datePart]: 'abc' })
    expect(result).toBeUndefined()
  })

  it('should return a Date object with timezone offset by default if valid date parts are provided', () => {
    const validDateParts = { year: '2021', month: '02', day: '15' }
    const result = constructDateStrFromParts(validDateParts)
    expect(result).toEqual(new Date('2021-02-15').toISOString())
  })

  it('should return a Date object without timezone offset if flag is set to false if valid date parts are provided', () => {
    const validDateParts = { year: '2021', month: '02', day: '15' }
    const result = constructDateStrFromParts(validDateParts, false)
    expect(result).toEqual('2021-02-15T00:00:00.000')
  })

  it.each(['year', 'month', 'day'])('should return undefined if %s is an empty string', (datePart: string) => {
    const invalidDateParts = { year: '2021', month: '02', day: '01' }
    const result = constructDateStrFromParts({ ...invalidDateParts, [datePart]: '' })
    expect(result).toBeUndefined()
  })
})

describe('constructDatePartsFromDate', () => {
  it('should return undefined if input is undefined', () => {
    const result = constructDatePartsFromDate(undefined)
    expect(result).toBeUndefined()
  })

  it('should return undefined if input is null', () => {
    const result = constructDatePartsFromDate(null)
    expect(result).toBeUndefined()
  })

  it('should return correct date parts for a valid date', () => {
    const date = new Date(2023, 8, 9)
    const result = constructDatePartsFromDate(date)
    expect(result).toEqual({ year: '2023', month: '9', day: '9' })
  })
})

describe('areAllDatePartsEmpty', () => {
  it('should return true if all date parts are empty', () => {
    expect(areAllDatePartsEmpty({ day: '', month: '', year: '' })).toBe(true)
  })
  it('should return false if there exists a date part that is empty', () => {
    expect(areAllDatePartsEmpty({ day: '10', month: '', year: '' })).toBe(false)
  })
})
