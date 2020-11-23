import itParam from 'mocha-param'
import os from 'os'
import { restore, SinonStub, stub } from 'sinon'
import CliExeNameProvider from '../CliExeNameProvider'

interface IFixture {
  platform: string
  actual: string
  expected: string
}

describe('CliExeNameProvider', () => {
  let osPlatformStub: SinonStub<[], string>

  const items: IFixture[] = [{
    platform: 'win32',
    actual: 'n4LSZ7i0',
    expected: 'n4LSZ7i0.exe'
  }, {
    platform: 'darwin',
    actual: 'zVGXb2M1',
    expected: 'zVGXb2M1'
  }, {
    platform: 'linux',
    actual: '08drSDMo',
    expected: '08drSDMo'
  }]

  beforeEach(() => {
    osPlatformStub = stub(os, 'platform')
  })

  itParam('should return exe name successfully (${value.platform})',
    items, (item: IFixture) => {
      osPlatformStub.returns(item.platform)
      const provider: CliExeNameProvider = new CliExeNameProvider(item.actual)
      const actual: string = provider.getExeFileName()
      expect(actual).toBe(item.expected)
    })

  afterEach(() => restore())
})
