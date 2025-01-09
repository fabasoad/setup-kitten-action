# Setup Kitten

[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://stand-with-ukraine.pp.ua)
![GitHub release](https://img.shields.io/github/v/release/fabasoad/setup-kitten-action?include_prereleases)
![functional-tests](https://github.com/fabasoad/setup-kitten-action/actions/workflows/functional-tests.yml/badge.svg)
![security](https://github.com/fabasoad/setup-kitten-action/actions/workflows/security.yml/badge.svg)
![linting](https://github.com/fabasoad/setup-kitten-action/actions/workflows/linting.yml/badge.svg)

This action sets up a [Kitten](http://kittenlang.org/).

## Supported OS

<!-- prettier-ignore-start -->
| OS      | Arch   |                    |
|---------|--------|--------------------|
| Windows | x86_84 | :white_check_mark: |
| Windows | arm    | :x:                |
| Linux   | x86_84 | :white_check_mark: |
| Linux   | arm    | :x:                |
| macOS   | x86_84 | :white_check_mark: |
| macOS   | arm    | :x:                |
<!-- prettier-ignore-end -->

## Prerequisites

None.

## Inputs

```yaml
- uses: fabasoad/setup-kitten-action@v1
  with:
    # (Optional) If "false" skips installation if kitten is already installed.
    # If "true" installs kitten in any case. Defaults to "false".
    force: "false"
```

## Outputs

<!-- prettier-ignore-start -->
| Name      | Description                         | Example |
|-----------|-------------------------------------|---------|
| installed | Whether kitten was installed or not | `true`  |
<!-- prettier-ignore-end -->

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
      - uses: actions/checkout@v4
      - uses: fabasoad/setup-kitten-action@v1
      - name: Run script
        run: kitten ./hello-world.ktn
```

### Result

```shell
Run kitten ./hello-world.ktn
Hello World!
```
