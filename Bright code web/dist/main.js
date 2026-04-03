import { jsx as _jsx } from "react/jsx-runtime";
import { render } from 'ink';
import { REPLScreen } from './REPL.js';
import { loadConfig } from './config.js';
// ─── Guard: require valid YAML config ─────────────────────────────────────────
try {
    loadConfig();
}
catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`\n✗  ${msg}\n`);
    console.error('   Create ./config.yaml (see ./config.example.yaml)\n');
    process.exit(1);
}
// ─── Bootstrap ───────────────────────────────────────────────────────────────
const { waitUntilExit } = render(_jsx(REPLScreen, {}), {
    exitOnCtrlC: false, // We handle Ctrl+C ourselves
});
await waitUntilExit();
process.exit(0);
//# sourceMappingURL=main.js.map