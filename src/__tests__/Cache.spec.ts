import fs from 'fs'
import path from 'path'
import { restore, SinonStub, stub } from 'sinon'
import Cache from '../Cache'

describe('Cache', () => {
  const expectedVersion: string = 'ey1r6c00'

  let fsChmodSyncStub: SinonStub<[path: fs.PathLike, mode: fs.Mode], void>

  beforeEach(() => {
    fsChmodSyncStub = stub(fs, 'chmodSync')
  })

  it('should cache successfully', async () => {
    const cliName: string = 'cmh2l9b7'
    const folderPath: string = '1ef84ehe'
    const execFilePath: string = path.join(folderPath, 'm8x9p1sw')
    const cachedPath: string = '1r4wn1iw'

    const apMocked: jest.Mock<void, [inputPath: string]> = jest.fn()
    const cdMocked: jest.Mock<
      Promise<string>,
      [sourceDir: string, tool: string, version: string, arch?: string]> =
      jest.fn().mockImplementation(
        // eslint-disable-next-line no-unused-vars
        (sourceDir: string, tool: string, version: string, arch?: string) =>
          cachedPath)
    const cache: Cache = new Cache(expectedVersion, cliName, {
      getExeFileName: (): string => cliName
    }, apMocked, cdMocked)
    await cache.cache(execFilePath)

    fsChmodSyncStub.calledOnceWithExactly(execFilePath, '777')
    expect(cdMocked.mock.calls.length).toBe(1)
    expect(cdMocked.mock.calls[0][0]).toBe(folderPath)
    expect(cdMocked.mock.calls[0][1]).toBe(cliName)
    expect(cdMocked.mock.calls[0][2]).toBe(expectedVersion)
    expect(apMocked.mock.calls.length).toBe(1)
    expect(apMocked.mock.calls[0][0]).toBe(cachedPath)
  })

  afterEach(() => restore())
})
