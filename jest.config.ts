import type { JestConfigWithTsJest } from "ts-jest";

export const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  collectCoverageFrom: ["src/**/*.+(ts|tsx)", "!src/index.ts"],
  setupFilesAfterEnv: ["<rootDir>/test/setupTests.ts"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          noUnusedLocals: false,
        },
      },
    ],
  },
} as JestConfigWithTsJest;

export default config;
