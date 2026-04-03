import { useState } from 'react';
const initialState = {
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
};
export function useAppState() {
    const [state, setState] = useState(initialState);
    const addMessage = (message) => {
        setState(current => ({
            ...current,
            messages: [...current.messages, message],
        }));
    };
    const setStatus = (status) => {
        setState(current => ({ ...current, status }));
    };
    const setHistory = (history) => {
        setState(current => ({ ...current, history }));
    };
    const setInputValue = (inputValue) => {
        setState(current => ({ ...current, inputValue }));
    };
    const clearMessages = () => {
        setState(current => ({
            ...current,
            history: [],
            messages: initialState.messages,
        }));
    };
    const setAbortController = (abortController) => {
        setState(current => ({ ...current, abortController }));
    };
    return {
        state,
        addMessage,
        setStatus,
        setHistory,
        setInputValue,
        clearMessages,
        setAbortController,
    };
}
//# sourceMappingURL=useAppState.js.map