import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import useStore from "../store/useStore";
import { FaCopy, FaPlay, FaUsers } from "react-icons/fa";
import gsap from "gsap";

// Socket Endpoint
const ENDPOINT = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Multiplayer = () => {
  const { user } = useStore();
  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [inRoom, setInRoom] = useState(false);
  const [gameState, setGameState] = useState("menu"); // menu, waiting, playing, finished
  const [players, setPlayers] = useState([]);
  const [text, setText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);

  const inputRef = useRef(null);

  useEffect(() => {
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);

    newSocket.on("room-joined", (roomData) => {
      setInRoom(true);
      setGameState("waiting");
      setPlayers(roomData.players);
      setText(roomData.quote);
      setRoomId(roomId); // Ensure logic matches
    });

    newSocket.on("room-update", (roomData) => {
      setPlayers(roomData.players);
    });

    newSocket.on("game-started", (startTimestamp) => {
      setGameState("playing");
      setStartTime(startTimestamp);
      setUserInput("");
      inputRef.current?.focus();
    });

    return () => newSocket.close();
  }, []);

  const createRoom = () => {
    if (!socket) return;
    const newRoomId = Math.random().toString(36).substring(7);
    setRoomId(newRoomId);
    socket.emit("create-room", {
      roomId: newRoomId,
      username: user?.username || "Guest",
    });
  };

  const joinRoom = () => {
    if (!socket || !roomId) return;
    socket.emit("join-room", { roomId, username: user?.username || "Guest" });
  };

  const startGame = () => {
    socket.emit("start-game", roomId);
  };

  const handleTyping = (e) => {
    if (gameState !== "playing") return;
    const value = e.target.value;
    setUserInput(value);

    // Calc progress
    const progress = Math.min(
      100,
      Math.round((value.length / text.length) * 100)
    );

    // Simple WPM
    const timeMinutes = (Date.now() - startTime) / 60000;
    const wpm =
      timeMinutes > 0 ? Math.round(value.length / 5 / timeMinutes) : 0;

    socket.emit("typing-progress", { roomId, progress, wpm });

    if (value === text) {
      // Finished
    }
  };

  if (!inRoom) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] font-mono">
        <h1 className="text-4xl text-textWhite font-bold mb-10 flex items-center gap-3">
          <FaUsers className="text-cskYellow" /> Multiplayer Arena
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
          <div className="bg-[#2c2e31] p-8 rounded-xl border border-white/5 flex flex-col items-center text-center hover:border-cskYellow/30 transition-colors">
            <h2 className="text-xl text-textWhite font-bold mb-4">
              Create Room
            </h2>
            <p className="text-textGray text-sm mb-6">
              Start a new lobby and invite your friends to race.
            </p>
            <button
              onClick={createRoom}
              className="bg-cskYellow text-halkaBlack font-bold px-6 py-3 rounded w-full hover:bg-yellow-400 transition-colors"
            >
              Create Lobby
            </button>
          </div>

          <div className="bg-[#2c2e31] p-8 rounded-xl border border-white/5 flex flex-col items-center text-center hover:border-cskYellow/30 transition-colors">
            <h2 className="text-xl text-textWhite font-bold mb-4">Join Room</h2>
            <p className="text-textGray text-sm mb-6">
              Enter a Room ID to join an existing lobby.
            </p>
            <input
              type="text"
              placeholder="Room ID"
              className="bg-halkaBlack text-textWhite px-4 py-2 rounded w-full mb-4 border border-white/10 focus:border-cskYellow outline-none text-center"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button
              onClick={joinRoom}
              className="bg-white/10 text-white font-bold px-6 py-3 rounded w-full hover:bg-white/20 transition-colors"
            >
              Join Lobby
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto pt-10 font-mono">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <span className="text-textGray">Room ID:</span>
          <span className="text-xl text-white font-bold bg-[#2c2e31] px-3 py-1 rounded select-all">
            {roomId}
          </span>
          <button className="text-cskYellow hover:text-white">
            <FaCopy />
          </button>
        </div>
        {gameState === "waiting" && (
          <button
            onClick={startGame}
            className="flex items-center gap-2 bg-cskYellow text-halkaBlack font-bold px-6 py-2 rounded hover:brightness-110"
          >
            <FaPlay size={12} /> Start Race
          </button>
        )}
      </div>

      {/* Race Track */}
      <div className="flex flex-col gap-4 mb-12">
        {players.map((player) => (
          <div
            key={player.id}
            className="bg-[#2c2e31] p-4 rounded-lg border border-white/5"
          >
            <div className="flex justify-between mb-2 text-sm text-textGray">
              <span>
                {player.username} {player.id === socket.id && "(You)"}
              </span>
              <span>{player.wpm || 0} WPM</span>
            </div>
            <div className="w-full bg-halkaBlack h-2 rounded-full overflow-hidden">
              <div
                className="bg-cskYellow h-full transition-all duration-500 ease-out"
                style={{ width: `${player.progress || 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Typing Area (Simplified for Multiplayer) */}
      {gameState === "playing" && (
        <div className="relative">
          <div className="text-2xl text-textGray leading-relaxed break-keep select-none">
            {text.split("").map((char, i) => {
              let color = "text-textGray";
              if (i < userInput.length) {
                color = userInput[i] === char ? "text-textWhite" : "text-error";
              }
              return (
                <span key={i} className={color}>
                  {char}
                </span>
              );
            })}
          </div>
          <input
            ref={inputRef}
            className="absolute opacity-0 top-0 left-0 h-full w-full cursor-default"
            value={userInput}
            onChange={handleTyping}
            autoFocus
          />
        </div>
      )}

      {gameState === "waiting" && (
        <div className="text-center text-textGray opacity-50 mt-20">
          Waiting for host to start...
        </div>
      )}
    </div>
  );
};

export default Multiplayer;
