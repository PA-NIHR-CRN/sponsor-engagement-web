import { Container } from '@nihr-ui/frontend'
import type { ReactElement } from 'react'

import { RootLayout } from '@/components/organisms'

export default function EditStudyPage() {
  return <Container>Edit your study page!</Container>
}

EditStudyPage.getLayout = function getLayout(page: ReactElement) {
  return <RootLayout>{page}</RootLayout>
}
