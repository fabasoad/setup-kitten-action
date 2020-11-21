import CliFileNameBuilder from './CliFileNameBuilder'

export default class UrlProvider implements IUrlProvider {
  private builder: ICliFileNameBuilder
  private version: string

  constructor(
    version: string,
    builder: ICliFileNameBuilder = new CliFileNameBuilder(version)) {
    this.version = version
    this.builder = builder
  }

  getUrl(): string {
    return '{PROJECT_URL}' + `${this.version}/${this.builder.build()}.zip`
  }
}
