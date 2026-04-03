# Bright Code — Agent Tools

This project is a Bright Code-style CLI clone built with React + Ink + TypeScript, with a complete terminal UI (TUI).

## Quick Start

```bash
# 1) Install dependencies
npm install

# 2) Create YAML config
cp config.example.yaml config.yaml
# Then edit config.yaml and set provider.apiKey / provider.baseUrl / provider.model

# 3) Start in development mode (no build required)
npm run dev

# Or build first, then run
npm run build && npm start
```

Example `config.yaml`:

```yaml
provider:
  apiKey: "sk-xxx"
  baseUrl: "https://api.moonshot.cn/v1"
  model: "moonshot-v1-8k"

skills:
  enabled: "true"
  directory: "./skills"
  # include: "general-coding,code-review.md"
```

## Skill Configuration (Generic)

- `skills.enabled`: enable skills (`"true"` / `"false"`)
- `skills.directory`: skill file directory (supports `.md`, `.txt`, `.skill`)
- `skills.include` (optional): comma-separated allowlist; if empty, all skill files in the directory are loaded

All loaded skill files are appended to the system prompt.
Recommended practice: keep one capability per skill file, for example:

- `skills/general-coding.md`
- `skills/code-review.md`
- `skills/frontend-ui.md`

## Project Structure

```text
.
├── main.tsx          # Entry point: render(<REPLScreen />)
├── REPL.tsx          # Main screen component
├── engine.ts         # Agentic query loop (LLM + tools)
├── index.ts          # Tool definitions and execution
├── config.ts         # YAML config loader
├── skills.ts         # Skill loader and prompt builder
├── types.ts          # Message and block types
├── useAppState.ts    # App state hook
├── Header.tsx        # Top header
├── Messages.tsx      # Message list rendering
├── PromptInput.tsx   # Prompt input with cursor controls
├── Spinner.tsx       # Loading animation
├── StatusBar.tsx     # Bottom status bar
├── HelpOverlay.tsx   # /help overlay panel
├── skills/           # Skill files
└── dist/             # Build output
```

## Built-in Tools

| Tool | Purpose |
|------|---------|
| `bash` | Execute shell commands |
| `read_file` | Read full file contents |
| `write_file` | Create or overwrite files |
| `list_files` | List directory contents |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Send message |
| `←` `→` | Move cursor |
| `Ctrl+A` / `Ctrl+E` | Jump to start / end of line |
| `Ctrl+K` | Delete to end of line |
| `Ctrl+U` | Delete to beginning of line |
| `Ctrl+C` | Cancel current request / exit |

## Slash Commands

| Command | Action |
|---------|--------|
| `/help` | Show / hide help panel |
| `/clear` | Clear conversation history |
| `/exit` | Exit the CLI |
