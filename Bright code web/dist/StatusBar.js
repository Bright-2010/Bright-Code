import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
export function StatusBar({ status, messageCount, cwd }) {
    const cwdShort = cwd.replace(process.env.HOME ?? '', '~').slice(-40);
    const statusText = status === 'thinking' ? '⠿ thinking' :
        status === 'error' ? '✗ error' :
            '● ready';
    const statusColor = status === 'thinking' ? 'cyan' :
        status === 'error' ? 'red' :
            'green';
    const right = `${messageCount} msgs · Bright Code`;
    const left = `  ${cwdShort}`;
    const middle = statusText;
    return (_jsxs(Box, { flexDirection: "row", justifyContent: "space-between", borderStyle: "single", borderTop: true, borderBottom: false, borderLeft: false, borderRight: false, borderColor: "gray", marginTop: 1, paddingX: 1, children: [_jsx(Text, { dimColor: true, color: "gray", children: left }), _jsx(Text, { bold: true, color: statusColor, children: middle }), _jsx(Text, { dimColor: true, color: "gray", children: right })] }));
}
//# sourceMappingURL=StatusBar.js.map