# Setup Kitten

[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://stand-with-ukraine.pp.ua)
![GitHub release](https://img.shields.io/github/v/release/fabasoad/setup-kitten-action?include_prereleases)
![Functional Tests](https://github.com/fabasoad/setup-kitten-action/workflows/Functional%20Tests/badge.svg)
[![pre-commit.ci status](https://results.pre-commit.ci/badge/github/fabasoad/setup-kitten-action/main.svg)](https://results.pre-commit.ci/latest/github/fabasoad/setup-kitten-action/main)

This action sets up a [Kitten](http://kittenlang.org/).

## Prerequisites

The following tools have to be installed for successful work of this GitHub action:
[git](https://git-scm.com), [stack](https://docs.haskellstack.org/en/stable).

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
