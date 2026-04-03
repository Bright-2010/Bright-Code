import type { Message, MessageKind } from './types.js';
type QueryCallbacks = {
    onText: (text: string) => void;
    onToolUse: (msg: MessageKind & {
        kind: 'tool_use';
    }) => void;
    onToolResult: (msg: MessageKind & {
        kind: 'tool_result';
    }) => void;
    onError: (text: string) => void;
};
export declare function runQuery(userInput: string, history: Message[], callbacks: QueryCallbacks, signal?: AbortSignal): Promise<Message[]>;
export {};
