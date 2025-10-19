import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "src/infra/database/migrations/**/*.js", // Arquivos de migração
      "test/**", // Todos os arquivos de teste
      "**/*.test.{js,ts}", // Arquivos de teste específicos
      "**/*.spec.{js,ts}", // Arquivos de spec
      "**/__mocks__/**", // Arquivos de mock
      "*.min.js",
      "jest.config.js",
    ],
    plugins: {
      "@typescript-eslint": typescript,
      prettier: prettier,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        global: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
      },
    },
    rules: {
      ...typescript.configs.recommended.rules,
      "prettier/prettier": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-useless-catch": "warn",
      "no-undef": "off",
    },
  },
];
