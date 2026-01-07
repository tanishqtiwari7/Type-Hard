export function initSocket(io) {
  const rooms = {};

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("create-room", ({ roomId, username }) => {
      rooms[roomId] = { players: [], state: "waiting", quote: "The quick brown fox jumps over the lazy dog" };
      socket.join(roomId);
      rooms[roomId].players.push({ id: socket.id, username, progress: 0, wpm: 0 });
      socket.emit("room-joined", rooms[roomId]); // Send initial state back to creator
    });

    socket.on("join-room", ({ roomId, username }) => {
      if (rooms[roomId]) {
        rooms[roomId].players.push({ id: socket.id, username, progress: 0, wpm: 0 });
        socket.join(roomId);
        io.to(roomId).emit("room-update", rooms[roomId]);
        socket.emit("room-joined", rooms[roomId]);
      } else {
        socket.emit("error", "Room not found");
      }
    });

    socket.on("start-game", (roomId) => {
      if (rooms[roomId]) {
        rooms[roomId].state = "playing";
        rooms[roomId].startTime = Date.now();
        io.to(roomId).emit("game-started", rooms[roomId].startTime);
      }
    });

    socket.on("typing-progress", ({ roomId, progress, wpm }) => {
      if (rooms[roomId]) {
        const player = rooms[roomId].players.find(p => p.id === socket.id);
        if (player) {
          player.progress = progress;
          player.wpm = wpm;
          io.to(roomId).emit("room-update", rooms[roomId]);
        }
      }
    });

    socket.on("disconnect", () => {
       // Ideally remove player from room
       // rooms[roomId].players = ...
    });
  });
}
