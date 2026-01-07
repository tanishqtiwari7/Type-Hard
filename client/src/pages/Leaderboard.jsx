import React, { useEffect, useState } from "react";
import { GameService } from "../services/game.service";
import { FaCrown, FaUserCircle } from "react-icons/fa";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("60s"); // '15s', '60s', 'quote'

  useEffect(() => {
    fetchLeaderboard();
  }, [filter]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      // API currently doesn't support filter params in the controller fully,
      // but we prepared the frontend for it.
      const res = await GameService.getLeaderboard();
      if (res.data.success) {
        setLeaders(res.data.leaderboard);
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center pt-10 min-h-[80vh]">
      <h1 className="text-4xl font-bold text-textWhite mb-8 font-mono">
        <span className="text-cskYellow">
          <FaCrown className="inline mb-2" />
        </span>{" "}
        Leaderboard
      </h1>

      <div className="flex gap-4 mb-8">
        {["15s", "60s", "quote"].map((mode) => (
          <button
            key={mode}
            onClick={() => setFilter(mode)}
            className={`px-4 py-2 rounded font-mono text-sm transition-colors ${
              filter === mode
                ? "bg-cskYellow text-halkaBlack font-bold"
                : "text-textGray hover:text-textWhite bg-white/5"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className="w-full max-w-4xl bg-[#2c2e31] rounded-xl overflow-hidden shadow-lg border border-white/5">
        <div className="grid grid-cols-12 gap-4 p-4 bg-[#232528] text-textGray font-mono text-sm font-bold uppercase tracking-wider">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-5">User</div>
          <div className="col-span-2 text-right">WPM</div>
          <div className="col-span-2 text-right">Accuracy</div>
          <div className="col-span-2 text-right">Date</div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-textGray font-mono">
            Loading top scores...
          </div>
        ) : leaders.length === 0 ? (
          <div className="p-10 text-center text-textGray font-mono">
            No scores yet. Be the first!
          </div>
        ) : (
          leaders.map((entry, index) => (
            <div
              key={index}
              className={`grid grid-cols-12 gap-4 p-4 border-b border-white/5 items-center hover:bg-white/5 transition-colors font-mono ${
                index === 0 ? "text-cskYellow" : "text-textWhite"
              }`}
            >
              <div className="col-span-1 text-center font-bold">
                {index + 1}
              </div>
              <div className="col-span-5 flex items-center gap-3">
                {entry.picture ? (
                  <img
                    src={entry.picture}
                    alt="avatar"
                    className="w-8 h-8 rounded-full border border-white/10"
                  />
                ) : (
                  <FaUserCircle className="w-8 h-8 opacity-50" />
                )}
                <span>{entry.username}</span>
              </div>
              <div className="col-span-2 text-right font-bold text-xl">
                {entry.wpm}
              </div>
              <div className="col-span-2 text-right opacity-70">
                {entry.accuracy}%
              </div>
              <div className="col-span-2 text-right text-xs opacity-50">
                {new Date(entry.created_at).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
