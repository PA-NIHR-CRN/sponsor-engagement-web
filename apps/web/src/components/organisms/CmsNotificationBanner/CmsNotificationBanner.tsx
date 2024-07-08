import type { Document } from '@contentful/rich-text-types'
import { NotificationBanner } from '@nihr-ui/frontend'
import type { Entry } from 'contentful'

import type { TypeBannerSkeleton } from '@/@types/generated'
import { RichTextRenderer } from '@/utils/Renderers/RichTextRenderer/RichTextRenderer'

interface CmsNotificationBannerProps {
  entry: Entry<TypeBannerSkeleton> | null
}

function CmsNotificationBanner({ entry }: CmsNotificationBannerProps) {
  if (!entry) {
    return null
  }

  const bannerBody = entry.fields.bannerBody as Document | undefined

  if (!bannerBody) {
    return null
  }

  return (
    <NotificationBanner heading={entry.fields.bannerTitle} isRichText>
      <RichTextRenderer>{bannerBody}</RichTextRenderer>
    </NotificationBanner>
  )
}

export default CmsNotificationBanner
