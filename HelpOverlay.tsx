import React from 'react'
import { Box, Text } from 'ink'

export function HelpOverlay() {
  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="cyan"
      paddingX={2}
      paddingY={1}
      marginTop={1}
    >
      <Text bold color="cyan">Commands</Text>
      <Box flexDirection="column" marginTop={1} gap={0}>
        <Box gap={2}>
          <Text bold color="yellow">/clear</Text>
          <Text color="gray">Clear conversation history</Text>
        </Box>
        <Box gap={2}>
          <Text bold color="yellow">/help</Text>
          <Text color="gray">Toggle this help panel</Text>
        </Box>
        <Box gap={2}>
          <Text bold color="yellow">/exit</Text>
          <Text color="gray">Exit the CLI</Text>
        </Box>
        <Box gap={2}>
          <Text bold color="yellow">Ctrl+C</Text>
          <Text color="gray">Cancel current request</Text>
        </Box>
      </Box>
      <Box marginTop={1} flexDirection="column">
        <Text bold color="cyan">Keyboard</Text>
        <Box gap={2} marginTop={0}>
          <Text bold color="yellow">←→</Text>
          <Text color="gray">Move cursor</Text>
        </Box>
        <Box gap={2}>
          <Text bold color="yellow">Ctrl+A/E</Text>
          <Text color="gray">Start / end of line</Text>
        </Box>
        <Box gap={2}>
          <Text bold color="yellow">Ctrl+K</Text>
          <Text color="gray">Delete to end of line</Text>
        </Box>
        <Box gap={2}>
          <Text bold color="yellow">Ctrl+U</Text>
          <Text color="gray">Delete to start of line</Text>
        </Box>
      </Box>
      <Box marginTop={1} flexDirection="column">
        <Text bold color="cyan">Example prompts</Text>
        <Text color="gray">  list the files in this directory</Text>
        <Text color="gray">  create a fibonacci.ts and run it with node</Text>
        <Text color="gray">  what node version am I running?</Text>
        <Text color="gray">  read package.json and summarize it</Text>
      </Box>
    </Box>
  )
}
