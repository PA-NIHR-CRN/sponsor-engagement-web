import { EXTERNAL_CRN_TERMS_CONDITIONS_URL, EXTERNAL_CRN_URL, SUPPORT_PAGE } from '../../constants'
import emailTemplates from '.'

const templates = emailTemplates as Record<string, (data: Record<string, string>) => string>

const templateKeys = Object.keys(emailTemplates)

test.each(templateKeys)('Email template %p displays correctly', (key) => {
  const template = templates[key]
  expect(
    template({
      crnLink: EXTERNAL_CRN_URL,
      iconUrl: 'http://localhost:3000/assets/images/exclamation-icon.png',
      requestSupportLink: `http://localhost:3000${SUPPORT_PAGE}`,
      signInLink: 'http://localhost:3000/auth/signin',
      termsAndConditionsLink: EXTERNAL_CRN_TERMS_CONDITIONS_URL,
    })
  ).toMatchSnapshot()
})
