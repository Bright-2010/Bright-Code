export declare const TOOL_DEFINITIONS: readonly [{
    readonly name: "bash";
    readonly description: "Execute a shell command. Use for: running code, git commands, listing files, installing packages, etc.";
    readonly input_schema: {
        readonly type: "object";
        readonly properties: {
            readonly command: {
                readonly type: "string";
                readonly description: "The shell command to run";
            };
            readonly description: {
                readonly type: "string";
                readonly description: "Brief human-readable description";
            };
        };
        readonly required: readonly ["command"];
    };
}, {
    readonly name: "read_file";
    readonly description: "Read the entire contents of a file.";
    readonly input_schema: {
        readonly type: "object";
        readonly properties: {
            readonly path: {
                readonly type: "string";
                readonly description: "Path to the file";
            };
        };
        readonly required: readonly ["path"];
    };
}, {
    readonly name: "write_file";
    readonly description: "Create or overwrite a file with given content.";
    readonly input_schema: {
        readonly type: "object";
        readonly properties: {
            readonly path: {
                readonly type: "string";
                readonly description: "File path to write";
            };
            readonly content: {
                readonly type: "string";
                readonly description: "File content";
            };
        };
        readonly required: readonly ["path", "content"];
    };
}, {
    readonly name: "list_files";
    readonly description: "List files and directories at a path.";
    readonly input_schema: {
        readonly type: "object";
        readonly properties: {
            readonly path: {
                readonly type: "string";
                readonly description: "Directory path (default: current dir)";
            };
        };
        readonly required: readonly [];
    };
}];
export type ToolName = 'bash' | 'read_file' | 'write_file' | 'list_files';
export type ToolInput = Record<string, string>;
export declare function executeTool(name: ToolName, input: ToolInput): Promise<string>;
