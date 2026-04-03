import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
export function Header() {
    return (_jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [_jsxs(Box, { flexDirection: "row", gap: 1, alignItems: "center", children: [_jsx(Text, { bold: true, color: "cyan", children: "\u25C6" }), _jsx(Text, { bold: true, color: "white", children: "Bright Code" }), _jsx(Text, { dimColor: true, color: "gray", children: "\u2014 mini TUI clone" })] }), _jsxs(Text, { dimColor: true, color: "gray", children: ['  ', "bash \u00B7 read_file \u00B7 write_file \u00B7 list_files"] })] }));
}
//# sourceMappingURL=Header.js.map