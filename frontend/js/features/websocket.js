export function initializeWebSocket(options = {}) {
    let reconnecting = false;

    function connect() {
        const socket = new WebSocket("ws://localhost:3000/ws");

        socket.addEventListener("open", () => {
            console.log("WebSocket connected");

            if (reconnecting) {
                reconnecting = false;
                options.onMemoChanged?.();
            }
        });

        socket.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);
            options.onMemoChanged?.(data);
        });

        socket.addEventListener("close", () => {
            console.log("WebSocket disconnected");
            reconnecting = true;
            setTimeout(connect, 3000);
        });

        socket.addEventListener("error", (error) => {
            console.error("WebSocket error:", error);
        });
    }

    connect();
}