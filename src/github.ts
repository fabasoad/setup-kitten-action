import { execSync } from 'child_process'
import path from 'path'

export const clone = (owner: string, repo: string): string => {
  execSync(`git clone https://github.com/${owner}/${repo}.git`)
  return path.join(__dirname, repo)
}
