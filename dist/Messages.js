import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
// ─── Individual message renderers ─────────────────────────────────────────────
function UserMessage({ text }) {
    return (_jsxs(Box, { flexDirection: "row", marginTop: 1, children: [_jsx(Text, { bold: true, color: "green", children: '> ' }), _jsx(Text, { color: "white", children: text })] }));
}
function AssistantMessage({ text }) {
    return (_jsx(Box, { flexDirection: "column", marginTop: 1, paddingLeft: 2, borderLeft: true, borderStyle: "single", borderColor: "cyan", children: text.split('\n').map((line, i) => (_jsx(Text, { color: "white", children: line }, i))) }));
}
function ToolUseMessage({ name, input }) {
    const detail = input.command ?? input.path ?? input.content?.slice(0, 60) ?? '';
    const truncated = detail.length > 70;
    return (_jsxs(Box, { flexDirection: "row", marginTop: 1, gap: 1, children: [_jsx(Text, { color: "yellow", children: "\u26A1" }), _jsx(Text, { bold: true, color: "yellow", children: name }), detail ? (_jsxs(Text, { dimColor: true, color: "gray", children: ['› ', truncated ? detail.slice(0, 70) + '…' : detail] })) : null] }));
}
function ToolResultMessage({ result, isError, }) {
    const lines = result.split('\n');
    const preview = lines.slice(0, 12);
    const remaining = lines.length - 12;
    return (_jsxs(Box, { flexDirection: "column", paddingLeft: 3, marginBottom: 0, children: [preview.map((line, i) => (_jsx(Text, { color: isError ? 'red' : 'gray', dimColor: !isError, children: line }, i))), remaining > 0 && (_jsxs(Text, { dimColor: true, color: "gray", children: ["\u2026 ", remaining, " more line", remaining === 1 ? '' : 's'] }))] }));
}
function SystemMessage({ text }) {
    return (_jsx(Box, { marginTop: 1, flexDirection: "column", children: text.split('\n').map((line, i) => (_jsx(Text, { dimColor: true, color: "gray", children: line }, i))) }));
}
function ErrorMessage({ text }) {
    return (_jsxs(Box, { marginTop: 1, children: [_jsx(Text, { color: "red", children: "\u2717 " }), _jsx(Text, { color: "red", children: text })] }));
}
export function MessageRow({ message }) {
    switch (message.kind) {
        case 'user':
            return _jsx(UserMessage, { text: message.text });
        case 'assistant':
            return _jsx(AssistantMessage, { text: message.text });
        case 'tool_use':
            return _jsx(ToolUseMessage, { name: message.name, input: message.input });
        case 'tool_result':
            return _jsx(ToolResultMessage, { result: message.result, isError: message.isError });
        case 'system':
            return _jsx(SystemMessage, { text: message.text });
        case 'error':
            return _jsx(ErrorMessage, { text: message.text });
        default:
            return null;
    }
}
export function Messages({ messages }) {
    return (_jsx(Box, { flexDirection: "column", children: messages.map(msg => (_jsx(MessageRow, { message: msg }, msg.id))) }));
}
//# sourceMappingURL=Messages.js.map