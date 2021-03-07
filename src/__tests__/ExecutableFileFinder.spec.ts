import { sync } from 'glob'
import itParam from 'mocha-param'
import path from 'path'
import ExecutableFileFinder from '../ExecutableFileFinder'

jest.mock('glob', () => ({ sync: jest.fn() }))

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

  it('should find successfully', () => {
    const folderPath: string = '4se2ov6f'
    const cliName: string = '1clx8w43'
    const files: string[] = [cliName + SUFFIX, cliName];
    (sync as jest.Mock).mockImplementation(() => files)
    const finder: ExecutableFileFinder = new ExecutableFileFinder(cliName, {
      getExeFileName: (): string => SUFFIX
    })
    const actual: string = finder.find(folderPath, cliName)
    expect((sync as jest.Mock).mock.calls.length).toBe(1)
    expect(sync).toHaveBeenCalledWith(
      `${folderPath}${path.sep}**${path.sep}${cliName}*`)
    expect(actual).toBe(files[0])
  })

  itParam('should throw error (${value.message})',
    items, (item: INegativeTestFixture) => {
      const folderPath: string = '4se2ov6f'
      const cliName: string = '1clx8w43'
      const files: string[] = [cliName + SUFFIX, `gt11c1zr${SUFFIX}`];
      (sync as jest.Mock).mockImplementation(() => files)
      const finder: ExecutableFileFinder = new ExecutableFileFinder(cliName, {
        getExeFileName: (): string => item.suffix
      })
      try {
        finder.find(folderPath, cliName)
      } catch (e) {
        expect((<Error>e).message).toContain(item.message)
        expect((sync as jest.Mock).mock.calls.length).toBe(1)
        expect(sync).toHaveBeenCalledWith(
          `${folderPath}${path.sep}**${path.sep}${cliName}*`)
        return
      }
      fail()
    })

  afterEach(() => (sync as jest.Mock).mockClear())
})
