import { exec } from 'child_process'
import { promisify } from 'util'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { dirname } from 'path'

const execAsync = promisify(exec)

// ─── Tool Definitions ─────────────────────────────────────────────────────────

export const TOOL_DEFINITIONS = [
  {
    name: 'bash',
    description:
      'Execute a shell command. Use for: running code, git commands, listing files, installing packages, etc.',
    input_schema: {
      type: 'object' as const,
      properties: {
        command: { type: 'string', description: 'The shell command to run' },
        description: { type: 'string', description: 'Brief human-readable description' },
      },
      required: ['command'],
    },
  },
  {
    name: 'read_file',
    description: 'Read the entire contents of a file.',
    input_schema: {
      type: 'object' as const,
      properties: {
        path: { type: 'string', description: 'Path to the file' },
      },
      required: ['path'],
    },
  },
  {
    name: 'write_file',
    description: 'Create or overwrite a file with given content.',
    input_schema: {
      type: 'object' as const,
      properties: {
        path: { type: 'string', description: 'File path to write' },
        content: { type: 'string', description: 'File content' },
      },
      required: ['path', 'content'],
    },
  },
  {
    name: 'list_files',
    description: 'List files and directories at a path.',
    input_schema: {
      type: 'object' as const,
      properties: {
        path: { type: 'string', description: 'Directory path (default: current dir)' },
      },
      required: [],
    },
  },
] as const

export type ToolName = 'bash' | 'read_file' | 'write_file' | 'list_files'
export type ToolInput = Record<string, string>

// ─── Tool Execution ───────────────────────────────────────────────────────────

export async function executeTool(name: ToolName, input: ToolInput): Promise<string> {
  try {
    switch (name) {
      case 'bash': {
        const { stdout, stderr } = await execAsync(input.command, {
          cwd: process.cwd(),
          timeout: 30_000,
        })
        const out = [stdout.trim(), stderr.trim()].filter(Boolean).join('\nSTDERR:\n')
        return out || '(no output)'
      }
      case 'read_file': {
        return await readFile(input.path, 'utf-8')
      }
      case 'write_file': {
        await mkdir(dirname(input.path), { recursive: true })
        await writeFile(input.path, input.content, 'utf-8')
        return `✓ Wrote ${input.content.split('\n').length} lines to ${input.path}`
      }
      case 'list_files': {
        const { stdout } = await execAsync(`ls -la "${input.path ?? '.'}"`)
        return stdout
      }
      default:
        return `Error: unknown tool "${name}"`
    }
  } catch (err: unknown) {
    return `Error: ${err instanceof Error ? err.message : String(err)}`
  }
}
