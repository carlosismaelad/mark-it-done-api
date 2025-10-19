// Simplified Jest config inspired by Next.js approach
// Load environment variables
import { config } from "dotenv";
config({
  path: ".env.development",
});

export default {
  // ESM configuration for automatic CommonJS/ESM interoperability
  preset: "ts-jest/presets/default-esm",
  extensionsToTreatAsEsm: [".ts"],
  testEnvironment: "node",

  // Let Jest handle module resolution automatically
  moduleDirectories: ["node_modules", "<rootDir>"],

  // Test files location
  testMatch: ["<rootDir>/tests/**/*.test.ts"],

  // Transform configuration for ESM
  transform: {
    "^.+\\.(ts|js)$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          rootDir: ".",
        },
      },
    ],
  },

  // Transform ESM packages
  transformIgnorePatterns: ["node_modules/(?!(uuid|@faker-js/faker|set-cookie-parser)/)"],

  // Path mapping
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // Timeout for integration tests
  testTimeout: 60000,
};
