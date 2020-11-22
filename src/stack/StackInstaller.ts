import { addPath } from '@actions/core'
import { execSync } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { Logger } from 'winston'
import Cache from '../Cache'
import CliExeNameProvider from '../CliExeNameProvider'
import { STACK_CLI_NAME } from '../consts'
import LoggerFactory from '../LoggerFactory'

export default class StackInstaller implements IInstaller {
  private INSTALL_DIR: string = path.join(os.homedir(), '.local', 'bin')
  private log: Logger = LoggerFactory.create('StackInstaller')
  private stackProvider: ICliExeNameProvider
  private cache: ICache

  constructor(
    stackProvider: ICliExeNameProvider = new CliExeNameProvider(STACK_CLI_NAME),
    cache: ICache = new Cache('1.0.0', STACK_CLI_NAME)) {
    this.stackProvider = stackProvider
    this.cache = cache
  }

  public async install(): Promise<void> {
    fs.mkdirSync(this.INSTALL_DIR, { recursive: true })
    const osPlatform: string = os.platform()

    let dlCommand: string
    switch (osPlatform) {
    case 'linux':
      dlCommand = 'curl -L https://get.haskellstack.org/stable/linux-x86_64.tar.gz | tar xz --wildcards --strip-components=1 -C ' + this.INSTALL_DIR + ` \'*/${STACK_CLI_NAME}\'`
      break
    case 'darwin':
      dlCommand = `curl --insecure -L https://get.haskellstack.org/stable/osx-x86_64.tar.gz | tar xz --strip-components=1 --include \'*/${STACK_CLI_NAME}\' -C ${this.INSTALL_DIR}`
      break
    case 'win32':
      dlCommand = `PowerShell.exe -Command "&{Invoke-WebRequest -OutFile ${this.INSTALL_DIR}\\${STACK_CLI_NAME}.zip https://get.haskellstack.org/stable/windows-x86_64.zip zip e ${this.INSTALL_DIR}\\${STACK_CLI_NAME}.zip -o${this.INSTALL_DIR} ${STACK_CLI_NAME}.exe  Remove-Item ${this.INSTALL_DIR}\\${STACK_CLI_NAME}.zip}"`
      break
    default:
      throw new Error(`${osPlatform} OS is unsupported`)
    }
    this.log.info(`Executing command below to install ${STACK_CLI_NAME}...`)
    this.log.info(dlCommand)

    execSync(dlCommand)
    addPath(this.INSTALL_DIR)
    const execFilePath: string =
      path.join(this.INSTALL_DIR, this.stackProvider.getExeFileName())
    execSync(`${execFilePath} update`);
    await this.cache.cache(execFilePath)
  }
}
