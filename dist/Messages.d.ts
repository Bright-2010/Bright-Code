import type { MessageKind } from './types.js';
interface MessageRowProps {
    message: MessageKind;
}
export declare function MessageRow({ message }: MessageRowProps): import("react/jsx-runtime").JSX.Element;
interface MessagesProps {
    messages: MessageKind[];
}
export declare function Messages({ messages }: MessagesProps): import("react/jsx-runtime").JSX.Element;
export {};
