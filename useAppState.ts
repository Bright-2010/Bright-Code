import { useState } from 'react'
import type { Message, MessageKind } from './types.js'

export type AppStatus = 'idle' | 'thinking' | 'error'

interface AppState {
  abortController: AbortController | null
  history: Message[]
  inputValue: string
  messages: MessageKind[]
  status: AppStatus
}

const initialState: AppState = {
  abortController: null,
  history: [],
  inputValue: '',
  messages: [
    {
      kind: 'system',
      id: 'msg-0',
      text: 'Bright Code mini TUI ready. Type /help for commands.',
    },
  ],
  status: 'idle',
}

export function useAppState() {
  const [state, setState] = useState<AppState>(initialState)

  const addMessage = (message: MessageKind) => {
    setState(current => ({
      ...current,
      messages: [...current.messages, message],
    }))
  }

  const setStatus = (status: AppStatus) => {
    setState(current => ({ ...current, status }))
  }

  const setHistory = (history: Message[]) => {
    setState(current => ({ ...current, history }))
  }

  const setInputValue = (inputValue: string) => {
    setState(current => ({ ...current, inputValue }))
  }

  const clearMessages = () => {
    setState(current => ({
      ...current,
      history: [],
      messages: initialState.messages,
    }))
  }

  const setAbortController = (abortController: AbortController | null) => {
    setState(current => ({ ...current, abortController }))
  }

  return {
    state,
    addMessage,
    setStatus,
    setHistory,
    setInputValue,
    clearMessages,
    setAbortController,
  }
}
