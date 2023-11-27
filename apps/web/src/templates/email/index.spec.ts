import { EXTERNAL_CRN_TERMS_CONDITIONS_URL, EXTERNAL_CRN_URL, SUPPORT_PAGE } from '../../constants/routes'
import emailTemplates from '.'

const templates = Object.keys(emailTemplates).filter((name) => name !== 'index.js')

test.each(templates)('Email template %p displays correctly', (key) => {
  const template = emailTemplates[key] as (data: Record<string, string>) => string
  expect(
    template({
      crnLink: EXTERNAL_CRN_URL,
      organisationName: 'Mocked org name',
      requestSupportLink: `http://localhost:3000${SUPPORT_PAGE}`,
      signInLink: 'http://localhost:3000/auth/signin',
      termsAndConditionsLink: EXTERNAL_CRN_TERMS_CONDITIONS_URL,
    })
  ).toMatchSnapshot()
})
