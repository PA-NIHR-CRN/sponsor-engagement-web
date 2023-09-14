import { HTMLProps, ReactNode } from 'react'

type ExternalLinkProps = HTMLProps<HTMLAnchorElement> & {
  href: string
  children: ReactNode
}

export const ExternalLink = ({ href, children, ...props }: ExternalLinkProps) => {
  return (
    <a href={href} target="_blank" {...props}>
      {children} <span className="govuk-visually-hidden">(Opens in a new window)</span>
    </a>
  )
}
