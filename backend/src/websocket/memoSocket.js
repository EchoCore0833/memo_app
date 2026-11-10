import { Server } from "socket.io";

let io;

export function initializeMemoSocket(server) {
    // E担当: WebSocketサーバーを初期化
    io = new Server(server,{
        cors: {
            origin:"http://localhost:8080",
            methods:["GET","POST","PUT","DELETE"]
        }
    });
    io.on("connection",(socket) =>{
        console.log("WebSoket connected:",socket.id);

        socket.on("disconnect", () =>{
            console.log("WebSocket disconnected:", socket.id);
        });
    });

    return io;
}

export function broadcastMemoChange(event) {
    // E担当: 接続中のブラウザに変更を通知
    if(!io) {
        console.error("WebSocket server is not initialized.");
        return;
    }

    io.emit("memo_changed",event);

}