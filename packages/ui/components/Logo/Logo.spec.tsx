import { render, within } from '@testing-library/react'

import { LogoImage, LogoLink } from './Logo'

describe('Logo image', () => {
  test('Displays with default attributes', () => {
    const { getByAltText } = render(<LogoImage src="/example.svg" />)

    const img = getByAltText('National Institute for Health and Care Research logo')
    expect(img).toHaveAttribute('height', '18')
    expect(img).toHaveAttribute('width', '154')
    expect(img).toHaveAttribute('src', '/example.svg')

    const div = img.parentElement
    expect(div).toHaveClass('flex items-center gap-2')

    const span = div?.parentElement
    expect(span).toHaveClass('govuk-header__logotype')
  })

  test('Custom class name', () => {
    const { getByAltText } = render(<LogoImage src="/example.svg" className="custom-class" />)
    const img = getByAltText('National Institute for Health and Care Research logo')
    expect(img).toHaveClass('custom-class')
  })

  test('Custom ref', () => {
    const refMock = jest.fn()
    const { getByAltText } = render(<LogoImage src="/example.svg" ref={refMock} />)
    const img = getByAltText('National Institute for Health and Care Research logo')
    expect(refMock).toHaveBeenCalledWith(img)
  })
})

describe('Logo link', () => {
  test('Displays with default attributes', () => {
    const { getByRole } = render(<LogoLink href="/example">example</LogoLink>)
    const link = getByRole('link', { name: 'Go to n i h r .ac.uk (opens in new tab)' })
    expect(link).toHaveClass('govuk-header__link govuk-!-margin-left-4')
    expect(link).toHaveAttribute('href', '/example')
    expect(link).toHaveAttribute('target', '_blank')
    expect(within(link).getByText('example')).toBeInTheDocument()
  })

  test('Custom class name', () => {
    const { getByRole } = render(
      <LogoLink href="/example" className="custom-class">
        example
      </LogoLink>
    )
    const link = getByRole('link', { name: 'Go to n i h r .ac.uk (opens in new tab)' })
    expect(link).toHaveClass('custom-class')
  })

  test('Custom ref', () => {
    const refMock = jest.fn()
    const { getByRole } = render(
      <LogoLink href="/example" ref={refMock}>
        example
      </LogoLink>
    )
    const link = getByRole('link', { name: 'Go to n i h r .ac.uk (opens in new tab)' })
    expect(refMock).toHaveBeenCalledWith(link)
  })
})
