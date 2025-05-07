import emailTemplates from '.'

const templates = emailTemplates as Record<string, (data: Record<string, string | string[]>) => string>

const templateKeys = Object.keys(emailTemplates)

test.each(templateKeys)('Email template %p displays correctly', (key) => {
  const template = templates[key]
  expect(
    template({
      rdnLink: 'http://rdn-link',
      iconUrl: 'http://localhost:3000/assets/images/exclamation-icon.png',
      requestSupportLink: `http://localhost:3000/request-support`,
      signInLink: 'http://localhost:3000/auth/signin',
      termsAndConditionsLink: 'http://terms-conditions-link',
      organisationName: 'Mocked org name',
      organisationNames: ['Mocked org name', 'Mocked second org name'],
      sponsorEngagementTool: 'http://localhost:3000',
      recipientEmailAddress: 'test@test.nihr.ac.uk',
    })
  ).toMatchSnapshot()
})
