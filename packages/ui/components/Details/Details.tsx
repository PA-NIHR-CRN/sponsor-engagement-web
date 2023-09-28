import clsx from 'clsx'
import { ElementType, ReactNode, forwardRef } from 'react'
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@nihr-ui/frontend/@types/components'

type DetailsProps<C extends ElementType = ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    heading: string
    children: ReactNode
    className?: string
  }
>

export const Details = forwardRef(
  <C extends React.ElementType = 'details'>(
    { as, heading, children, className, ...props }: DetailsProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'details'

    return (
      <Component ref={ref} className={clsx(className, 'govuk-details govuk-!-margin-bottom-4')} {...props}>
        <summary className="govuk-details__summary">
          <span className="govuk-details__summary-text">{heading}</span>
        </summary>
        <div className="govuk-details__text [&>*>p:last-child]:mb-0">{children}</div>
      </Component>
    )
  }
)
