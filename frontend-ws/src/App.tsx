import {useEffect, useRef} from "react";
import type {IncomingMessage} from "./types";
import './App.css';

const App = () => {
    const ws= useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:8000/canvas-ws");

        ws.current.onmessage = (event) => {
            const decodedMessage = JSON.parse(event.data) as IncomingMessage;
        };

        return () => {
            if(ws.current) {
                ws.current.close();
            }
        }
    }, []);
    return (
        <div className="container">
            <canvas className={"canvas"}>

            </canvas>
        </div>
    )
};

export default App
