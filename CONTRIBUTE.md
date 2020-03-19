# How to contribute

1. Fork the project
2. Create a new branch from `master`
   - For features: `feature/<meaningful_name>`
   - For fixes: `hotfix/<meaningful_name>`
   - Everything that is not a fix is considered as a feature here
3. Do changes on the new branch
4. Execute `npm run test:package` to **verify that your changes didn't break any tests**
5. Commit changes

   - Commit messages **need** follow the [Conventional Commit Specification](https://www.conventionalcommits.org/)
   - Allowed types:
     | **type** | **description** | **release** |
     | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
     | `feat` | any kind of feature that affects users | `MINOR` |
     | `fix` | any kind of bug fix that affects users | `PATCH` |
     | `test` | test file/configuration only changes (ideally `feat` and `fix` commits already come with tests, but they don't have to) | |
     | `refactor` | refactoring code (should never contain features or bug fixes!) | |
     | `perf` | changes that improve the performance | `PATCH` |
     | `docs` | markdown file changes | `PATCH`, when scope is `readme` |
     | `ci` | fixing or improving CI/CD (e.g. adapting `.travis.yml` ) | |
     | `chore` | no production code changes, which can not be described with types like `ci` or `build` (e.g. adapting `.gitignore` or adding new script to `package.json` ) | |
     | `build` | changes that affect the build (e.g. adapting `rollup.config.js` or adding/removing dependencies) | `PATCH` |
   - Allowed scopes:
     | **scope** | **description** |
     |---------------|---------------------------------------------------------------------------------------------------|
     | `config` | adapting config files outside of `src/` (usually they are in the root folder) |
     | `dev` | changes that only affect developers/contributors of this project (e.g. adapting commitlint rules) |
     | `form-config` | adapting/adding configuration for form hooks |
     | `hooks` | adapting/adding exported hooks (e.g. `useFluentForm`) |
     | `fields` | adapting/adding fields |
     | `typings` | adapting/adding typings |
     | `readme` | adapting `README.md`, should only be used with type `docs` |
     - If a commit addresses **more than one scope**, the scope should be the **most relevant one** for that commit (e.g. you added a new configuration option for hooks, but you just needed to make a minor change to the hook itself, then the scope should be `form-config` not `hooks`)
     - The scope **can be omitted** when the commit addresses **too many** scopes in the same way
     - Feel free to suggest more types and scopes! - See commit history for examples

6. Push branch and create pull request to `master` branch
7. Wait for comment/approval of maintainers
8. Good job and thank you very much! You just contributed!
