# Setup Kitten

[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://stand-with-ukraine.pp.ua)
![GitHub release](https://img.shields.io/github/v/release/fabasoad/setup-kitten-action?include_prereleases)
![functional-tests](https://github.com/fabasoad/setup-kitten-action/actions/workflows/functional-tests.yml/badge.svg)
![security](https://github.com/fabasoad/setup-kitten-action/actions/workflows/security.yml/badge.svg)
![linting](https://github.com/fabasoad/setup-kitten-action/actions/workflows/linting.yml/badge.svg)

This action sets up a [Kitten](http://kittenlang.org/).

## Prerequisites

None.

> `macOS` is not supported at this moment

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
