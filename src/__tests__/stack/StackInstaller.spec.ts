import * as core from '@actions/core'
// eslint-disable-next-line camelcase
import child_process, { ExecSyncOptions } from 'child_process'
import fs from 'fs'
import itParam from 'mocha-param'
import os from 'os'
import path from 'path'
import { restore, SinonStub, stub } from 'sinon'
import { STACK_CLI_NAME } from '../../consts'
import StackInstaller from '../../stack/StackInstaller'

const installDir: string = path.join(os.homedir(), '.local', 'bin')

interface IFixture {
  platform: string
  command: string
}

const items: IFixture[] = [{
  platform: 'linux',
  command: 'curl -L https://get.haskellstack.org/stable/linux-x86_64.tar.gz | tar xz --wildcards --strip-components=1 -C ' + installDir + ` \'*/${STACK_CLI_NAME}\'`
}, {
  platform: 'darwin',
  command: `curl --insecure -L https://get.haskellstack.org/stable/osx-x86_64.tar.gz | tar xz --strip-components=1 --include \'*/${STACK_CLI_NAME}\' -C ${installDir}`
}, {
  platform: 'win32',
  command: `PowerShell.exe -Command "&{Invoke-WebRequest -OutFile ${installDir}\\${STACK_CLI_NAME}.zip https://get.haskellstack.org/stable/windows-x86_64.zip  7z e ${installDir}\\${STACK_CLI_NAME}.zip -o${installDir} ${STACK_CLI_NAME}.exe  Remove-Item ${installDir}\\${STACK_CLI_NAME}.zip}"`
}]

describe('StackInstaller', () => {
  let fsMkdirSyncStub: SinonStub<
    [path: fs.PathLike, options?: fs.Mode | fs.MakeDirectoryOptions | null],
      string | undefined>
  let osPlatformStub: SinonStub<[], string>
  let execSyncStub: SinonStub<
    [command: string, options?: ExecSyncOptions], Buffer>
  let addPathStub: SinonStub<[inputPath: string], void>

  beforeEach(() => {
    fsMkdirSyncStub = stub(fs, 'mkdirSync')
    osPlatformStub = stub(os, 'platform')
    execSyncStub = stub(child_process, 'execSync')
    addPathStub = stub(core, 'addPath')
  })

  itParam('should install successfully (${value.platform})',
    items, async ({ platform, command }: IFixture) => {
      osPlatformStub.returns(platform)
      // eslint-disable-next-line no-unused-vars
      const cacheMock = jest.fn((p: string) => Promise.resolve())
      const installer: StackInstaller = new StackInstaller({
        cache: cacheMock
      })
      await installer.install()
      fsMkdirSyncStub.calledOnceWithExactly(installDir, { recursive: true })
      execSyncStub.calledOnceWithExactly(command)
      addPathStub.calledOnceWithExactly(installDir)
      expect(cacheMock.mock.calls.length).toBe(1)
      expect(cacheMock.mock.calls[0][0])
        .toBe(path.join(installDir, STACK_CLI_NAME))
    })

  it('should throw error in case of unsupported OS', async () => {
    osPlatformStub.returns('1pR71dal')
    // eslint-disable-next-line no-unused-vars
    const cacheMock = jest.fn((p: string) => Promise.resolve())
    const installer: StackInstaller = new StackInstaller({
      cache: cacheMock
    })
    let flag: boolean = false
    try {
      await installer.install()
    } catch (e) {
      flag = true
    }
    expect(flag).toBeTruthy()
    fsMkdirSyncStub.calledOnceWithExactly(installDir, { recursive: true })
    expect(execSyncStub.notCalled).toBeTruthy()
    expect(addPathStub.notCalled).toBeTruthy()
    expect(cacheMock.mock.calls.length).toBe(0)
  })

  afterEach(() => restore())
})
