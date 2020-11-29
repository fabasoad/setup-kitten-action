/* eslint-disable no-unused-vars */
// eslint-disable-next-line camelcase
import child_process, { ExecSyncOptions } from 'child_process'
import commandExists from 'command-exists'
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
  let commandExistsStub: SinonStub<[commandName: string], boolean>

  beforeEach(() => {
    githubCloneStub = stub(github, 'clone')
    execSyncStub = stub(child_process, 'execSync')
    commandExistsStub = stub(commandExists, 'sync')
  })

  it('should install successfully', async () => {
    const repo: string = 'kitten'
    const repoDir: string = '5zs1kbe5'
    const stackYamlPath: string = path.join(repoDir, 'stack.yaml')
    commandExistsStub.returns(false)
    githubCloneStub.returns(repoDir)

    const stackExeFileName: string = '629mkl7f'
    const getStackExeFileNameMock = jest.fn(() => stackExeFileName)
    const kittenExeFileName: string = 'ORkJA6n9'
    const getKittenExeFileNameMock = jest.fn(() => kittenExeFileName)

    const execFilePath: string = 'hw3a7g60'
    const findMock = jest.fn((f: string, c: string) => execFilePath)

    const cacheMock = jest.fn()

    const installer: KittenInstaller = new KittenInstaller(
      { getExeFileName: getStackExeFileNameMock },
      { getExeFileName: getKittenExeFileNameMock },
      { find: findMock },
      { cache: cacheMock })
    expect(getKittenExeFileNameMock.mock.calls.length).toBe(1)
    await installer.install()

    expect(commandExistsStub.withArgs(kittenExeFileName).callCount).toBe(1)
    expect(getStackExeFileNameMock.mock.calls.length).toBe(1)
    expect(githubCloneStub.withArgs('evincarofautumn', repo).callCount).toBe(1)
    expect(execSyncStub.withArgs(
      `${stackExeFileName} setup --stack-yaml ${stackYamlPath}`).callCount)
      .toBe(1)
    expect(execSyncStub.withArgs(
      `${stackExeFileName} build --stack-yaml ${stackYamlPath}`).callCount)
      .toBe(1)
    expect(findMock.mock.calls.length).toBe(1)
    expect(findMock.mock.calls[0][0])
      .toBe(path.join(repoDir, '.stack-work', 'install'))
    expect(findMock.mock.calls[0][1]).toBe(KITTEN_CLI_NAME)
    expect(cacheMock.mock.calls.length).toBe(1)
    expect(cacheMock.mock.calls[0][0]).toBe(execFilePath)
  })

  it('should not install', async () => {
    commandExistsStub.returns(true)
    githubCloneStub.returns('Y9xoTYs3')

    const getStackExeFileNameMock = jest.fn(() => '629mkl7f')
    const kittenExeFileName: string = 'ORkJA6n9'
    const getKittenExeFileNameMock = jest.fn(() => kittenExeFileName)
    const findMock = jest.fn((f: string, c: string) => 'hw3a7g60')
    const cacheMock = jest.fn()

    const installer: KittenInstaller = new KittenInstaller(
      { getExeFileName: getStackExeFileNameMock },
      { getExeFileName: getKittenExeFileNameMock },
      { find: findMock },
      { cache: cacheMock })
    expect(getKittenExeFileNameMock.mock.calls.length).toBe(1)
    await installer.install()

    expect(commandExistsStub.withArgs(kittenExeFileName).callCount).toBe(1)
    expect(getStackExeFileNameMock.mock.calls.length).toBe(0)
    expect(githubCloneStub.called).toBeFalsy()
    expect(execSyncStub.called).toBeFalsy()
    expect(findMock.mock.calls.length).toBe(0)
    expect(cacheMock.mock.calls.length).toBe(0)
  })

  afterEach(() => restore())
})
