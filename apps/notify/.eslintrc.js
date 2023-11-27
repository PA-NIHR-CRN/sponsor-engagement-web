module.exports = {
  extends: ['custom/library'],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'coverage/',
    'jest.config.ts',
    'src/templates/**/*.js',
    '**/*.spec.ts',
    'src/mocks/**/*',
  ],
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
  },
}
