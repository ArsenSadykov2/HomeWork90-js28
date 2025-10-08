import express from "express";
import expressWs from "express-ws";
import cors from "cors";
import WebSocket from "ws";

interface Message {
    x: number;
    y: number;
}

interface incomingMessage {
    type: string;
    payload: Message;
}

const port = 8000;
const app = express();
const router = express.Router();
const wsInstance = expressWs(app);

wsInstance.applyTo(router);

app.use(cors());

const connectionClients: WebSocket[] = [];
const messages: Message[] = [];

router.ws('/canvas-ws', (ws, _req) => {
    connectionClients.push(ws);
    ws.send(JSON.stringify({
        type: 'ALL_MESSAGE',
        payload: messages,
    }));

    ws.on('message', (message) => {
        try{
            const decodedMessage = JSON.parse(message.toString()) as incomingMessage;
            if(decodedMessage.type === 'SEND_MESSAGE') {
                messages.push(decodedMessage.payload)
                connectionClients.forEach(clientMs => {
                    clientMs.send(JSON.stringify({
                        type: "NEW_MESSAGE",
                        payload: decodedMessage.payload,
                    }));
                });
            }
        } catch (e) {
            ws.send(JSON.stringify({error: "Invalid message"}));
        }
    });

    ws.on('close', () => {
        const index = connectionClients.indexOf(ws);
        connectionClients.splice(index, 1);
    });
});

app.use(router);
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})