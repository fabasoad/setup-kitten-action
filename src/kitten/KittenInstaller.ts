import { execSync } from 'child_process'
import { Logger } from 'winston'
import Cache from '../Cache'
import CliExeNameProvider from '../CliExeNameProvider'
import { KITTEN_CLI_NAME, STACK_CLI_NAME } from '../consts'
import ExecutableFileFinder from '../ExecutableFileFinder'
import { clone } from '../github'
import LoggerFactory from '../LoggerFactory'

export default class KittenInstaller implements IInstaller {
  private _clone: typeof clone
  private _stackProvider: ICliExeNameProvider
  private _finder: IExecutableFileFinder
  private _cache: ICache
  private _log: Logger

  constructor(
    co: typeof clone = clone,
    stackProvider: ICliExeNameProvider = new CliExeNameProvider(STACK_CLI_NAME),
    finder: IExecutableFileFinder = new ExecutableFileFinder(KITTEN_CLI_NAME),
    cache: ICache = new Cache('1.0.0', KITTEN_CLI_NAME)) {
    this._clone = co
    this._stackProvider = stackProvider
    this._finder = finder
    this._cache = cache
    this._log = LoggerFactory.create('KittenInstaller')
  }

  public async install(): Promise<void> {
    const owner: string = 'evincarofautumn'
    const repo: string = 'kitten'
    const stackCliName: string = this._stackProvider.getExeFileName()
    const repoDir: string = this._clone(owner, repo)

    const cmd1: string = `cd ${repo}`
    this._log.info(`Running > ${cmd1}`)
    execSync(cmd1)
    execSync('pwd')

    const cmd2: string = `${stackCliName} setup`
    this._log.info(`Running > ${cmd2}`)
    execSync(cmd2)

    const cmd3: string = `${stackCliName} build`
    this._log.info(`Running > ${cmd3}`)
    execSync(cmd3)

    const execFilePath: string = this._finder.find(repoDir, KITTEN_CLI_NAME)
    this._cache.cache(execFilePath)
  }
}
