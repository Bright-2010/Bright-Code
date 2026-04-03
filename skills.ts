import { existsSync, readdirSync, readFileSync } from 'fs'
import { basename, extname, resolve } from 'path'
import type { AppConfig } from './config.js'

export interface SkillDefinition {
  name: string
  prompt: string
  source: string
}

let cachedKey = ''
let cachedSkills: SkillDefinition[] = []

function parseSkillName(content: string, fileName: string): string {
  const lines = content.split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (trimmed.startsWith('# ')) return trimmed.slice(2).trim()
    break
  }
  return basename(fileName, extname(fileName))
}

function isSkillFile(fileName: string): boolean {
  const ext = extname(fileName).toLowerCase()
  return ext === '.md' || ext === '.txt' || ext === '.skill'
}

export function loadSkills(config: AppConfig): SkillDefinition[] {
  const enabled = config.skills.enabled
  const directory = config.skills.directory
  const include = config.skills.include
  const key = `${enabled}|${directory}|${include.join(',')}`

  if (key === cachedKey) return cachedSkills
  cachedKey = key

  if (!enabled) {
    cachedSkills = []
    return cachedSkills
  }

  const dirPath = resolve(process.cwd(), directory)
  if (!existsSync(dirPath)) {
    cachedSkills = []
    return cachedSkills
  }

  const allowed = new Set(include.map(v => v.trim()).filter(Boolean))
  const files = readdirSync(dirPath)
    .filter(isSkillFile)
    .filter(fileName => {
      if (allowed.size === 0) return true
      const stem = basename(fileName, extname(fileName))
      return allowed.has(fileName) || allowed.has(stem)
    })
    .sort()

  cachedSkills = files
    .map(fileName => {
      const source = resolve(dirPath, fileName)
      const raw = readFileSync(source, 'utf-8').trim()
      if (!raw) return null
      return {
        name: parseSkillName(raw, fileName),
        prompt: raw,
        source: fileName,
      } satisfies SkillDefinition
    })
    .filter((skill): skill is SkillDefinition => skill !== null)

  return cachedSkills
}

export function buildSkillPrompt(skills: SkillDefinition[]): string {
  if (skills.length === 0) return ''

  const sections = skills.map(
    skill =>
      `--- SKILL: ${skill.name} (source: ${skill.source}) ---\n${skill.prompt.trim()}`,
  )

  return `\n\nEnabled skills (${skills.length}):\n${sections.join('\n\n')}`
}

