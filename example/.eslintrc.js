module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
  },
  ignorePatterns: ['.eslintrc.js', 'webpack.renderer.additions.js'],
  env: {
    browser: true,
    node: true,
  },
  globals: {
    __static: true,
  },

  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-typescript',
    'plugin:react/jsx-runtime',
    'plugin:import/recommended',
  ],
  rules: {
    '@typescript-eslint/semi': 0,
    '@typescript-eslint/comma-dangle': 0,
    'import/no-extraneous-dependencies': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/brace-style': 0,
  },
}
