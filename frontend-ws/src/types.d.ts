export interface IncomingMessage {
    type: string;
    payload: Message[] | Message;
}

export interface Message {
    x: number;
    y: number;
}