import React, { useState, useEffect } from 'react'
import { Box, Text } from 'ink'

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
const VERBS = [
  'Thinking', 'Analyzing', 'Processing', 'Computing',
  'Reasoning', 'Considering', 'Working',
]

interface SpinnerProps {
  verb?: string
}

export function Spinner({ verb }: SpinnerProps) {
  const [frame, setFrame] = useState(0)
  const [verbIdx, setVerbIdx] = useState(0)

  useEffect(() => {
    const spinner = setInterval(() => {
      setFrame(f => (f + 1) % FRAMES.length)
    }, 80)
    const verbTimer = setInterval(() => {
      setVerbIdx(i => (i + 1) % VERBS.length)
    }, 2000)
    return () => {
      clearInterval(spinner)
      clearInterval(verbTimer)
    }
  }, [])

  const displayVerb = verb ?? VERBS[verbIdx]

  return (
    <Box>
      <Text color="cyan">{FRAMES[frame]} </Text>
      <Text color="cyan" dimColor>{displayVerb}…</Text>
    </Box>
  )
}
