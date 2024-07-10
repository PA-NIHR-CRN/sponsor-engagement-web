import 'react-loading-skeleton/dist/skeleton.css'

import Skeleton from 'react-loading-skeleton'

export function StudiesListSkeleton() {
  return (
    <Skeleton
      baseColor="var(--colour-grey-10)"
      borderRadius={0}
      className="govuk-!-margin-bottom-3"
      containerTestId="study-skeleton"
      count={5}
      height={152}
      style={{ lineHeight: 'inherit' }}
      width="100%"
    />
  )
}
