# Required CI check

The workflow exposes one aggregate check named **CI / Required**. It fails when
any backend, frontend, E2E, Docker build, or Trivy scan job does not pass.

To block merges when CI fails, configure the repository's default branch:

1. Open **Settings → Rules → Rulesets** in GitHub.
2. Create or edit a branch ruleset targeting the default branch.
3. Enable **Require status checks to pass**.
4. Add **CI / Required** as a required status check.
5. Enable **Require branches to be up to date before merging** if desired.
6. Set the ruleset to **Active**.

GitHub repository rules are not stored in the workflow file, so this one-time
repository setting is required for merge blocking.
