import { TOOL_DEFINITIONS, executeTool } from './index.js';
import { nextId } from './types.js';
import { loadConfig } from './config.js';
import { buildSkillPrompt, loadSkills } from './skills.js';
const BASE_SYSTEM_PROMPT = `You are Bright Code, a helpful AI coding assistant running in the terminal.
You have tools to read/write files and run shell commands. Use them freely to help the user.
Be concise but thorough. State what you're about to do before using a tool.
Current working directory: ${process.cwd()}`;
function historyToOpenAIMessages(history) {
    const out = [];
    for (const msg of history) {
        if (msg.role === 'user') {
            if (typeof msg.content === 'string') {
                out.push({ role: 'user', content: msg.content });
            }
            continue;
        }
        if (msg.role === 'assistant') {
            if (typeof msg.content === 'string') {
                out.push({ role: 'assistant', content: msg.content });
            }
            else {
                const text = msg.content
                    .filter(block => block.type === 'text')
                    .map(block => block.text)
                    .join('\n')
                    .trim();
                if (text)
                    out.push({ role: 'assistant', content: text });
            }
        }
    }
    return out;
}
async function createCompletion(messages, signal) {
    const { apiKey, baseUrl, model } = loadConfig();
    const tools = TOOL_DEFINITIONS.map(tool => ({
        type: 'function',
        function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.input_schema,
        },
    }));
    const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        signal,
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model,
            max_tokens: 4096,
            messages,
            tools,
            tool_choice: 'auto',
        }),
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Kimi API ${response.status}: ${text}`);
    }
    const data = await response.json();
    const message = data.choices?.[0]?.message;
    if (!message)
        throw new Error('Kimi API returned no choices');
    return message;
}
// ─── Core Agentic Loop ────────────────────────────────────────────────────────
export async function runQuery(userInput, history, callbacks, signal) {
    const config = loadConfig();
    const skills = loadSkills(config);
    const systemPrompt = BASE_SYSTEM_PROMPT + buildSkillPrompt(skills);
    const messages = [...history, { role: 'user', content: userInput }];
    const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...historyToOpenAIMessages(history),
        { role: 'user', content: userInput },
    ];
    while (true) {
        if (signal?.aborted)
            throw new Error('Aborted');
        const assistant = await createCompletion(apiMessages, signal);
        const assistantText = (assistant.content ?? '').trim();
        const assistantReasoning = assistant.reasoning_content ?? null;
        const toolCalls = assistant.tool_calls ?? [];
        const assistantBlocks = [];
        if (assistantText) {
            callbacks.onText(assistantText);
            assistantBlocks.push({ type: 'text', text: assistantText });
        }
        for (const toolCall of toolCalls) {
            if (toolCall.type !== 'function')
                continue;
            let parsedInput = {};
            try {
                const raw = toolCall.function.arguments || '{}';
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object') {
                    parsedInput = parsed;
                }
            }
            catch (err) {
                const reason = err instanceof Error ? err.message : String(err);
                callbacks.onError(`Failed to parse tool arguments for ${toolCall.function.name}: ${reason}`);
            }
            const toolMsg = {
                kind: 'tool_use',
                id: nextId(),
                name: toolCall.function.name,
                input: parsedInput,
            };
            callbacks.onToolUse(toolMsg);
            assistantBlocks.push({
                type: 'tool_use',
                id: toolCall.id,
                name: toolCall.function.name,
                input: parsedInput,
            });
        }
        messages.push({
            role: 'assistant',
            content: assistantBlocks.length ? assistantBlocks : assistantText,
        });
        apiMessages.push({
            role: 'assistant',
            content: assistantText || null,
            tool_calls: toolCalls.length ? toolCalls : undefined,
            reasoning_content: assistantReasoning,
        });
        if (toolCalls.length === 0)
            break;
        const toolResults = [];
        for (const toolCall of toolCalls) {
            if (toolCall.type !== 'function')
                continue;
            let input = {};
            try {
                input = JSON.parse(toolCall.function.arguments || '{}');
            }
            catch {
                input = {};
            }
            const result = await executeTool(toolCall.function.name, input);
            const isError = result.startsWith('Error:');
            const resultMsg = {
                kind: 'tool_result',
                id: nextId(),
                toolName: toolCall.function.name,
                result,
                isError,
            };
            callbacks.onToolResult(resultMsg);
            toolResults.push({
                type: 'tool_result',
                tool_use_id: toolCall.id,
                content: result,
            });
            apiMessages.push({
                role: 'tool',
                tool_call_id: toolCall.id,
                name: toolCall.function.name,
                content: result,
            });
        }
        messages.push({
            role: 'user',
            content: toolResults,
        });
    }
    return messages;
}
//# sourceMappingURL=engine.js.map