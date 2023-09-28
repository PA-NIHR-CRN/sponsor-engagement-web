import { expect, test } from '../../../hooks/CustomFixtures'

test.describe('Accessibility Tests - @accessibility', () => {
  test('Scan Home Page with AXE Tool access_Home', async ({ homePage, makeAxeBuilder }, testInfo) => {
    const axeScanner = makeAxeBuilder()
    let axeScanResults = await axeScanner.analyze()
    await test.step('Given I have navigated to the Home Page', async () => {
      await homePage.goto()
      await homePage.assertOnHomePage()
    })

    await test.step('When I scan the Home Page for Accessibility Errors', async () => {
      axeScanResults = await axeScanner
        .options({ reporter: 'v2' })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
    })

    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(axeScanResults, null, 2),
      contentType: 'application/json',
    })

    await test.step('Then I should recieve no issue up to WCAG 2.1 AA Standard', async () => {
      expect(axeScanResults.violations).toEqual([])
    })
  })
})
