module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    complexity: ['error', 10],
    'max-depth': ['error', 3],
    '@typescript-eslint/no-explicit-any': 'error',
  },
};
