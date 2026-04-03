// ─── Message Types (mirrors Bright Code's src/types/message.ts) ──────────────
let _msgId = 0;
export function nextId() {
    return `msg-${++_msgId}`;
}
//# sourceMappingURL=types.js.map