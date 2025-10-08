import express from "express";
import expressWs from "express-ws";
import cors from "cors";
import WebSocket from "ws";

interface incomingMessage {
    type: string;
    payload: {};
}

const port = 8000;
const app = express();
const router = express.Router();
const wsInstance = expressWs(app);

wsInstance.applyTo(router);

app.use(cors());

const connectionClients: WebSocket[] = [];
const messages: incomingMessage[] = [];

router.ws('/canvas-ws', (ws, _req) => {
    connectionClients.push(ws);
    ws.send(JSON.stringify(messages));

    let username = "Anonymous";
    ws.on('message', (message) => {

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