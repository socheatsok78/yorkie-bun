'use strict'

const normalize = require('normalize-path')
const stripIndent = require('strip-indent')
const pkg = require('../../package.json')

module.exports = function getHookScript(hookName, relativePath, runnerPath) {
  // On Windows normalize path (i.e. convert \ to /)
  const normalizedPath = normalize(relativePath)

  const noVerifyMessage =
    hookName === 'prepare-commit-msg'
      ? '(cannot be bypassed with --no-verify due to Git specs)'
      : '(add --no-verify to bypass)'

  return [
    stripIndent(
      `
      #!/bin/sh
      #yorkie ${pkg.version}

      has_hook_script () {
        [ -f package.json ] && cat package.json | grep -q "\\"$1\\"[[:space:]]*:"
      }

      cd "${normalizedPath}"

      # Check if ${hookName} is defined, skip if not
      has_hook_script ${hookName} || exit 0`
    ).trim(),

    stripIndent(
      `
      # Export Git hook params
      export GIT_PARAMS="$*"

      # Run hook
      bun run "${runnerPath}" ${hookName} || {
        echo
        echo "${hookName} hook failed ${noVerifyMessage}"
        exit 1
      }
      `
    )
  ].join('\n')
}
