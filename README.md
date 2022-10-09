# Setup Kitten

![GitHub release](https://img.shields.io/github/v/release/fabasoad/setup-kitten-action?include_prereleases) ![Unit Tests](https://github.com/fabasoad/setup-kitten-action/workflows/Unit%20Tests/badge.svg) ![Functional Tests](https://github.com/fabasoad/setup-kitten-action/workflows/Functional%20Tests/badge.svg) ![Security Tests](https://github.com/fabasoad/setup-kitten-action/workflows/Security%20Tests/badge.svg) [![pre-commit.ci status](https://results.pre-commit.ci/badge/github/fabasoad/setup-kitten-action/main.svg)](https://results.pre-commit.ci/latest/github/fabasoad/setup-kitten-action/main) [![Total alerts](https://img.shields.io/lgtm/alerts/g/fabasoad/setup-kitten-action.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/fabasoad/setup-kitten-action/alerts/) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/fabasoad/setup-kitten-action.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/fabasoad/setup-kitten-action/context:javascript) [![Maintainability](https://api.codeclimate.com/v1/badges/62d48a0187e92fd63238/maintainability)](https://codeclimate.com/github/fabasoad/setup-kitten-action/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/62d48a0187e92fd63238/test_coverage)](https://codeclimate.com/github/fabasoad/setup-kitten-action/test_coverage) [![Known Vulnerabilities](https://snyk.io/test/github/fabasoad/setup-kitten-action/badge.svg?targetFile=package.json)](https://snyk.io/test/github/fabasoad/setup-kitten-action?targetFile=package.json)

This action sets up a [Kitten](http://kittenlang.org/).

## Example usage

Let's try to run `hello-world.ktn` file with the following content:

```haskell
"Hello World!" say
```

### Workflow configuration

```yaml
name: Setup Kitten

on: push

jobs:
  setup:
    name: Setup
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@main
      - uses: fabasoad/setup-kitten-action@main
      - name: Run script
        run: kitten ./hello-world.ktn
```

### Result

```shell
Run kitten ./hello-world.ktn
Hello World!
```
