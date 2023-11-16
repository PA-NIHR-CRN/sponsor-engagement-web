import { screen, render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './Dropdown'

const getComponent = () => (
  <DropdownMenu>
    <DropdownMenuTrigger>Toggle</DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>Menu item 1</DropdownMenuItem>
      <DropdownMenuItem>Menu item 2</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

describe('Toggling the dropdown menu open', () => {
  test('When clicking the trigger', async () => {
    render(getComponent())

    const trigger = screen.getByRole('button', { name: 'Toggle', expanded: false })
    const menu = screen.queryByRole('menu', { name: 'Toggle' })

    expect(menu).not.toBeInTheDocument()

    await userEvent.click(trigger)

    const openMenu = screen.getByRole('menu', { name: 'Toggle' })
    expect(openMenu).toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    expect(within(openMenu).getByRole('menuitem', { name: 'Menu item 1' })).toBeVisible()
    expect(within(openMenu).getByRole('menuitem', { name: 'Menu item 2' })).toBeVisible()
  })

  test('When pressing spacebar', async () => {
    render(getComponent())

    const trigger = screen.getByRole('button', { name: 'Toggle', expanded: false })
    const menu = screen.queryByRole('menu', { name: 'Toggle' })

    expect(menu).not.toBeInTheDocument()

    await trigger.focus()
    await userEvent.keyboard(' ')

    const openMenu = screen.getByRole('menu', { name: 'Toggle' })
    expect(openMenu).toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  test('When pressing enter', async () => {
    render(getComponent())

    const trigger = screen.getByRole('button', { name: 'Toggle', expanded: false })
    const menu = screen.queryByRole('menu', { name: 'Toggle' })

    expect(menu).not.toBeInTheDocument()

    await trigger.focus()
    await userEvent.keyboard('{Enter}')

    const openMenu = screen.getByRole('menu', { name: 'Toggle' })
    expect(openMenu).toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })
})

describe('Toggling the dropdown menu closed', () => {
  test('When clicking a menu item', async () => {
    render(getComponent())

    const trigger = screen.getByRole('button', { name: 'Toggle', expanded: false })
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    const openMenu = screen.getByRole('menu', { name: 'Toggle' })
    await userEvent.click(within(openMenu).getByRole('menuitem', { name: 'Menu item 1' }))

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('menu', { name: 'Toggle' })).not.toBeInTheDocument()
  })

  test('When pressing escape', async () => {
    render(getComponent())

    const trigger = screen.getByRole('button', { name: 'Toggle', expanded: false })
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    const openMenu = screen.getByRole('menu', { name: 'Toggle' })
    await userEvent.keyboard('{Escape}')

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('menu', { name: 'Toggle' })).not.toBeInTheDocument()
  })
})
