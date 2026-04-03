import { jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const VERBS = [
    'Thinking', 'Analyzing', 'Processing', 'Computing',
    'Reasoning', 'Considering', 'Working',
];
export function Spinner({ verb }) {
    const [frame, setFrame] = useState(0);
    const [verbIdx, setVerbIdx] = useState(0);
    useEffect(() => {
        const spinner = setInterval(() => {
            setFrame(f => (f + 1) % FRAMES.length);
        }, 80);
        const verbTimer = setInterval(() => {
            setVerbIdx(i => (i + 1) % VERBS.length);
        }, 2000);
        return () => {
            clearInterval(spinner);
            clearInterval(verbTimer);
        };
    }, []);
    const displayVerb = verb ?? VERBS[verbIdx];
    return (_jsxs(Box, { children: [_jsxs(Text, { color: "cyan", children: [FRAMES[frame], " "] }), _jsxs(Text, { color: "cyan", dimColor: true, children: [displayVerb, "\u2026"] })] }));
}
//# sourceMappingURL=Spinner.js.map