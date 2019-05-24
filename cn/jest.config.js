module.exports = {
  testPathIgnorePatterns: [
    "/__tests__/utils/"
  ],
  setupFiles: [
    "<rootDir>/__tests__/utils/mock.js"
  ],
  testEnvironment: 'jsdom'
}
