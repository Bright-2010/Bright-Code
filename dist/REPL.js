import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { Box, useInput, useApp } from 'ink';
import { Messages } from './Messages.js';
import { PromptInput } from './PromptInput.js';
import { Spinner } from './Spinner.js';
import { StatusBar } from './StatusBar.js';
import { Header } from './Header.js';
import { HelpOverlay } from './HelpOverlay.js';
import { useAppState } from './useAppState.js';
import { runQuery } from './engine.js';
import { nextId } from './types.js';
export function REPLScreen() {
    const { exit } = useApp();
    const { state, addMessage, setStatus, setHistory, setInputValue, clearMessages, setAbortController, } = useAppState();
    const [showHelp, setShowHelp] = useState(false);
    // Ctrl+C to cancel in-flight request
    useInput((input, key) => {
        if (key.ctrl && input === 'c') {
            if (state.status === 'thinking' && state.abortController) {
                state.abortController.abort();
                setAbortController(null);
                setStatus('idle');
                addMessage({ kind: 'system', id: nextId(), text: 'Request cancelled.' });
            }
            else if (state.status === 'idle') {
                exit();
            }
        }
    });
    const handleSubmit = useCallback(async (input) => {
        // Handle slash commands
        if (input.startsWith('/')) {
            const cmd = input.toLowerCase().trim();
            if (cmd === '/exit' || cmd === '/quit') {
                exit();
                return;
            }
            if (cmd === '/clear') {
                clearMessages();
                setShowHelp(false);
                return;
            }
            if (cmd === '/help') {
                setShowHelp(h => !h);
                return;
            }
            addMessage({
                kind: 'error',
                id: nextId(),
                text: `Unknown command: ${input}. Try /help`,
            });
            return;
        }
        // Regular message
        setShowHelp(false);
        addMessage({ kind: 'user', id: nextId(), text: input });
        setStatus('thinking');
        const ac = new AbortController();
        setAbortController(ac);
        // Accumulate assistant text across streaming-style callbacks
        let assistantText = '';
        let assistantMsgId = nextId();
        let assistantMsgAdded = false;
        try {
            const newHistory = await runQuery(input, state.history, {
                onText: (text) => {
                    assistantText += text;
                    if (!assistantMsgAdded) {
                        addMessage({ kind: 'assistant', id: assistantMsgId, text: assistantText });
                        assistantMsgAdded = true;
                    }
                    else {
                        // Update last assistant message in place by re-adding (React will merge)
                        // In a real impl, we'd mutate the message store
                        addMessage({ kind: 'assistant', id: nextId(), text: text });
                    }
                },
                onToolUse: (msg) => {
                    assistantMsgAdded = false;
                    assistantText = '';
                    assistantMsgId = nextId();
                    addMessage(msg);
                },
                onToolResult: (msg) => {
                    addMessage(msg);
                },
                onError: (text) => {
                    addMessage({ kind: 'error', id: nextId(), text });
                },
            }, ac.signal);
            setHistory(newHistory);
            setStatus('idle');
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            if (msg !== 'Aborted') {
                addMessage({ kind: 'error', id: nextId(), text: msg });
            }
            setStatus(msg === 'Aborted' ? 'idle' : 'error');
        }
        finally {
            setAbortController(null);
        }
    }, [addMessage, clearMessages, exit, setAbortController, setHistory, setInputValue, setStatus, state.history]);
    const isThinking = state.status === 'thinking';
    return (_jsxs(Box, { flexDirection: "column", padding: 1, children: [_jsx(Header, {}), _jsx(Messages, { messages: state.messages }), showHelp && _jsx(HelpOverlay, {}), isThinking && (_jsx(Box, { marginTop: 1, paddingLeft: 2, children: _jsx(Spinner, {}) })), _jsx(PromptInput, { value: state.inputValue, onChange: setInputValue, onSubmit: handleSubmit, disabled: isThinking, placeholder: isThinking ? 'Processing…' : 'How can I help you? (/help for commands)' }), _jsx(StatusBar, { status: state.status, messageCount: state.messages.filter(m => m.kind === 'user').length, cwd: process.cwd() })] }));
}
//# sourceMappingURL=REPL.js.map