import itParam from 'mocha-param'
import { platform } from 'os'
import CliExeNameProvider from '../CliExeNameProvider'

jest.mock('os', () => ({ platform: jest.fn() }))

interface IFixture {
  platform: string
  actual: string
  expected: string
}

describe('CliExeNameProvider', () => {
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

  itParam('should return exe name successfully (${value.platform})',
    items, (item: IFixture) => {
      (platform as jest.Mock).mockImplementation(() => item.platform)
      const provider: CliExeNameProvider = new CliExeNameProvider(item.actual)
      const actual: string = provider.getExeFileName()
      expect(actual).toBe(item.expected)
    })

  afterEach(() => (platform as jest.Mock).mockClear())
})
