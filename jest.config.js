export default {
  // Configuration for TypeScript + ES Modules
  preset: "ts-jest/presets/default-esm",
  extensionsToTreatAsEsm: [".ts"],
  testEnvironment: "node",

  // Where to look for tests (in your test/ folder)
  testMatch: ["<rootDir>/test/**/*.test.ts"],

  // Mock problematic ES Modules
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^node-pg-migrate$": "<rootDir>/test/__mocks__/node-pg-migrate.js",
  },

  // How to transform TypeScript files
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
};
