import { error, getInput } from '@actions/core'
import KittenInstaller from './KittenInstaller'
import StackInstaller from './StackInstaller'

export class StackInstallerFactory {
  get(): IInstaller {
    return getInput('has_stack') == 'true' ?
      new EmptyInstaller() : new StackInstaller()
  }
}

export class EmptyInstaller implements IInstaller {
  async install(): Promise<void> {
    await Promise.resolve()
  }
}

export const run = async (
  stackInstallerFactory: StackInstallerFactory = new StackInstallerFactory(),
  kittenInstaller: IInstaller = new KittenInstaller(),
  err: typeof error = error) => {
  try {
    await stackInstallerFactory.get().install()
    await kittenInstaller.install()
  } catch (e) {
    err((<Error>e).message)
  }
}

run()
