import { generateWords } from "../utils/words.js";

export function initSocket(io) {
  const rooms = {};

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("create-room", ({ roomId, username }) => {
      rooms[roomId] = {
        roomId,
        hostId: socket.id,
        players: [],
        state: "waiting",
        settings: { wordCount: 30 },
        quote: generateWords(30),
      };
      socket.join(roomId);
      rooms[roomId].players.push({
        id: socket.id,
        username,
        progress: 0,
        wpm: 0,
        isHost: true,
      });
      socket.emit("room-joined", rooms[roomId]); // Send initial state back to creator
    });

    socket.on("join-room", ({ roomId, username }) => {
      if (rooms[roomId]) {
        rooms[roomId].players.push({
          id: socket.id,
          username,
          progress: 0,
          wpm: 0,
          isHost: false,
        });
        socket.join(roomId);
        io.to(roomId).emit("room-update", rooms[roomId]);
        socket.emit("room-joined", rooms[roomId]);
      } else {
        socket.emit("error", "Room not found");
      }
    });

    socket.on("update-settings", ({ roomId, settings }) => {
      if (rooms[roomId] && rooms[roomId].hostId === socket.id) {
        rooms[roomId].settings = settings;
        // Regenerate quote if word count changed
        if (settings.wordCount) {
          rooms[roomId].quote = generateWords(settings.wordCount);
        }
        io.to(roomId).emit("room-update", rooms[roomId]);
      }
    });

    socket.on("kick-player", ({ roomId, targetId }) => {
      if (rooms[roomId] && rooms[roomId].hostId === socket.id) {
        const playerIndex = rooms[roomId].players.findIndex(
          (p) => p.id === targetId
        );
        if (playerIndex !== -1) {
          rooms[roomId].players.splice(playerIndex, 1);
          io.to(roomId).emit("room-update", rooms[roomId]);

          // Notify the kicked player
          io.to(targetId).emit("kicked");
          io.sockets.sockets.get(targetId)?.leave(roomId);
        }
      }
    });

    socket.on("start-game", (roomId) => {
      if (rooms[roomId] && rooms[roomId].hostId === socket.id) {
        rooms[roomId].state = "playing";
        rooms[roomId].startTime = Date.now();
        // Reset progress for everyone
        rooms[roomId].players.forEach((p) => {
          p.progress = 0;
          p.wpm = 0;
        });

        io.to(roomId).emit("room-update", rooms[roomId]);
        io.to(roomId).emit("game-started", rooms[roomId].startTime);
      }
    });

    socket.on("typing-progress", ({ roomId, progress, wpm }) => {
      if (rooms[roomId]) {
        const player = rooms[roomId].players.find((p) => p.id === socket.id);
        if (player) {
          player.progress = progress;
          player.wpm = wpm;
          io.to(roomId).emit("room-update", rooms[roomId]);
        }
      }
    });

    socket.on("disconnect", () => {
      for (const roomId in rooms) {
        const room = rooms[roomId];
        const playerIndex = room.players.findIndex((p) => p.id === socket.id);
        if (playerIndex !== -1) {
          room.players.splice(playerIndex, 1);
          if (room.players.length === 0) {
            delete rooms[roomId];
          } else {
            io.to(roomId).emit("room-update", room);
          }
          break;
        }
      }
    });
  });
}
