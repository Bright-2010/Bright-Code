import type { Message, MessageKind } from './types.js';
export type AppStatus = 'idle' | 'thinking' | 'error';
interface AppState {
    abortController: AbortController | null;
    history: Message[];
    inputValue: string;
    messages: MessageKind[];
    status: AppStatus;
}
export declare function useAppState(): {
    state: AppState;
    addMessage: (message: MessageKind) => void;
    setStatus: (status: AppStatus) => void;
    setHistory: (history: Message[]) => void;
    setInputValue: (inputValue: string) => void;
    clearMessages: () => void;
    setAbortController: (abortController: AbortController | null) => void;
};
export {};
