import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { Logger } from 'winston'
import LoggerFactory from './LoggerFactory'

const log: Logger = LoggerFactory.create('github')

export const clone = (owner: string, repo: string, to: string = process.cwd()):
    string => {
  fs.mkdirSync(to, { recursive: true })
  const clonedPath: string = path.join(to, repo)
  execSync(`git clone https://github.com/${owner}/${repo}.git ${clonedPath}`)
  log.info(`Cloned folder is ${clonedPath}`)
  return clonedPath
}
