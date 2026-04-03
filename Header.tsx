import React from 'react'
import { Box, Text } from 'ink'

export function Header() {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box flexDirection="row" gap={1} alignItems="center">
        <Text bold color="cyan">◆</Text>
        <Text bold color="white">Bright Code</Text>
        <Text dimColor color="gray">— mini TUI clone</Text>
      </Box>
      <Text dimColor color="gray">
        {'  '}bash · read_file · write_file · list_files
      </Text>
    </Box>
  )
}
