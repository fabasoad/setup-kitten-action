import os from 'os'

export default class CliExeNameProvider implements ICliExeNameProvider {
  private cliName: string
  constructor(cliName: string) {
    this.cliName = cliName
  }
  getExeFileName(): string {
    switch (os.platform()) {
    case 'win32':
      return `${this.cliName}.exe`
    default:
      return this.cliName
    }
  }
}
