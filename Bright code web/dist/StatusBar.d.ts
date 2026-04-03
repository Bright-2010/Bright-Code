import type { AppStatus } from './useAppState.js';
interface StatusBarProps {
    status: AppStatus;
    messageCount: number;
    cwd: string;
}
export declare function StatusBar({ status, messageCount, cwd }: StatusBarProps): import("react/jsx-runtime").JSX.Element;
export {};
