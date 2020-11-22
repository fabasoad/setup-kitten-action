import { execSync } from 'child_process'
import path from 'path'
import { Logger } from 'winston'
import LoggerFactory from './LoggerFactory'

const log: Logger = LoggerFactory.create('github')

export const clone = (owner: string, repo: string): string => {
  log.info(`Cloning ${owner}/${repo}...`)
  execSync(`git clone https://github.com/${owner}/${repo}.git`)
  const clonedPath: string = path.join(__dirname, repo)
  log.info(`Cloned folder is ${clonedPath}`)
  return clonedPath
}
