import { platform } from 'os'

export default class CliExeNameProvider implements ICliExeNameProvider {
  private cliName: string
  constructor(cliName: string) {
    this.cliName = cliName
  }
  getExeFileName(): string {
    switch (platform()) {
    case 'win32':
      return `${this.cliName}.exe`
    default:
      return this.cliName
    }
  }
}
