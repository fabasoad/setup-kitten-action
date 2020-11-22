import { error, getInput } from '@actions/core'
import KittenInstaller from './kitten/KittenInstaller'
import StackInstaller from './stack/StackInstaller'

export const run = async (
  stackInstaller: IInstaller,
  kittenInstaller: IInstaller = new KittenInstaller(),
  err: typeof error = error) => {
  try {
    await stackInstaller.install()
    await kittenInstaller.install()
  } catch (e) {
    err((<Error>e).message)
  }
}

const stackInstaller: IInstaller = getInput('has_stack') == 'true' ?
  { install: (): Promise<void> => Promise.resolve() } : new StackInstaller()
run(stackInstaller)
