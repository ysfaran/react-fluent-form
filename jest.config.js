module.exports = {
  roots: [
    "<rootDir>/test",
    "<rootDir>/src" // needed so test:watch re-runs tests if file in src/ changes
  ],
  testMatch: ["**/__tests__/**/*.+(ts|tsx)", "**/?(*.)+(spec|test).+(ts|tsx)"],
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest"
  },
  collectCoverageFrom: ["src/**/*.+(ts|tsx)", "!src/index.ts"],
  setupFilesAfterEnv: ["<rootDir>/test/setupTests.ts"],
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.test.json"
    }
  }
};
