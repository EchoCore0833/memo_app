export function initializeWebSocket(options = {}) {
    const socket = new WebSocket("ws://localhost:3000/ws");

    socket.addEventListener("open", () => {
        console.log("WebSocket connected");
    });

    socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);

        console.log("Memo changed:", data);

        if (typeof options.onMemoChanged === "function") {
            options.onMemoChanged(data);
        }
    });

    socket.addEventListener("close", () => {
        console.log("WebSocket disconnected");
    });

    socket.addEventListener("error", (error) => {
        console.error("WebSocket error:", error);
    });

    return socket;
}