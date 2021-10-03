import * as core from '@actions/core'
// eslint-disable-next-line camelcase
import child_process, { ExecSyncOptions } from 'child_process'
import commandExists from 'command-exists'
import fs from 'fs'
import itParam from 'mocha-param'
import os from 'os'
import path from 'path'
import { restore, SinonStub, stub } from 'sinon'
import { STACK_CLI_NAME } from '../consts'
import StackInstaller from '../StackInstaller'

const installDir: string = path.join(os.homedir(), '.local', 'bin')

interface IFixture {
  platform: string
  command: string
}

const getWindowsCommand = () => {
  const cmd1: string = `Invoke-WebRequest -OutFile ${installDir}/${STACK_CLI_NAME}.zip -Uri https://get.haskellstack.org/stable/windows-x86_64.zip`
  // eslint-disable-next-line max-len
  const cmd2: string = `Expand-Archive ${installDir}/${STACK_CLI_NAME}.zip -DestinationPath ${installDir}`
  const cmd3: string =
    `Remove-Item ${installDir}/${STACK_CLI_NAME}.zip`
  return `PowerShell.exe -Command "${cmd1}; ${cmd2}; ${cmd3}"`
}

const items: IFixture[] = [{
  platform: 'linux',
  command: 'curl -L https://get.haskellstack.org/stable/linux-x86_64.tar.gz | tar xz --wildcards --strip-components=1 -C ' + installDir + ` \'*/${STACK_CLI_NAME}\'`
}, {
  platform: 'darwin',
  command: `curl --insecure -L https://get.haskellstack.org/stable/osx-x86_64.tar.gz | tar xz --strip-components=1 --include \'*/${STACK_CLI_NAME}\' -C ${installDir}`
}, {
  platform: 'win32',
  command: getWindowsCommand()
}]

describe('StackInstaller', () => {
  let fsMkdirSyncStub: SinonStub<
    [path: fs.PathLike, options?: fs.Mode | fs.MakeDirectoryOptions | null],
      string | undefined>
  let osPlatformStub: SinonStub<[], string>
  let execSyncStub: SinonStub<
    [command: string, options?: ExecSyncOptions], string | Buffer>
  let addPathStub: SinonStub<[inputPath: string], void>
  let commandExistsStub: SinonStub<[commandName: string], boolean>

  beforeEach(() => {
    fsMkdirSyncStub = stub(fs, 'mkdirSync')
    osPlatformStub = stub(os, 'platform')
    execSyncStub = stub(child_process, 'execSync')
    addPathStub = stub(core, 'addPath')
    commandExistsStub = stub(commandExists, 'sync')
  })

  itParam('should install successfully (${value.platform})',
    items, async ({ platform, command }: IFixture) => {
      const stackExeFileName: string = 'RAZ1Hpk4'
      const execFilePath: string = path.join(installDir, stackExeFileName)
      commandExistsStub.returns(false)
      osPlatformStub.returns(platform)
      const getExeFileNameMock = jest.fn(() => stackExeFileName)
      // eslint-disable-next-line no-unused-vars
      const cacheMock = jest.fn((p: string) => Promise.resolve())
      const installer: StackInstaller = new StackInstaller(
        { getExeFileName: getExeFileNameMock },
        { cache: cacheMock }
      )
      await installer.install()
      expect(commandExistsStub.withArgs(stackExeFileName).callCount).toBe(1)
      expect(fsMkdirSyncStub
        .withArgs(installDir, { recursive: true }).callCount).toBe(1)
      expect(execSyncStub.withArgs(command).callCount).toBe(1)
      expect(execSyncStub.withArgs(`${execFilePath} update`).callCount).toBe(1)
      expect(addPathStub.withArgs(installDir).callCount).toBe(1)
      expect(getExeFileNameMock.mock.calls.length).toBe(2)
      expect(cacheMock.mock.calls.length).toBe(1)
      expect(cacheMock.mock.calls[0][0]).toBe(execFilePath)
    })

  it('should not install', async () => {
    const stackExeFileName: string = 'RAZ1Hpk4'
    commandExistsStub.returns(true)
    const getExeFileNameMock = jest.fn(() => stackExeFileName)
    // eslint-disable-next-line no-unused-vars
    const cacheMock = jest.fn((p: string) => Promise.resolve())
    const installer: StackInstaller = new StackInstaller(
      { getExeFileName: getExeFileNameMock },
      { cache: cacheMock }
    )
    await installer.install()
    expect(commandExistsStub.withArgs(stackExeFileName).callCount).toBe(1)
    expect(fsMkdirSyncStub.called).toBeFalsy()
    expect(execSyncStub.called).toBeFalsy()
    expect(addPathStub.called).toBeFalsy()
    expect(getExeFileNameMock.mock.calls.length).toBe(1)
    expect(cacheMock.mock.calls.length).toBe(0)
  })

  it('should throw error in case of unsupported OS', async () => {
    commandExistsStub.returns(false)
    osPlatformStub.returns('1pR71dal')
    const stackExeFileName: string = 'o71xzjDK'
    const getExeFileNameMock = jest.fn(() => stackExeFileName)
    // eslint-disable-next-line no-unused-vars
    const cacheMock = jest.fn((p: string) => Promise.resolve())
    const installer: StackInstaller = new StackInstaller(
      { getExeFileName: getExeFileNameMock },
      { cache: cacheMock }
    )
    let flag: boolean = false
    try {
      await installer.install()
    } catch (e) {
      flag = true
    }
    expect(flag).toBeTruthy()
    expect(commandExistsStub.withArgs(stackExeFileName).callCount).toBe(1)
    expect(fsMkdirSyncStub.withArgs(installDir, { recursive: true }).callCount)
      .toBe(1)
    expect(execSyncStub.notCalled).toBeTruthy()
    expect(addPathStub.notCalled).toBeTruthy()
    expect(getExeFileNameMock.mock.calls.length).toBe(1)
    expect(cacheMock.mock.calls.length).toBe(0)
  })

  afterEach(() => restore())
})
