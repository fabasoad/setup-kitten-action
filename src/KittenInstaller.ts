import { addPath } from '@actions/core'
import { execSync } from 'child_process'
import os from 'os'
import path from 'path'
import { Logger } from 'winston'
import Cache from './Cache'
import CliExeNameProvider from './CliExeNameProvider'
import { KITTEN_CLI_NAME, STACK_CLI_NAME } from './consts'
import ExecutableFileFinder from './ExecutableFileFinder'
import { clone } from './github'
import InstallerBase from './InstallerBase'
import LoggerFactory from './LoggerFactory'

// eslint-disable-next-line no-unused-vars
type ExecFunction = (command: string) => void

export default class KittenInstaller extends InstallerBase {
  private INSTALL_DIR: string = path.join(os.homedir(), '.local', 'bin')

  private _stackProvider: ICliExeNameProvider
  private _finder: IExecutableFileFinder
  private _cache: ICache
  private _execSync: ExecFunction
  private _log: Logger

  constructor(
    stackProvider: ICliExeNameProvider = new CliExeNameProvider(STACK_CLI_NAME),
    kittenProvider: ICliExeNameProvider =
    new CliExeNameProvider(KITTEN_CLI_NAME),
    finder: IExecutableFileFinder = new ExecutableFileFinder(KITTEN_CLI_NAME),
    cache: ICache = new Cache('1.0.0', KITTEN_CLI_NAME),
    executeSync: ExecFunction = (command: string) => execSync(command)) {
    super(kittenProvider)
    this._stackProvider = stackProvider
    this._finder = finder
    this._cache = cache
    this._execSync = executeSync
    this._log = LoggerFactory.create('KittenInstaller')
  }

  protected async installInternal(): Promise<void> {
    const owner: string = 'evincarofautumn'
    const repo: string = 'kitten'
    const stackCliName: string = this._stackProvider.getExeFileName()
    const repoDir: string = clone(owner, repo, this.INSTALL_DIR)
    const stackYamlPath: string = path.join(repoDir, 'stack.yaml')

    const cmd1: string = `${stackCliName} setup --stack-yaml ${stackYamlPath}`
    this._log.info(`Running > ${cmd1}`)
    this._execSync(cmd1)

    const cmd2: string = `${stackCliName} build --stack-yaml ${stackYamlPath}`
    this._log.info(`Running > ${cmd2}`)
    this._execSync(cmd2)

    const stackWorkDir: string = path.join(repoDir, '.stack-work', 'install')
    const execFilePath: string =
      this._finder.find(stackWorkDir, KITTEN_CLI_NAME)
    addPath(path.dirname(execFilePath))
    return this._cache.cache(execFilePath)
  }
}
