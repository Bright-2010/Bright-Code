export type Role = 'user' | 'assistant';
export interface TextBlock {
    type: 'text';
    text: string;
}
export interface ToolUseBlock {
    type: 'tool_use';
    id: string;
    name: string;
    input: Record<string, string>;
}
export interface ToolResultBlock {
    type: 'tool_result';
    tool_use_id: string;
    content: string | unknown[];
}
export type ContentBlock = TextBlock | ToolUseBlock | ToolResultBlock;
export interface Message {
    role: Role;
    content: string | ContentBlock[];
}
export type MessageKind = {
    kind: 'user';
    text: string;
    id: string;
} | {
    kind: 'assistant';
    text: string;
    id: string;
} | {
    kind: 'tool_use';
    name: string;
    input: Record<string, string>;
    id: string;
} | {
    kind: 'tool_result';
    toolName: string;
    result: string;
    id: string;
    isError: boolean;
} | {
    kind: 'error';
    text: string;
    id: string;
} | {
    kind: 'system';
    text: string;
    id: string;
};
export declare function nextId(): string;
