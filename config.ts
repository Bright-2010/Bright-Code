import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

export interface AppConfig {
  provider: {
    apiKey: string
    baseUrl: string
    model: string
    endpoint: string
    maxTokens: number
    maxTokensParam: string
    apiKeyHeader: string
    apiKeyPrefix: string
    apiKeyQueryParam: string
    extraHeaders: Record<string, string>
    extraBody: Record<string, string>
  }
  skills: {
    enabled: boolean
    directory: string
    include: string[]
  }
}

let cachedConfig: AppConfig | null = null

function parseScalar(raw: string): string {
  const v = raw.trim()
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    return v.slice(1, -1)
  }
  return v
}

function parseYamlObject(content: string): Record<string, unknown> {
  const root: Record<string, unknown> = {}
  const stack: Array<{ indent: number; obj: Record<string, unknown> }> = [
    { indent: -1, obj: root },
  ]

  const lines = content.split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const match = line.match(/^(\s*)([^:]+):(.*)$/)
    if (!match) continue

    const indent = match[1].length
    const key = match[2].trim()
    const value = match[3].trim()

    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop()
    }

    const parent = stack[stack.length - 1].obj

    if (!value) {
      const child: Record<string, unknown> = {}
      parent[key] = child
      stack.push({ indent, obj: child })
    } else {
      parent[key] = parseScalar(value)
    }
  }

  return root
}

function assertString(value: unknown, keyName: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`config.yaml is missing required string field: ${keyName}`)
  }
  return value
}

function getObject(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }
  return null
}

function parseBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value !== 'string') return fallback
  const normalized = value.trim().toLowerCase()
  if (normalized === 'true') return true
  if (normalized === 'false') return false
  return fallback
}

function parseCsv(value: unknown): string[] {
  if (typeof value !== 'string') return []
  return value
    .split(',')
    .map(v => v.trim())
    .filter(Boolean)
}

function parseNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value !== 'string') return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function parseKeyValueMap(value: unknown): Record<string, string> {
  if (typeof value !== 'string') return {}

  const out: Record<string, string> = {}
  for (const pair of value.split(',')) {
    const trimmed = pair.trim()
    if (!trimmed) continue

    const idx = trimmed.indexOf('=')
    if (idx <= 0) continue

    const key = trimmed.slice(0, idx).trim()
    const val = trimmed.slice(idx + 1).trim()
    if (!key || !val) continue

    out[key] = val
  }

  return out
}

export function loadConfig(): AppConfig {
  if (cachedConfig) return cachedConfig

  const configPath = resolve(process.cwd(), 'config.yaml')
  if (!existsSync(configPath)) {
    throw new Error(
      `config.yaml not found at ${configPath}. Create it from config.example.yaml.`,
    )
  }

  const raw = readFileSync(configPath, 'utf-8')
  const parsed = parseYamlObject(raw)
  const provider = getObject(parsed.provider) ?? parsed
  const skillsConfig = getObject(parsed.skills)

  cachedConfig = {
    provider: {
      apiKey: assertString(provider.apiKey, 'provider.apiKey'),
      baseUrl: assertString(provider.baseUrl, 'provider.baseUrl'),
      model: assertString(provider.model, 'provider.model'),
      endpoint:
        (typeof provider.endpoint === 'string' && provider.endpoint.trim()) ||
        '/chat/completions',
      maxTokens: parseNumber(provider.maxTokens, 4096),
      maxTokensParam:
        (typeof provider.maxTokensParam === 'string' && provider.maxTokensParam.trim()) ||
        'max_tokens',
      apiKeyHeader:
        (typeof provider.apiKeyHeader === 'string' && provider.apiKeyHeader.trim()) ||
        'Authorization',
      apiKeyPrefix:
        typeof provider.apiKeyPrefix === 'string' ? provider.apiKeyPrefix : 'Bearer ',
      apiKeyQueryParam:
        (typeof provider.apiKeyQueryParam === 'string' && provider.apiKeyQueryParam.trim()) ||
        '',
      extraHeaders: parseKeyValueMap(provider.extraHeaders),
      extraBody: parseKeyValueMap(provider.extraBody),
    },
    skills: {
      enabled: parseBoolean(skillsConfig?.enabled, false),
      directory:
        (typeof skillsConfig?.directory === 'string' && skillsConfig.directory.trim()) ||
        './skills',
      include: parseCsv(skillsConfig?.include),
    },
  }

  return cachedConfig
}
