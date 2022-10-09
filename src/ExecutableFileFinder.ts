import path from 'path'
import { readdirSync, statSync } from 'fs'
import { Logger } from 'winston'
import CliExeNameProvider from './CliExeNameProvider'
import { KITTEN_CLI_NAME } from './consts'
import LoggerFactory from './LoggerFactory'

export default class ExecutableFileFinder implements IExecutableFileFinder {
  private readonly log: Logger = LoggerFactory.create(ExecutableFileFinder.name)
  private readonly provider: ICliExeNameProvider

  constructor(
    cliName: string,
    provider: ICliExeNameProvider = new CliExeNameProvider(cliName)) {
    this.provider = provider
  }

  find(dirPath: string): string {
    const files: string[] = [dirPath]
    while (files.length > 0) {
      const filePath: string = files.pop() || ''
      if (statSync(filePath).isDirectory()) {
        readdirSync(filePath)
          .forEach((f: string) => files.push(`${filePath}${path.sep}${f}`))
      } else if (filePath.endsWith(this.provider.getExeFileName())) {
        this.log.info(`${KITTEN_CLI_NAME} path is ${filePath}`)
        return filePath
      }
    }
    throw new Error('Execution file has not been found under ' +
        `${dirPath} folder`)
  }
}
