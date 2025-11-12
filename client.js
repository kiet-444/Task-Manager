const {io} = require( "socket.io-client");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("✅ Connected to server");

  socket.emit("joinRoom", { conversationId: 1 });

  setTimeout(() => {
    socket.emit("sendMessage", {
      senderId: 1,
      conversationId: 1,
      content: "Hello from Node client!",
    });
  }, 2000);
});

socket.on("joinedRoom", (roomId) => {
  console.log("Joined room:", roomId);
});

socket.on("receiveMessage", (message) => {
  console.log("📩 New message:", message);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});