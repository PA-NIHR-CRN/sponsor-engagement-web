const path = require('path')

const buildEslintCommand = (filenames) => `turbo run lint:fix`

const buildPrettierCommand = (filenames) =>
  `npx prettier --write ${filenames.map((f) => path.relative(process.cwd(), f)).join(' ')}`

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand, buildPrettierCommand],

  // Prettify only Markdown and JSON files
  '**/*.(md|json)': [buildPrettierCommand],
}
