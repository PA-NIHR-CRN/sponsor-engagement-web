import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'

import cn from 'clsx'

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn('border-b border-grey-120', className)} {...props} />
))
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & { sideContent?: React.ReactNode }
>(({ className, children, sideContent, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'focusable text-left md:flex gap-3 items-center py-2 [&:hover]:bg-grey-50 [&:hover>div]:text-[var(--text-grey)] [&:hover>div>span]:text-white [&:hover>div>span]:bg-[var(--text-grey)] [&[data-state=closed]>div>span]:rotate-180 w-full outline-none',
        className
      )}
      {...props}
    >
      <div className="flex items-center text-[var(--colour-blue)] font-bold max-w-[222px] w-full text-left">
        <span className="govuk-accordion-nav__chevron govuk-accordion-nav__chevron mr-3" />
        {children}
      </div>
      {sideContent && <span className="ml-[35px] md:ml-0 govuk-body-s mb-0">{sideContent}</span>}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & { indent?: boolean }
>(({ className, children, indent, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn('overflow-hidden govuk-body-s mb-0 ml-[35px]', className, {
      'md:ml-[calc(222px+15px)]': indent,
    })}
    {...props}
  >
    <div className="py-2">{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
