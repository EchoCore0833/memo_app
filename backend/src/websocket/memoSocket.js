import { WebSocketServer, WebSocket } from "ws";

let wss;

export function initializeMemoSocket(server) {
    wss = new WebSocketServer({
        server,
        path: "/ws"
    });

    wss.on("connection", (socket) => {
        console.log("WebSocket connected");

        socket.on("close", () => {
            console.log("WebSocket disconnected");
        });

        socket.on("error", (error) => {
            console.error("WebSocket error:", error);
        });
    });

    return wss;
}

export function broadcastMemoChange(event) {
    if (!wss) {
        console.error("WebSocket server is not initialized.");
        return;
    }

    const message = JSON.stringify(event);

    for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    }
}