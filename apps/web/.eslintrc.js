module.exports = {
  extends: ['custom/next'],
  ignorePatterns: ['node_modules/', 'dist/', 'src/@types/generated/*.ts'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    'no-restricted-imports': [
      'error',
      {
        name: '@testing-library/react',
        importNames: ['render'],
        message:
          "Please use the 'render' export from 'config/TestUtils.tsx' instead. This injects the provider components needed to render our pages.",
      },
    ],
  },
}
