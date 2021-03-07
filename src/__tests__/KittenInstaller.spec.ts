/* eslint-disable no-unused-vars */
// eslint-disable-next-line camelcase
import { addPath } from '@actions/core'
import { sync } from 'command-exists'
import { homedir } from 'os'
import { join } from 'path'
import { KITTEN_CLI_NAME } from '../consts'
import { clone } from '../github'
import KittenInstaller from '../KittenInstaller'

const HOME_DIR: string = 'aWZ7FZkw'

jest.mock('../github', () => ({ clone: jest.fn() }))
jest.mock('os', () => ({ homedir: jest.fn(() => HOME_DIR) }))
jest.mock('@actions/core', () => ({ addPath: jest.fn() }))
jest.mock('command-exists', () => ({ sync: jest.fn() }))

describe('KittenInstaller', () => {
  it('should install successfully', async () => {
    const repo: string = 'kitten'
    const repoDir: string = '5zs1kbe5'
    const to: string = join(HOME_DIR, '.local', 'bin')
    const stackYamlPath: string = join(repoDir, 'stack.yaml');
    (clone as jest.Mock).mockReturnValue(repoDir);
    (sync as jest.Mock).mockReturnValue(false)

    const stackExeFileName: string = '629mkl7f'
    const stackProviderMock =
      { getExeFileName: jest.fn().mockReturnValue(stackExeFileName) }
    const kittenExeFileName: string = 'ORkJA6n9'
    const kittenProviderMock =
      { getExeFileName: jest.fn().mockReturnValue(kittenExeFileName) }

    const execFileDirPath: string = 'hw3a7g60'
    const execFilePath: string = join(execFileDirPath, 'PP7s5yhc')
    const finderMock =
      { find: jest.fn().mockReturnValue(execFilePath) }
    const cacheMock = { cache: jest.fn() }
    const execSyncMock = jest.fn()

    const installer: KittenInstaller = new KittenInstaller(
      stackProviderMock,
      kittenProviderMock,
      finderMock,
      cacheMock,
      execSyncMock)
    expect(kittenProviderMock.getExeFileName.mock.calls.length).toBe(1)
    await installer.install()

    expect((homedir as jest.Mock).mock.calls.length).toBe(1)
    expect((sync as jest.Mock).mock.calls.length).toBe(1)
    expect(sync).toHaveBeenCalledWith(kittenExeFileName)
    expect(stackProviderMock.getExeFileName.mock.calls.length).toBe(1)
    expect((clone as jest.Mock).mock.calls.length).toBe(1)
    expect(clone).toHaveBeenCalledWith('evincarofautumn', repo, to)
    expect(execSyncMock.mock.calls.length).toBe(2)
    expect(execSyncMock).toHaveBeenCalledWith(
      `${stackExeFileName} setup --stack-yaml ${stackYamlPath}`)
    expect(execSyncMock).toHaveBeenCalledWith(
      `${stackExeFileName} build --stack-yaml ${stackYamlPath}`)
    expect(finderMock.find.mock.calls.length).toBe(1)
    expect(finderMock.find.mock.calls[0][0])
      .toBe(join(repoDir, '.stack-work', 'install'))
    expect(finderMock.find.mock.calls[0][1]).toBe(KITTEN_CLI_NAME)
    expect((addPath as jest.Mock).mock.calls.length).toBe(1)
    expect(addPath).toHaveBeenCalledWith(execFileDirPath)
    expect(cacheMock.cache.mock.calls.length).toBe(1)
    expect(cacheMock.cache.mock.calls[0][0]).toBe(execFilePath)
  })

  it('should not install', async () => {
    (sync as jest.Mock).mockReturnValue(true)

    const stackProviderMock =
      { getExeFileName: jest.fn().mockReturnValue('629mkl7f') }
    const kittenExeFileName: string = 'ORkJA6n9'
    const kittenProviderMock =
      { getExeFileName: jest.fn().mockReturnValue(kittenExeFileName) }
    const finderMock =
      { find: jest.fn().mockReturnValue('hw3a7g60') }
    const cacheMock = { cache: jest.fn() }
    const execSyncMock = jest.fn()

    const installer: KittenInstaller = new KittenInstaller(
      stackProviderMock,
      kittenProviderMock,
      finderMock,
      cacheMock,
      execSyncMock)
    expect(kittenProviderMock.getExeFileName.mock.calls.length).toBe(1)
    await installer.install()

    expect((homedir as jest.Mock).mock.calls.length).toBe(1)
    expect((sync as jest.Mock).mock.calls.length).toBe(1)
    expect(sync).toHaveBeenCalledWith(kittenExeFileName)
    expect(stackProviderMock.getExeFileName.mock.calls.length).toBe(0)
    expect((clone as jest.Mock).mock.calls.length).toBe(0)
    expect(execSyncMock.mock.calls.length).toBe(0)
    expect(finderMock.find.mock.calls.length).toBe(0)
    expect((addPath as jest.Mock).mock.calls.length).toBe(0)
    expect(cacheMock.cache.mock.calls.length).toBe(0)
  })

  afterEach(() => {
    (homedir as jest.Mock).mockClear();
    (addPath as jest.Mock).mockClear();
    (sync as jest.Mock).mockClear();
    (clone as jest.Mock).mockClear()
  })
})
