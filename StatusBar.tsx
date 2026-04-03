import React from 'react'
import { Box, Text } from 'ink'
import type { AppStatus } from './useAppState.js'

interface StatusBarProps {
  status: AppStatus
  messageCount: number
  cwd: string
}

export function StatusBar({ status, messageCount, cwd }: StatusBarProps) {
  const cwdShort = cwd.replace(process.env.HOME ?? '', '~').slice(-40)

  const statusText =
    status === 'thinking' ? '⠿ thinking' :
    status === 'error' ? '✗ error' :
    '● ready'

  const statusColor =
    status === 'thinking' ? 'cyan' :
    status === 'error' ? 'red' :
    'green'

  const right = `${messageCount} msgs · Bright Code`
  const left = `  ${cwdShort}`
  const middle = statusText

  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      borderStyle="single"
      borderTop
      borderBottom={false}
      borderLeft={false}
      borderRight={false}
      borderColor="gray"
      marginTop={1}
      paddingX={1}
    >
      <Text dimColor color="gray">{left}</Text>
      <Text bold color={statusColor}>{middle}</Text>
      <Text dimColor color="gray">{right}</Text>
    </Box>
  )
}
