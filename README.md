# Setup {PROJECT_TITLE}

![GitHub release](https://img.shields.io/github/v/release/fabasoad/{PROJECT_NAME}?include_prereleases) ![CI (latest)](https://github.com/fabasoad/{PROJECT_NAME}/workflows/CI%20(latest)/badge.svg) ![CI (main)](https://github.com/fabasoad/{PROJECT_NAME}/workflows/CI%20(main)/badge.svg) ![YAML Lint](https://github.com/fabasoad/{PROJECT_NAME}/workflows/YAML%20Lint/badge.svg) [![Total alerts](https://img.shields.io/lgtm/alerts/g/fabasoad/{PROJECT_NAME}.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/fabasoad/{PROJECT_NAME}/alerts/) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/fabasoad/{PROJECT_NAME}.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/fabasoad/{PROJECT_NAME}/context:javascript) [![Maintainability](https://api.codeclimate.com/v1/badges/e259e98506d3691ab916/maintainability)](https://codeclimate.com/github/fabasoad/{PROJECT_NAME}/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/b49fa7426cb26ac028a9/test_coverage)](https://codeclimate.com/github/fabasoad/{PROJECT_NAME}/test_coverage) [![Known Vulnerabilities](https://snyk.io/test/github/fabasoad/{PROJECT_NAME}/badge.svg?targetFile=package.json)](https://snyk.io/test/github/fabasoad/{PROJECT_NAME}?targetFile=package.json)

This action sets up a [{PROJECT_TITLE}]({PROJECT_URL}).

## Inputs

| Name    | Required | Description                                                     | Default | Possible values |
|---------|----------|-----------------------------------------------------------------|---------|-----------------|
| version | Yes      | {PROJECT_TITLE} version that can be found [here]({PROJECT_URL}) |         | &lt;String&gt;  |

## Example usage

Let's try to run `{PROJECT_SCRIPT_FILE}` file with the following content:

```java
System.print("Hello World!")
```

### Workflow configuration

```yaml
name: Setup {PROJECT_TITLE}

on: push

jobs:
  setup:
    name: Setup
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@main
      - uses: fabasoad/{PROJECT_NAME}@main
        with:
          version: 0.3.0
      - name: Run script
        run: {PROJECT_CLI} ./{PROJECT_SCRIPT_FILE}
```

### Result

```shell
Run {PROJECT_CLI} ./{PROJECT_SCRIPT_FILE}
Hello World!
```
