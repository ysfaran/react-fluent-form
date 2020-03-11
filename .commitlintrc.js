module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "test",
        "refactor",
        "perf",
        "docs",
        "ci",
        "chore",
        "build"
      ]
    ],
    "scope-enum": [
      2,
      "always",
      ["config", "dev", "form-config", "hooks", "fields", "typings"]
    ]
  }
};
