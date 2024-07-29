import clsx from 'clsx'
import { ElementType, ReactNode, forwardRef } from 'react'
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@nihr-ui/frontend/@types/components'

type NotificationBannerProps<C extends ElementType = ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    heading: string
    success?: boolean
    children: ReactNode
    className?: string
    isRichText?: boolean
  }
>

export const NotificationBanner = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, heading, children, success, className, isRichText = false, ...props }: NotificationBannerProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'div'

    return (
      <Component
        role={success ? 'alert' : 'region'}
        aria-labelledby="govuk-notification-banner-title"
        className={clsx(className, 'govuk-notification-banner', {
          'govuk-notification-banner--success': success,
        })}
        {...props}
      >
        <div className="govuk-notification-banner__header">
          <h2 className="govuk-notification-banner__title" id="govuk-notification-banner-title">
            {success ? 'Success' : 'Important'}
          </h2>
        </div>
        <div className="govuk-notification-banner__content">
          <p className="govuk-notification-banner__heading">{heading}</p>
          {isRichText ? children : <p className="govuk-body">{children}</p>}
        </div>
      </Component>
    )
  }
)
