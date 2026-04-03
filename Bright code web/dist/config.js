import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
let cachedConfig = null;
function parseScalar(raw) {
    const v = raw.trim();
    if ((v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))) {
        return v.slice(1, -1);
    }
    return v;
}
function parseYamlObject(content) {
    const root = {};
    const stack = [
        { indent: -1, obj: root },
    ];
    const lines = content.split(/\r?\n/);
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#'))
            continue;
        const match = line.match(/^(\s*)([^:]+):(.*)$/);
        if (!match)
            continue;
        const indent = match[1].length;
        const key = match[2].trim();
        const value = match[3].trim();
        while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
            stack.pop();
        }
        const parent = stack[stack.length - 1].obj;
        if (!value) {
            const child = {};
            parent[key] = child;
            stack.push({ indent, obj: child });
        }
        else {
            parent[key] = parseScalar(value);
        }
    }
    return root;
}
function assertString(value, keyName) {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new Error(`config.yaml is missing required string field: ${keyName}`);
    }
    return value;
}
function getObject(value) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        return value;
    }
    return null;
}
function parseBoolean(value, fallback) {
    if (typeof value === 'boolean')
        return value;
    if (typeof value !== 'string')
        return fallback;
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true')
        return true;
    if (normalized === 'false')
        return false;
    return fallback;
}
function parseCsv(value) {
    if (typeof value !== 'string')
        return [];
    return value
        .split(',')
        .map(v => v.trim())
        .filter(Boolean);
}
export function loadConfig() {
    if (cachedConfig)
        return cachedConfig;
    const configPath = resolve(process.cwd(), 'config.yaml');
    if (!existsSync(configPath)) {
        throw new Error(`config.yaml not found at ${configPath}. Create it from config.example.yaml.`);
    }
    const raw = readFileSync(configPath, 'utf-8');
    const parsed = parseYamlObject(raw);
    const provider = getObject(parsed.provider) ?? parsed;
    const skillsConfig = getObject(parsed.skills);
    cachedConfig = {
        apiKey: assertString(provider.apiKey, 'provider.apiKey'),
        baseUrl: assertString(provider.baseUrl, 'provider.baseUrl'),
        model: assertString(provider.model, 'provider.model'),
        skills: {
            enabled: parseBoolean(skillsConfig?.enabled, false),
            directory: (typeof skillsConfig?.directory === 'string' && skillsConfig.directory.trim()) ||
                './skills',
            include: parseCsv(skillsConfig?.include),
        },
    };
    return cachedConfig;
}
//# sourceMappingURL=config.js.map