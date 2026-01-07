export function initSocket(io) {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("create-room", (roomId) => {
      socket.join(roomId);
      socket.emit("room-created", roomId);
    });

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", socket.id);
    });

    socket.on("typing-progress", ({ roomId, progress }) => {
      socket.to(roomId).emit("opponent-progress", { id: socket.id, progress });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}
