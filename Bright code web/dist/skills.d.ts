import type { AppConfig } from './config.js';
export interface SkillDefinition {
    name: string;
    prompt: string;
    source: string;
}
export declare function loadSkills(config: AppConfig): SkillDefinition[];
export declare function buildSkillPrompt(skills: SkillDefinition[]): string;
