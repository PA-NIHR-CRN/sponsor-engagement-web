import { render } from '@testing-library/react'
import * as Icons from '.'

describe('NIHR Icon Set', () => {
  test.each(Object.keys(Icons))('Displays the %p correctly', async (key) => {
    const icon = await import(`./${key}`)
    const Component = icon[key]
    expect(render(<Component />).baseElement).toMatchSnapshot()
  })
})
