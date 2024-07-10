import 'react-loading-skeleton/dist/skeleton.css'

import Skeleton from 'react-loading-skeleton'

export function OrganisationsListSkeleton() {
  return (
    <>
      <Skeleton
        baseColor="var(--colour-grey-10)"
        borderRadius={0}
        className="govuk-!-margin-top-3 govuk-!-margin-bottom-2"
        height={19}
        width={92}
      />
      {Array(20)
        .fill(null)
        .map((_, key) => (
          // eslint-disable-next-line react/no-array-index-key -- intended
          <div className="h-[65px] flex justify-between items-center" key={key}>
            <div>
              <Skeleton
                baseColor="var(--colour-grey-10)"
                borderRadius={0}
                height={19}
                style={{ lineHeight: 'inherit' }}
                width={220}
              />
              <Skeleton
                baseColor="var(--colour-grey-10)"
                borderRadius={0}
                height={19}
                style={{ lineHeight: 'inherit' }}
                width={58}
              />
            </div>
            <div>
              <Skeleton
                baseColor="var(--colour-grey-10)"
                borderRadius={0}
                className="mr-1"
                height={19}
                style={{ lineHeight: 'inherit' }}
                width={57}
              />
            </div>
          </div>
        ))}
    </>
  )
}
