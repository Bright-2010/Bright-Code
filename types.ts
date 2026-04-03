// ─── Message Types (mirrors Bright Code's src/types/message.ts) ──────────────

export type Role = 'user' | 'assistant'

export interface TextBlock {
  type: 'text'
  text: string
}

export interface ToolUseBlock {
  type: 'tool_use'
  id: string
  name: string
  input: Record<string, string>
}

export interface ToolResultBlock {
  type: 'tool_result'
  tool_use_id: string
  content: string | unknown[]
}

export type ContentBlock = TextBlock | ToolUseBlock | ToolResultBlock

// What we store in conversation history
export interface Message {
  role: Role
  content: string | ContentBlock[]
}

// What we render in the TUI
export type MessageKind =
  | { kind: 'user'; text: string; id: string }
  | { kind: 'assistant'; text: string; id: string }
  | { kind: 'tool_use'; name: string; input: Record<string, string>; id: string }
  | { kind: 'tool_result'; toolName: string; result: string; id: string; isError: boolean }
  | { kind: 'error'; text: string; id: string }
  | { kind: 'system'; text: string; id: string }

let _msgId = 0
export function nextId() {
  return `msg-${++_msgId}`
}
