module.exports = {
  prepare: [
    "@semantic-release/changelog",
    "@semantic-release/npm",
    {
      path: "@semantic-release/git",
      assets: ["package.json", "package-lock.json", "CHANGELOG.md"],
      message: "Release: ${nextRelease.version}\n\n${nextRelease.notes}",
    },
  ],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        releaseRules: [
          { type: "feat", release: "minor" },
          { type: "fix", release: "patch" },
          { type: "perf", release: "patch" },
          { type: "docs", scope: "readme", release: "patch" },
          { type: "build", release: "patch" },
        ],
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        presetConfig: {
          types: [
            { type: "feat", section: "Features" },
            { type: "fix", section: "Bug Fixes" },
            { type: "test", section: "Tests", hidden: true },
            { type: "refactor", section: "Code Refactoring", hidden: true },
            { type: "perf", section: "Performance Improvements" },
            { type: "docs", section: "Documentation" },
            { type: "ci", section: "Continuous Integration", hidden: true },
            { type: "chore", section: "Miscellaneous Chores", hidden: true },
            { type: "build", section: "Build" },
          ],
        },
      },
    ],
    "@semantic-release/npm",
    "@semantic-release/git",
    "@semantic-release/changelog",
  ],
};
