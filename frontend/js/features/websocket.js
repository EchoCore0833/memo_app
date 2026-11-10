export function initializeWebSocket(options = {}) {
    // E担当: WebSocketサーバーに接続する

    // サーバーからメモ変更通知を受け取ったら
    // options.onMemoChanged() を呼び出す
    const socket = io("http://localhost:3000");

    socket.on("connect", () =>{
        console.log("WebSocket connected:", socket.id);
    });

    socket.on("memo_changed", (event) =>{
        console.log("Memo changed:", event);

        if(typeof options.onMemoChanged ==="function"){
            options.onMemoChanged(event);
        }
    });

    socket.on("connect_error",(error)=>{
        console.error("WebSocket connection error:",error.message);
    });

    return socket;

}