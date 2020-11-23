/* eslint-disable no-unused-vars */
interface IInstaller {
  install(): Promise<void>
}

interface IExecutableFileFinder {
  find(folderPath: string, cliName: string): string
}

interface ICache {
  cache(folderPath: string): Promise<void>
}

interface ICliExeNameProvider {
  getExeFileName(): string
}
