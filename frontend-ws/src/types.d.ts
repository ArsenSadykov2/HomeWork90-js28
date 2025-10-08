export interface IncomingMessage {
    type: string;
    payload: Message[];
}

export interface Message {
    x: number;
    y: number;
}