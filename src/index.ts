import { error } from '@actions/core'
import KittenInstaller from './kitten/KittenInstaller'
import StackInstaller from './stack/StackInstaller'

export const run = async (
  stackInstaller: IInstaller = new StackInstaller(),
  kittenInstaller: IInstaller = new KittenInstaller(),
  err: typeof error = error) => {
  try {
    await stackInstaller.install()
    await kittenInstaller.install()
  } catch (e) {
    err((<Error>e).message)
  }
}

run()
