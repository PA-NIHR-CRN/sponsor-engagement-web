import contentClient from './contentful'
import { getEntryById } from './contentfulService'

// Mock the contentClient and its getEntry method
jest.mock('./contentful', () => ({
  getEntry: jest.fn(),
}))

describe('getEntryById', () => {
  it('should return the entry when getEntry is successful', async () => {
    const mockEntry = { sys: { id: '123' }, fields: { title: 'Test Entry' } }
    ;(contentClient.getEntry as jest.Mock).mockResolvedValue(mockEntry)

    const entry = await getEntryById('123')

    expect(entry).toEqual(mockEntry)
    expect(contentClient.getEntry).toHaveBeenCalledWith('123')
  })

  it('should throw an error when getEntry fails', async () => {
    ;(contentClient.getEntry as jest.Mock).mockRejectedValue(new Error('Entry not found'))

    await expect(getEntryById('invalid-id')).rejects.toThrow('Entry not found')
    expect(contentClient.getEntry).toHaveBeenCalledWith('invalid-id')
  })
})
