import React from 'react'
import { Box, Text } from 'ink'
import type { MessageKind } from './types.js'

// ─── Individual message renderers ─────────────────────────────────────────────

function UserMessage({ text }: { text: string }) {
  return (
    <Box flexDirection="row" marginTop={1}>
      <Text bold color="green">{'> '}</Text>
      <Text color="white">{text}</Text>
    </Box>
  )
}

function AssistantMessage({ text }: { text: string }) {
  return (
    <Box flexDirection="column" marginTop={1} paddingLeft={2} borderLeft borderStyle="single" borderColor="cyan">
      {text.split('\n').map((line, i) => (
        <Text key={i} color="white">{line}</Text>
      ))}
    </Box>
  )
}

function ToolUseMessage({ name, input }: { name: string; input: Record<string, string> }) {
  const detail = input.command ?? input.path ?? input.content?.slice(0, 60) ?? ''
  const truncated = detail.length > 70

  return (
    <Box flexDirection="row" marginTop={1} gap={1}>
      <Text color="yellow">⚡</Text>
      <Text bold color="yellow">{name}</Text>
      {detail ? (
        <Text dimColor color="gray">
          {'› '}{truncated ? detail.slice(0, 70) + '…' : detail}
        </Text>
      ) : null}
    </Box>
  )
}

function ToolResultMessage({
  result,
  isError,
}: {
  result: string
  isError: boolean
}) {
  const lines = result.split('\n')
  const preview = lines.slice(0, 12)
  const remaining = lines.length - 12

  return (
    <Box flexDirection="column" paddingLeft={3} marginBottom={0}>
      {preview.map((line, i) => (
        <Text key={i} color={isError ? 'red' : 'gray'} dimColor={!isError}>
          {line}
        </Text>
      ))}
      {remaining > 0 && (
        <Text dimColor color="gray">
          … {remaining} more line{remaining === 1 ? '' : 's'}
        </Text>
      )}
    </Box>
  )
}

function SystemMessage({ text }: { text: string }) {
  return (
    <Box marginTop={1} flexDirection="column">
      {text.split('\n').map((line, i) => (
        <Text key={i} dimColor color="gray">{line}</Text>
      ))}
    </Box>
  )
}

function ErrorMessage({ text }: { text: string }) {
  return (
    <Box marginTop={1}>
      <Text color="red">✗ </Text>
      <Text color="red">{text}</Text>
    </Box>
  )
}

// ─── Unified MessageRow ───────────────────────────────────────────────────────

interface MessageRowProps {
  message: MessageKind
}

export function MessageRow({ message }: MessageRowProps) {
  switch (message.kind) {
    case 'user':
      return <UserMessage text={message.text} />
    case 'assistant':
      return <AssistantMessage text={message.text} />
    case 'tool_use':
      return <ToolUseMessage name={message.name} input={message.input} />
    case 'tool_result':
      return <ToolResultMessage result={message.result} isError={message.isError} />
    case 'system':
      return <SystemMessage text={message.text} />
    case 'error':
      return <ErrorMessage text={message.text} />
    default:
      return null
  }
}

// ─── Message List ─────────────────────────────────────────────────────────────

interface MessagesProps {
  messages: MessageKind[]
}

export function Messages({ messages }: MessagesProps) {
  return (
    <Box flexDirection="column">
      {messages.map(msg => (
        <MessageRow key={msg.id} message={msg} />
      ))}
    </Box>
  )
}
