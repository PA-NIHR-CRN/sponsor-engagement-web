import { render as renderWithoutProviders } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { render, within } from '@/config/test-utils'

import { SideNavLink, SideNavMain, SideNavPanel, SideNavProvider, SideNavTrigger } from './SideNav'

jest.mock('next/router', () => require('next-router-mock'))

const getComponent = () => (
  <>
    <SideNavTrigger />
    <SideNavPanel>
      <h3>Example heading</h3>
      <SideNavLink href="/example">Example link</SideNavLink>
    </SideNavPanel>
  </>
)

const COLLAPSED_CLASS = 'w-[var(--side-nav-width-collapsed)]'
const EXPANDED_CLASS = 'w-[var(--side-nav-width-expanded)]'

describe('Toggling the side navigation menu', () => {
  test('When clicking the menu icon button', async () => {
    const { getByRole, queryByRole } = render(getComponent())

    const trigger = getByRole('button', { name: 'Show navigation menu' })
    const closedMenu = queryByRole('navigation', { name: 'Navigation menu' })

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(closedMenu).not.toBeInTheDocument()

    await userEvent.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    const openMenu = getByRole('navigation', { name: 'Main application links' })
    expect(openMenu).toBeVisible()

    expect(within(openMenu).getByRole('heading', { name: 'Example heading' })).toBeVisible()
    expect(within(openMenu).getByRole('link', { name: 'Example link' })).toHaveAttribute('href', '/example')
  })

  test('When using the enter/space keyboard keys', async () => {
    const { getByRole, queryByRole } = render(getComponent())

    const trigger = getByRole('button', { name: 'Show navigation menu' })
    trigger.focus()

    expect(queryByRole('navigation', { name: 'Main application links' })).toHaveClass(COLLAPSED_CLASS)

    // Open with enter key
    await userEvent.keyboard(' ')
    expect(getByRole('navigation', { name: 'Main application links' })).toHaveClass(EXPANDED_CLASS)

    // Close with enter key
    await userEvent.keyboard('{Enter}')
    expect(queryByRole('navigation', { name: 'Main application links' })).toHaveClass(COLLAPSED_CLASS)

    // Open with space key
    await userEvent.keyboard(' ')
    expect(getByRole('navigation', { name: 'Main application links' })).toHaveClass(EXPANDED_CLASS)

    // Close with space key
    await userEvent.keyboard(' ')
    expect(queryByRole('navigation', { name: 'Main application links' })).toHaveClass(COLLAPSED_CLASS)
  })
})

describe('Side navigation supports being forced hidden', () => {
  test('Main content component no longer needs additional padding', () => {
    const { getByRole } = render(
      <SideNavProvider forceHidden>
        <SideNavTrigger />
        <SideNavMain>content</SideNavMain>
      </SideNavProvider>
    )

    expect(getByRole('main')).not.toHaveClass('pl-[var(--side-nav-width-collapsed)]')
  })

  test('Trigger button displays as a link with a home icon instead', () => {
    const { getByRole, queryByRole, getByTestId } = render(
      <SideNavProvider forceHidden>
        <SideNavTrigger href="/test" />
      </SideNavProvider>
    )

    const trigger = getByRole('link', { name: 'Go to homepage' })

    expect(trigger).not.toHaveAttribute('aria-expanded')
    expect(trigger).not.toHaveAttribute('aria-controls')
    expect(trigger).toHaveAttribute('href', '/test')
    expect(getByTestId('home-icon')).toBeInTheDocument()

    // With component composition, we can simply skip rendering of the <SideNavPanel>
    const menu = queryByRole('navigation', { name: 'Main application links' })
    expect(menu).not.toBeInTheDocument()
  })
})

describe('<SideNavProvider>', () => {
  test('Works as an uncontrolled component', async () => {
    const { getByRole } = renderWithoutProviders(
      <SideNavProvider>
        <SideNavTrigger />
      </SideNavProvider>
    )
    const trigger = getByRole('button', { name: 'Show navigation menu' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  test('Works as an externally controlled component', async () => {
    const props = { open: false, setOpen: jest.fn() }

    const { getByRole } = renderWithoutProviders(
      <SideNavProvider {...props}>
        <SideNavTrigger />
      </SideNavProvider>
    )
    const trigger = getByRole('button', { name: 'Show navigation menu' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(trigger)
    expect(props.setOpen).toHaveBeenCalledWith(true)
  })
})

describe('<SideNavPanel>', () => {
  test('Has an expanded class when open', () => {
    const { getByRole } = renderWithoutProviders(
      <SideNavProvider open>
        <SideNavPanel>Links</SideNavPanel>
      </SideNavProvider>
    )
    expect(getByRole('navigation', { name: 'Main application links' })).toHaveClass(
      'w-[var(--side-nav-width-expanded)]'
    )
  })

  test('Has a collapsed class when not open', () => {
    const { getByRole } = renderWithoutProviders(
      <SideNavProvider>
        <SideNavPanel>Links</SideNavPanel>
      </SideNavProvider>
    )
    expect(getByRole('navigation', { name: 'Main application links' })).toHaveClass(
      'w-[var(--side-nav-width-collapsed)]'
    )
  })

  test('Can override the element type and props', () => {
    const { getByRole } = renderWithoutProviders(
      <SideNavProvider>
        <SideNavPanel as="section" role="section" aria-label="New panel name">
          Links
        </SideNavPanel>
      </SideNavProvider>
    )
    expect(getByRole('section', { name: 'New panel name' })).toBeInTheDocument()
  })
})

describe('<SideNavMain>', () => {
  test('Uses the gov.uk design system attributes', () => {
    const { getByRole } = render(<SideNavMain>Content</SideNavMain>)
    expect(getByRole('main')).toHaveClass('govuk-main-wrapper')
    expect(getByRole('main')).toHaveAttribute('id', 'main-content')
  })

  test('Has additional left hand padding to offset the width of the collapsed side nav', () => {
    const { getByRole, rerender } = renderWithoutProviders(
      <SideNavProvider open>
        <SideNavMain>Content</SideNavMain>
      </SideNavProvider>
    )
    expect(getByRole('main')).toHaveClass('pl-[var(--side-nav-width-collapsed)]')

    rerender(
      <SideNavProvider>
        <SideNavMain>Content</SideNavMain>
      </SideNavProvider>
    )
    expect(getByRole('main')).toHaveClass('pl-[var(--side-nav-width-collapsed)]')
  })

  test('Can override the element type and props', () => {
    const { getByRole } = render(
      <SideNavMain as="div" role="section" id="new-id">
        Content
      </SideNavMain>
    )
    expect(getByRole('section')).toHaveAttribute('id', 'new-id')
  })
})

describe('<SideNavLink>', () => {
  test('Uses the gov.uk design system class', () => {
    const { getByRole } = render(<SideNavLink href="/example">Example Link</SideNavLink>)
    expect(getByRole('link', { name: 'Example Link' })).toHaveClass('govuk-link')
    expect(getByRole('link', { name: 'Example Link' })).toHaveAttribute('href', '/example')
    expect(getByRole('link', { name: 'Example Link' })).not.toHaveClass(
      'w-[calc(var(--side-nav-width-expanded) - 1.5rem)]'
    )
  })

  test('Has increased width when the side nav is expanded', () => {
    const { getByRole } = renderWithoutProviders(
      <SideNavProvider open>
        <SideNavLink href="/example">Example Link</SideNavLink>
      </SideNavProvider>
    )
    expect(getByRole('link', { name: 'Example Link' })).toHaveClass('w-[calc(var(--side-nav-width-expanded) - 1.5rem)]')
  })

  test('Can override the element type and props', () => {
    const { getByRole } = render(
      <SideNavLink as="button" href={undefined} id="new-id">
        Example
      </SideNavLink>
    )
    expect(getByRole('button', { name: 'Example' })).not.toHaveAttribute('href')
    expect(getByRole('button', { name: 'Example' })).toHaveAttribute('id', 'new-id')
  })
})
