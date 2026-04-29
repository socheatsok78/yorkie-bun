# yorkie-bun

> Git hooks made easy for bun

This is a fork of [yorkie](https://github.com/yyx990803/yorkie) with a few changes:

- Designed to work with `bun` instead of `nodejs`.

- Prioritizes `package.json` located next to `.git` directory, instead of hard-coded upward search. This avoids the problem when a root package in a lerna monorepo and a sub package both depends on husky, it gets confused and double-updates the root git hooks with wrong paths.

- Changed where hooks are read from in `package.json`:

  **Before**

  ``` json
  {
    "scripts": {
      "precommit": "bunx --bun foo"
    }
  }
  ```

  **After**

  ``` json
  {
    "gitHooks": {
      "pre-commit": "bunx --bun foo"
    }
  }
  ```
