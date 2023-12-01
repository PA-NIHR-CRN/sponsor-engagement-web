import { emailTemplates } from '.'

const expectedTemplates = [
  'assessment-reminder.html.hbs',
  'assessment-reminder.text.hbs',
  'contact-assigned.html.hbs',
  'contact-assigned.text.hbs',
  'contact-removed.html.hbs',
  'contact-removed.text.hbs',
] as const

describe('sponsor engagement templates', () => {
  it('should export email templates', () => {
    expect(emailTemplates).toBeDefined()
    expectedTemplates.forEach((template) => {
      expect(emailTemplates[template]).toBeDefined()
    })
  })
})
