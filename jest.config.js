export default {
  // Configuration for TypeScript + ES Modules
  preset: "ts-jest/presets/default-esm",
  extensionsToTreatAsEsm: [".ts"],
  testEnvironment: "node",

  // Load environment variables for tests
  setupFiles: ["<rootDir>/tests/setup.ts"],

  // Where to look for tests (in your tests/ folder)
  testMatch: ["<rootDir>/tests/**/*.test.ts"],

  // Transform ES Modules from node_modules
  transformIgnorePatterns: ["node_modules/(?!(uuid|@faker-js/faker|set-cookie-parser|node-pg-migrate)/)"],

  // Mock problematic ES Modules
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^../src/api/v1/migrations/service/migrations-service$": "<rootDir>/tests/__mocks__/migrations-service-mock.ts",
  },

  // How to transform TypeScript files
  transform: {
    "^.+\\.(ts|js)$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
};
