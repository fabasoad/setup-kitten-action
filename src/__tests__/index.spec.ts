import * as core from '@actions/core'
import { assert } from 'chai'
import itParam from 'mocha-param'
import { restore, SinonStub, stub } from 'sinon'
import { EmptyInstaller, run, StackInstallerFactory } from '../index'
import StackInstaller from '../StackInstaller'

describe('index file', () => {
  describe('EmptyInstaller', () => {
    it('should install successfully', async () => {
      await new EmptyInstaller().install()
    })
  })

  describe('StackInstallerFactory', () => {
    interface IFixture {
      hasStack: boolean
      type: any
    }

    let getInputStub: SinonStub<
      [name: string, options?: core.InputOptions], string>

    beforeEach(() => {
      getInputStub = stub(core, 'getInput')
    })

    const items: IFixture[] = [{
      hasStack: true,
      type: EmptyInstaller
    }, {
      hasStack: false,
      type: StackInstaller
    }]
    itParam('should return installer successfully (${value.hasStack})',
      items, (item: IFixture) => {
        getInputStub.returns(String(item.hasStack))
        const factory: StackInstallerFactory = new StackInstallerFactory()
        expect(factory.get()).toBeInstanceOf(item.type)
      })

    afterEach(() => restore())
  })

  describe('run', () => {
    const TEST_VERSION: string = 'y5e30fn1xt'

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
    let getInputMocked

    beforeEach(() => {
      errorMocked = jest.fn((m: string) => assert.isNotNull(m))
      getInputMocked = jest.fn((name: string, options?: core.InputOptions):
        string => {
        assert.isUndefined(options)
        assert.equal(name, 'has_stack')
        return TEST_VERSION
      })
    })

    it('should run successfully', async () => {
      const stackInstallerMock: InstallerMock = new InstallerMock()
      const kittenInstallerMock: InstallerMock = new InstallerMock()
      await run(
        { get: () => stackInstallerMock },
        kittenInstallerMock,
      errorMocked as typeof core.error
      )
      expect(stackInstallerMock.calls).toBe(1)
      expect(kittenInstallerMock.calls).toBe(1)
    })

    itParam('should print error (${value.name})',
      items, async (item: INegativeTestFixture) => {
        await run(
          { get: () => item.stackInstaller },
          item.kittenInstaller,
        errorMocked as typeof core.error
        )
        expect(item[item.name].calls).toBe(item.expectedCalls)
        expect(errorMocked.mock.calls.length).toBe(1)
        expect(errorMocked.mock.calls[0][0]).toBe(expectedErrorMessage)
      })

    afterEach(() => {
      errorMocked.mockReset()
      getInputMocked.mockReset()
    })
  })
})
