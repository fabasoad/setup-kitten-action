import { execSync } from 'child_process'
import { mkdirSync } from 'fs'
import { join } from 'path'
import { Logger } from 'winston'
import LoggerFactory from './LoggerFactory'

const log: Logger = LoggerFactory.create('github')

export const clone = (owner: string, repo: string, to: string): string => {
  mkdirSync(to, { recursive: true })
  const clonedPath: string = join(to, repo)
  execSync(`git clone https://github.com/${owner}/${repo}.git ${clonedPath}`)
  log.info(`Cloned folder is ${clonedPath}`)
  return clonedPath
}
