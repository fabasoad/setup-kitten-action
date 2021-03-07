// eslint-disable-next-line camelcase
import { execSync } from 'child_process'
import { mkdirSync } from 'fs'
import { join } from 'path'
import { clone } from '../github'

jest.mock('child_process', () => ({ execSync: jest.fn() }))
jest.mock('fs', () => ({ mkdirSync: jest.fn() }))

describe('github', () => {
  it('clone should pass successfully', () => {
    const owner: string = 'lY5L080n'
    const repo: string = 'UGI49E2i'
    const to: string = 'PtAV46vh'
    const clonedPath: string = join(to, repo)
    const actual: string = clone(owner, repo, to)
    expect(actual).toBe(clonedPath)
    expect((mkdirSync as jest.Mock).mock.calls.length).toBe(1)
    expect(mkdirSync).toHaveBeenCalledWith(to, { recursive: true })
    expect((execSync as jest.Mock).mock.calls.length).toBe(1)
    expect(execSync).toHaveBeenCalledWith(
      `git clone https://github.com/${owner}/${repo}.git ${clonedPath}`)
  })

  afterEach(() => {
    (execSync as jest.Mock).mockClear();
    (mkdirSync as jest.Mock).mockClear()
  })
})
