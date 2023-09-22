import type { ReactElement } from 'react'
import { Container, StartIcon } from '@nihr-ui/frontend'
import { useSession, signIn, signOut } from 'next-auth/react'
import { RootLayout } from '../components/Layout/RootLayout'

export default function Home() {
  const { data: session } = useSession()

  return (
    <Container>
      {session ? (
        <>
          Signed in as {session.user?.email} <br />
          <button onClick={() => void signOut()} type="button">
            Sign out
          </button>
        </>
      ) : (
        <>
          Not signed in <br />
          <button onClick={() => void signIn()} type="button">
            {/* <button type="button" onClick={() => signIn('oidc')}> */}
            Sign in
          </button>
        </>
      )}
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">Assess progress of studies</h2>
          <p className="govuk-body">
            The NIHR CRN tracks the progress of research studies in its portfolio using data provided by study teams.
            Sponsors or their delegates need to assess if studies are on or off track and if any NIHR CRN support is
            needed.
          </p>
        </div>
        <div className="govuk-grid-column-one-third">
          <div className="bg-grey-50 p-4">
            <h3 className="govuk-heading-m">Get NIHR CRN support</h3>
            <p className="govuk-body">
              Sponsors or their delegates can get NIHR CRN support with their research study at any time.
            </p>
            <button className="govuk-button govuk-!-margin-bottom-0 govuk-button--start" type="button">
              Get support <StartIcon />
            </button>
          </div>
        </div>
      </div>
    </Container>
  )

  // return (
  //   <>
  //     <Container>
  //       <Button>Shared button component</Button>
  //     </Container>
  //   </>
  // )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <RootLayout heading="Assess progress of studies">{page}</RootLayout>
}
