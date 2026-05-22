module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.ts"],
  testMatch: ["**/tests/**/*.test.tsx"],
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
    "^@/lib/(.*)$": "<rootDir>/src/lib/$1",
    "^@/store/(.*)$": "<rootDir>/src/store/$1"
  }
};
