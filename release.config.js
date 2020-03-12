module.exports = {
  prepare: [
    "@semantic-release/changelog",
    "@semantic-release/npm",
    {
      path: "@semantic-release/git",
      assets: ["package.json", "package-lock.json", "CHANGELOG.md"],
      message: "Release: ${nextRelease.version}\n\n${nextRelease.notes}"
    }
  ],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "angular",
        releaseRules: [{ type: "build", release: "patch" }]
      }
    ],
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    "@semantic-release/git",
    "@semantic-release/changelog"
  ]
};
