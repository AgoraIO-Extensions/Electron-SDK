module.exports = {
	globals: {
		'ts-jest': {
			tsConfigFile: 'tsconfig.json'
		}
  },
  testPathIgnorePatterns: [
    "/__tests__/utils/"
  ],
  setupFiles: [
    "<rootDir>/__tests__/utils/mock.js"
  ],
	moduleFileExtensions: [
		'ts',
		'js'
	],
	transform: {
		'^.+\\.(ts|tsx)$': './node_modules/ts-jest/preprocessor.js'
	},
  testEnvironment: 'jsdom'
}
