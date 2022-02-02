const path = require('path');

const collectCoverageFrom = [
  '**/*.{js,jsx,ts,tsx}',
  '!**/*.stories.{jsx,tsx}',
  '!**/*.config.js',
  '!**/*.test.{js,jsx}',
  '!./test/**',
  '!.eslintrc.js',
  '!./.storybook/**',
  '!**/*.dynamic.**',
];


const common = {
  clearMocks: true,
  verbose: false,
  watchPathIgnorePatterns: ['/node_modules/', '/.vscode/'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  roots: ['./'],
  coverageProvider: 'v8',
  coverageReporters: ['html', 'text', 'json', 'xml'],
  coveragePathIgnorePatterns: ['/node_modules/', '/.vscode/', '/.git/'],
  moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'mjs', 'ts', 'tsx'],
};

module.exports = {
  collectCoverageFrom,
  // Add this in at some point
  // coverageThreshold: {
  //   global: {
  //     statements: 0.00,
  //     branches: 0.00,
  //     lines: 0.00,
  //     functions: 0.00,
  //   },
  // },
  projects: [
    {
      ...common,
      displayName: 'Unit: Server',
      testRegex: '\\.server\\.test\\.jsx?$',
      testEnvironment: 'node',
    },
    {
      ...common,
      displayName: 'Unit: Client',
      testRegex: '\\.client\\.test\\.jsx?$',
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: [
        "<rootDir>/src/setup-tests.ts"
      ],
      moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/jest/file-mock.js",
        "\\.(css|less)$": "<rootDir>/client/__mocks__/jest/style-mock.js"
      }
    },
  ],
};
