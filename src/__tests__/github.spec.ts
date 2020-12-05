// eslint-disable-next-line camelcase
import child_process, { ExecSyncOptions } from 'child_process'
import path from 'path'
import { restore, SinonStub, stub } from 'sinon'
import { clone } from '../github'

describe('github', () => {
  let execSyncStub: SinonStub<
    [command: string, options?: ExecSyncOptions], Buffer>

  beforeEach(() => {
    execSyncStub = stub(child_process, 'execSync')
  })

  it('clone should pass successfully', () => {
    const owner: string = 'lY5L080n'
    const repo: string = 'UGI49E2i'
    const to: string = 'PtAV46vh'
    const clonedPath: string = path.join(to, repo)
    const actual: string = clone(owner, repo, to)
    expect(actual).toBe(clonedPath)
    expect(execSyncStub.withArgs(
      `git clone https://github.com/${owner}/${repo}.git ${clonedPath}`).callCount)
      .toBe(1)
  })

  afterEach(() => restore())
})
