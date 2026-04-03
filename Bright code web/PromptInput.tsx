import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'

interface PromptInputProps {
  value: string
  onChange: (v: string) => void
  onSubmit: (v: string) => void
  disabled?: boolean
  placeholder?: string
}

export function PromptInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'How can I help you?',
}: PromptInputProps) {
  const [cursorPos, setCursorPos] = useState(value.length)

  useInput(
    (input, key) => {
      if (disabled) return

      if (key.return) {
        const trimmed = value.trim()
        if (trimmed) {
          onSubmit(trimmed)
          onChange('')
          setCursorPos(0)
        }
        return
      }

      if (key.backspace || key.delete) {
        if (cursorPos > 0) {
          const next = value.slice(0, cursorPos - 1) + value.slice(cursorPos)
          onChange(next)
          setCursorPos(p => p - 1)
        }
        return
      }

      if (key.leftArrow) {
        setCursorPos(p => Math.max(0, p - 1))
        return
      }
      if (key.rightArrow) {
        setCursorPos(p => Math.min(value.length, p + 1))
        return
      }
      if (key.ctrl && input === 'a') {
        setCursorPos(0)
        return
      }
      if (key.ctrl && input === 'e') {
        setCursorPos(value.length)
        return
      }
      if (key.ctrl && input === 'k') {
        onChange(value.slice(0, cursorPos))
        return
      }
      if (key.ctrl && input === 'u') {
        onChange(value.slice(cursorPos))
        setCursorPos(0)
        return
      }

      // Normal character input
      if (input && !key.ctrl && !key.meta) {
        const next = value.slice(0, cursorPos) + input + value.slice(cursorPos)
        onChange(next)
        setCursorPos(p => p + input.length)
      }
    },
    { isActive: !disabled },
  )

  // Render input with cursor block
  const before = value.slice(0, cursorPos)
  const cursor = value[cursorPos] ?? ' '
  const after = value.slice(cursorPos + 1)
  const showPlaceholder = !disabled && value.length === 0

  return (
    <Box
      flexDirection="row"
      borderStyle="round"
      borderColor={disabled ? 'gray' : 'cyan'}
      paddingX={1}
      marginTop={1}
    >
      <Text bold color={disabled ? 'gray' : 'green'}>
        {disabled ? '  ' : '› '}
      </Text>
      {showPlaceholder ? (
        <Text dimColor color="gray">{placeholder}</Text>
      ) : (
        <Text>
          <Text color="white">{before}</Text>
          <Text backgroundColor="cyan" color="black">{cursor}</Text>
          <Text color="white">{after}</Text>
        </Text>
      )}
    </Box>
  )
}
