import {useEffect, useRef, type MouseEvent} from "react";
import './App.css';
import type {IncomingMessage} from "./types";

const App = () => {
    const ws= useRef<WebSocket | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:8000/canvas-ws");

        ws.current.onmessage = (event) => {
            const decodedMessage = JSON.parse(event.data) as IncomingMessage;
            const current = canvasRef.current?.getContext('2d');
            if(!current) return;
            if(decodedMessage.type === "ALL_MESSAGE" && Array.isArray(decodedMessage.payload)) {
                decodedMessage.payload.forEach(message => {
                    current.fillRect(message.x, message.y, 2, 2);
                })
            }
            if(decodedMessage.type === "NEW_MESSAGE" && !Array.isArray(decodedMessage.payload)) {
                current.fillRect(decodedMessage.payload.x, decodedMessage.payload.y, 2, 2);
            }
        };

        return () => {
            if(ws.current) {
                ws.current.close();
            }
        }
    }, []);

    const canvasDraw = (e: MouseEvent<HTMLCanvasElement>) => {
        if(!canvasRef.current || !ws.current) {
            return;
        }
        const current = canvasRef.current.getContext('2d');
        if(!current) return;
        const x = e.clientX - 50;
        const y = e.clientY - 50;
        current.fillRect(x, y, 2, 2);
        ws.current.send(JSON.stringify({
            type: 'SEND_MESSAGE',
            payload: {x, y},
        }));
    }
    return (
        <div className="container">
            <canvas
                className={"canvas"}
                onMouseMove={canvasDraw}
                ref={canvasRef}
                width={300}
                height={150}
            >

            </canvas>
        </div>
    )
};

export default App
