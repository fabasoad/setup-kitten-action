import { addPath } from '@actions/core'
import { execSync } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { Logger } from 'winston'
import Cache from './Cache'
import CliExeNameProvider from './CliExeNameProvider'
import { STACK_CLI_NAME } from './consts'
import InstallerBase from './InstallerBase'
import LoggerFactory from './LoggerFactory'

export default class StackInstaller extends InstallerBase {
  private INSTALL_DIR: string = path.join(os.homedir(), '.local', 'bin')
  private _log: Logger = LoggerFactory.create('StackInstaller')
  private _stackProvider: ICliExeNameProvider
  private _cache: ICache

  constructor(
    stackProvider: ICliExeNameProvider = new CliExeNameProvider(STACK_CLI_NAME),
    cache: ICache = new Cache('1.0.0', STACK_CLI_NAME)) {
    super(stackProvider)
    this._stackProvider = stackProvider
    this._cache = cache
  }

  protected async installInternal(): Promise<void> {
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
      const zipPath: string =
        path.join(this.INSTALL_DIR, `${STACK_CLI_NAME}.zip`)
      const cmd1: string = `Invoke-WebRequest -OutFile ${zipPath} -Uri https://get.haskellstack.org/stable/windows-x86_64.zip`
      // eslint-disable-next-line max-len
      const cmd2: string = `Expand-Archive ${zipPath} -DestinationPath ${this.INSTALL_DIR}`
      const cmd3: string = `Remove-Item ${zipPath}`
      dlCommand = `PowerShell.exe -Command "${cmd1}; ${cmd2}; ${cmd3}"`
      break
    default:
      throw new Error(`${osPlatform} OS is unsupported`)
    }

    this._log.info(`Executing command below to install ${STACK_CLI_NAME}...`)
    this._log.info(dlCommand)
    execSync(dlCommand)

    addPath(this.INSTALL_DIR)
    const execFilePath: string =
      path.join(this.INSTALL_DIR, this._stackProvider.getExeFileName())

    const cmd1: string = `${execFilePath} update`
    this._log.info(`Running > ${cmd1}`)
    execSync(cmd1)

    await this._cache.cache(execFilePath)
  }
}
