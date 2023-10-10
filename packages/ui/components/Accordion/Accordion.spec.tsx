import { render, screen } from '@testing-library/react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion'
import React from 'react'
import userEvent from '@testing-library/user-event'

describe('AccordionItem', () => {
  it('renders correctly', () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1">item content</AccordionItem>
      </Accordion>
    )
    expect(screen.getByText('item content')).toBeInTheDocument()
  })

  it('applies provided className', () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1" className="test-class">
          item content
        </AccordionItem>
      </Accordion>
    )
    expect(screen.getByText('item content')).toHaveClass('test-class')
  })

  it('forwards refs correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <Accordion type="single">
        <AccordionItem value="item-1" ref={ref}>
          item content
        </AccordionItem>
      </Accordion>
    )
    expect(ref.current).not.toBeNull()
  })
})

describe('AccordionItemTrigger', () => {
  it('applies provided className', () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger className="test-class">Test item trigger</AccordionTrigger>
          <AccordionContent>Test item content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    expect(screen.getByRole('button', { name: 'Test item trigger' })).toHaveClass('test-class')
  })

  it('forwards refs correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger ref={ref}>Test item trigger</AccordionTrigger>
          <AccordionContent>Test item content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    expect(ref.current).not.toBeNull()
  })

  it('with additional content next to the heading', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger sideContent={'Some extra content'}>Test item trigger</AccordionTrigger>
          <AccordionContent>Test item content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    expect(screen.getByText('Some extra content')).toBeInTheDocument()
  })
})

describe('AccordionItemContent', () => {
  it('applies provided className', async () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Test item trigger</AccordionTrigger>
          <AccordionContent className="test-class">Test item content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    await userEvent.click(screen.getByRole('button', { name: 'Test item trigger' }))

    expect(screen.getByRole('region')).toHaveTextContent('Test item content')
    expect(screen.getByRole('region')).toHaveClass('test-class')
  })

  it('forwards refs correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Test item trigger</AccordionTrigger>
          <AccordionContent ref={ref}>Test item content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    expect(ref.current).not.toBeNull()
  })
})
