export interface AppConfig {
    apiKey: string;
    baseUrl: string;
    model: string;
    skills: {
        enabled: boolean;
        directory: string;
        include: string[];
    };
}
export declare function loadConfig(): AppConfig;
