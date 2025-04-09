const path = require('path')

module.exports = {
  extends: ['custom/library'],
  ignorePatterns: ['node_modules/', 'dist/', 'coverage/', 'jest.config.ts'],
  parserOptions: {
    project: [path.join(__dirname, 'tsconfig.eslint.json')],
    ecmaVersion: 11,
  },
  overrides: [
    {
      files: ['**/*.spec.ts'],
      plugins: ['jest'],
      rules: {
        '@typescript-eslint/unbound-method': 'off',
        'jest/unbound-method': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
      },
    },
  ],
  rules: {
    'unicorn/prefer-node-protocol': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unsafe-enum-comparison': 'off',
  },
}
