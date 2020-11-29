import glob, { IOptions } from 'glob'
import itParam from 'mocha-param'
import path from 'path'
import { restore, SinonStub, stub } from 'sinon'
import ExecutableFileFinder from '../ExecutableFileFinder'

interface INegativeTestFixture {
  message: string
  suffix: string
}

describe('ExecutableFileFinder', () => {
  const SUFFIX: string = '3ttg37ne'
  const items: INegativeTestFixture[] = [{
    message: 'There are more than 1 execution file has been found',
    suffix: SUFFIX
  }, {
    message: 'Execution file has not been found',
    suffix: 'u4h0t03e'
  }]
  let globSyncStub: SinonStub<[pattern: string, options?: IOptions], string[]>

  beforeEach(() => {
    globSyncStub = stub(glob, 'sync')
  })

  it('should find successfully', () => {
    const folderPath: string = '4se2ov6f'
    const cliName: string = '1clx8w43'
    const files: string[] = [cliName + SUFFIX, cliName]
    globSyncStub.returns(files)
    const finder: ExecutableFileFinder = new ExecutableFileFinder(cliName, {
      getExeFileName: (): string => SUFFIX
    })
    const actual: string = finder.find(folderPath, cliName)
    expect(globSyncStub.withArgs(
      `${folderPath}${path.sep}**${path.sep}${cliName}*`).callCount).toBe(1)
    expect(actual).toBe(files[0])
  })

  itParam('should throw error (${value.message})',
    items, (item: INegativeTestFixture) => {
      const folderPath: string = '4se2ov6f'
      const cliName: string = '1clx8w43'
      const files: string[] = [cliName + SUFFIX, `gt11c1zr${SUFFIX}`]
      globSyncStub.returns(files)
      const finder: ExecutableFileFinder = new ExecutableFileFinder(cliName, {
        getExeFileName: (): string => item.suffix
      })
      try {
        finder.find(folderPath, cliName)
      } catch (e) {
        expect((<Error>e).message).toContain(item.message)
        expect(globSyncStub.withArgs(
          `${folderPath}${path.sep}**${path.sep}${cliName}*`).callCount).toBe(1)
        return
      }
      fail()
    })

  afterEach(() => restore())
})
