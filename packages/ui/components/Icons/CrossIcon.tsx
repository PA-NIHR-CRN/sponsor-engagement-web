import clsx from 'clsx'

type CrossIconProps = {
  className?: string
}

export function CrossIcon({ className }: CrossIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={clsx(className, 'h-[1em] w-[1em]')}
      fill="none"
      aria-hidden
      data-testid="icon-cross"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M18 6L6 18M6 6l12 12"
      ></path>
    </svg>
  )
}
