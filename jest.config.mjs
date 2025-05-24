/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { diagnostics: { ignoreCodes: ['TS151001'] } }]
  },
  coverageDirectory: 'coverage',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts']
}
