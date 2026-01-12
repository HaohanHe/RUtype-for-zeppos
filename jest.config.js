module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  transform: {},
  moduleFileExtensions: ['js'],
  collectCoverageFrom: [
    'data-widget/**/*.js',
    '!data-widget/**/*.test.js'
  ],
  verbose: true
};