import { forwardRef } from 'react'

export const HoneyPot = forwardRef<HTMLInputElement>(({ ...props }, ref) => {
  return (
    <>
      <label>
        <span className="sr-only">Label</span>
        <input
          ref={ref}
          // https://stackoverflow.com/a/30873633
          type="search"
          autoComplete="off"
          className="sr-only"
          defaultValue=""
          tabIndex={-1}
          {...props}
        />
      </label>
    </>
  )
})
