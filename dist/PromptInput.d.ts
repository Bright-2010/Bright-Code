interface PromptInputProps {
    value: string;
    onChange: (v: string) => void;
    onSubmit: (v: string) => void;
    disabled?: boolean;
    placeholder?: string;
}
export declare function PromptInput({ value, onChange, onSubmit, disabled, placeholder, }: PromptInputProps): import("react/jsx-runtime").JSX.Element;
export {};
