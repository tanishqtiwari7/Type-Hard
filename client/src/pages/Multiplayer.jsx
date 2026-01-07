import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import useStore from "../store/useStore";
import toast from "react-hot-toast";
import { FaCopy, FaPlay, FaUsers, FaTimes, FaCog } from "react-icons/fa";
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
  const [isHost, setIsHost] = useState(false);
  const [settings, setSettings] = useState({ wordCount: 30 });

  const inputRef = useRef(null);

  useEffect(() => {
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);

    newSocket.on("room-joined", (roomData) => {
      setInRoom(true);
      setGameState("waiting");
      setPlayers(roomData.players);
      setText(roomData.quote);
      setRoomId(roomData.roomId);
      setSettings(roomData.settings || { wordCount: 30 });
      setIsHost(roomData.hostId === newSocket.id);
      toast.success("Joined Room!");
    });

    newSocket.on("room-update", (roomData) => {
      setPlayers(roomData.players);
      setText(roomData.quote);
      setSettings(roomData.settings || { wordCount: 30 });
      // Update host status in case host changed (not implemented yet but good practice)
      if (roomData.hostId === newSocket.id) setIsHost(true);
    });

    newSocket.on("error", (msg) => {
      toast.error(msg);
    });

    newSocket.on("kicked", () => {
      toast.error("You were kicked by the host");
      setInRoom(false);
      setRoomId("");
      setPlayers([]);
      setGameState("menu");
    });

    newSocket.on("game-started", (startTimestamp) => {
      setGameState("playing");
      setStartTime(startTimestamp);
      setUserInput("");
      setTimeout(() => inputRef.current?.focus(), 100);
      toast("Race Started!", { icon: "🏎️" });
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

  const kickPlayer = (targetId) => {
    if (window.confirm("Kick this player?")) {
      socket.emit("kick-player", { roomId, targetId });
    }
  };

  const updateSettings = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    socket.emit("update-settings", { roomId, settings: newSettings });
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
      setGameState("finished");
      toast.success(`Finished! ${wpm} WPM`);
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
          <button
            onClick={() => {
              navigator.clipboard.writeText(roomId);
              toast.success("Room ID copied!");
            }}
            className="text-cskYellow hover:text-white"
          >
            <FaCopy />
          </button>
        </div>
        {gameState === "waiting" && isHost && (
          <div className="flex items-center gap-4">
            {/* Settings Dropdown */}
            <div className="flex items-center gap-2 bg-[#2c2e31] px-4 py-2 rounded">
              <span className="text-sm text-textGray">
                <FaCog className="inline mr-1" /> Words:
              </span>
              <select
                value={settings.wordCount}
                onChange={(e) =>
                  updateSettings("wordCount", Number(e.target.value))
                }
                className="bg-transparent text-cskYellow outline-none font-bold cursor-pointer"
              >
                <option value="10">10</option>
                <option value="30">30</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            <button
              onClick={startGame}
              className="flex items-center gap-2 bg-cskYellow text-halkaBlack font-bold px-6 py-2 rounded hover:brightness-110"
            >
              <FaPlay size={12} /> Start Race
            </button>
          </div>
        )}
        {gameState === "waiting" && !isHost && (
          <div className="text-textGray animate-pulse">Waiting for host...</div>
        )}
      </div>

      {/* Race Track */}
      <div className="flex flex-col gap-4 mb-12">
        {players.map((player) => (
          <div
            key={player.id}
            className="bg-[#2c2e31] p-4 rounded-lg border border-white/5 relative group"
          >
            <div className="flex justify-between mb-2 text-sm text-textGray">
              <span>
                {player.username} {player.id === socket.id && "(You)"}{" "}
                {player.isHost && (
                  <FaUsers
                    className="inline ml-2 text-cskYellow"
                    title="Host"
                  />
                )}
              </span>
              <div className="flex items-center gap-4">
                <span>{player.wpm || 0} WPM</span>
                {isHost && player.id !== socket.id && (
                  <button
                    onClick={() => kickPlayer(player.id)}
                    className="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Kick Player"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
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
