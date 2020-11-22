import { execSync } from 'child_process'
import Cache from '../Cache'
import CliExeNameProvider from '../CliExeNameProvider'
import { KITTEN_CLI_NAME, STACK_CLI_NAME } from '../consts'
import ExecutableFileFinder from '../ExecutableFileFinder'
import { checkout } from '../github'

export default class KittenInstaller implements IInstaller {
  private _checkout: typeof checkout
  private _stackProvider: ICliExeNameProvider
  private _finder: IExecutableFileFinder
  private _cache: ICache

  constructor(
    co: typeof checkout = checkout,
    stackProvider: ICliExeNameProvider = new CliExeNameProvider(STACK_CLI_NAME),
    finder: IExecutableFileFinder = new ExecutableFileFinder(KITTEN_CLI_NAME),
    cache: ICache = new Cache('1.0.0', KITTEN_CLI_NAME)) {
    this._checkout = co
    this._stackProvider = stackProvider
    this._finder = finder
    this._cache = cache
  }

  public async install(): Promise<void> {
    const repo: string = 'kitten'
    const stackCliName: string = this._stackProvider.getExeFileName()
    const repoDir: string = this._checkout('evincarofautumn', repo)
    execSync(`cd ${repo}`)
    execSync(`${stackCliName} setup`)
    execSync(`${stackCliName} build`)
    const execFilePath: string = this._finder.find(repoDir, KITTEN_CLI_NAME)
    this._cache.cache(execFilePath)
  }
}
