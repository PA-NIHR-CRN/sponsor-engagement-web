module.exports = {
  extends: ['custom/library'],
  overrides: [
    {
      files: ['**/*.spec.ts'],
      plugins: ['jest'],
      rules: {
        // you should turn the original rule off *only* for test files
        '@typescript-eslint/unbound-method': 'off',
        'jest/unbound-method': 'error',
      },
    },
  ],
}
