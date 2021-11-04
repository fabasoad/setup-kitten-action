import { error } from '@actions/core'
import { assert } from 'chai'
import itParam from 'mocha-param'
import { run } from '../index'

describe('index > run', () => {
  class InstallerMock {
    calls: number = 0
    async install(): Promise<void> {
      this.calls++
      return Promise.resolve()
    }
  }

  interface INegativeTestFixture {
    name: string
    stackInstaller: any
    kittenInstaller: any
    expectedCalls: number
  }

  const expectedErrorMessage: string = '0a77hs2u'
  class InstallerErrorMock {
    private msg: string
    constructor(msg: string) {
      this.msg = msg
    }
    install(): Promise<void> {
      throw new Error(this.msg)
    }
  }

  const items: INegativeTestFixture[] = [{
    stackInstaller: new InstallerMock(),
    kittenInstaller: new InstallerErrorMock(expectedErrorMessage),
    name: 'stackInstaller',
    expectedCalls: 1
  }, {
    stackInstaller: new InstallerErrorMock(expectedErrorMessage),
    kittenInstaller: new InstallerMock(),
    name: 'kittenInstaller',
    expectedCalls: 0
  }]

  let errorMocked

  beforeEach(() => {
    errorMocked = jest.fn((m: string) => assert.isNotNull(m))
  })

  it('should run successfully', async () => {
    const stackInstallerMock: InstallerMock = new InstallerMock()
    const kittenInstallerMock: InstallerMock = new InstallerMock()
    await run(
      stackInstallerMock, kittenInstallerMock, errorMocked as typeof error)
    expect(stackInstallerMock.calls).toBe(1)
    expect(kittenInstallerMock.calls).toBe(1)
  })

  itParam('should print error (${value.name})',
    items, async (item: INegativeTestFixture) => {
      await run(
        item.stackInstaller,
        item.kittenInstaller,
        errorMocked as typeof error
      )
      expect(item[item.name].calls).toBe(item.expectedCalls)
      expect(errorMocked.mock.calls.length).toBe(1)
      expect(errorMocked.mock.calls[0][0]).toBe(expectedErrorMessage)
    })

  afterEach(() => {
    errorMocked.mockReset()
  })
})
