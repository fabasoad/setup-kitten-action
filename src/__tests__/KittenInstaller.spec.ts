/* eslint-disable no-unused-vars */
// eslint-disable-next-line camelcase
import child_process, { ExecSyncOptions } from 'child_process'
import path from 'path'
import { restore, SinonStub, stub } from 'sinon'
import { KITTEN_CLI_NAME } from '../consts'
import * as github from '../github'
import KittenInstaller from '../KittenInstaller'

describe('KittenInstaller', () => {
  let githubCloneStub: SinonStub<
    [owner: string, repo: string, to?: string], string>
  let execSyncStub: SinonStub<
    [command: string, options?: ExecSyncOptions], Buffer>

  beforeEach(() => {
    githubCloneStub = stub(github, 'clone')
    execSyncStub = stub(child_process, 'execSync')
  })

  it('should install successfully', async () => {
    const repo: string = 'kitten'
    const repoDir: string = '5zs1kbe5'
    const stackYamlPath: string = path.join(repoDir, 'stack.yaml')
    githubCloneStub.returns(repoDir)

    const exeFileName: string = '629mkl7f'
    const getExeFileNameMock = jest.fn(() => exeFileName)

    const execFilePath: string = 'hw3a7g60'
    const findMock = jest.fn((f: string, c: string) => execFilePath)

    const cacheMock = jest.fn()

    const installer: KittenInstaller = new KittenInstaller(
      githubCloneStub,
      { getExeFileName: getExeFileNameMock },
      { find: findMock },
      { cache: cacheMock })
    await installer.install()

    githubCloneStub.calledOnceWithExactly('evincarofautumn', repo)
    execSyncStub.getCall(0)
      .calledWithExactly(`${exeFileName} setup --stack-yaml ${stackYamlPath}`)
    execSyncStub.getCall(1)
      .calledWithExactly(`${exeFileName} build --stack-yaml ${stackYamlPath}`)
    expect(findMock.mock.calls.length).toBe(1)
    expect(findMock.mock.calls[0][0])
      .toBe(path.join(repoDir, '.stack-work', 'install'))
    expect(findMock.mock.calls[0][1]).toBe(KITTEN_CLI_NAME)
    expect(cacheMock.mock.calls.length).toBe(1)
    expect(cacheMock.mock.calls[0][0]).toBe(execFilePath)
  })

  afterEach(() => restore())
})
