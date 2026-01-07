import React from "react";
import TypingTest from "../components/TypingTest.jsx";
import useStore from "../store/useStore.js";
import { FaInfoCircle } from "react-icons/fa";

const Home = () => {
  const { user, config, setConfig } = useStore();

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-100px)] pt-4 pb-20">
      {/* Test Config Toolbar */}
      <div className="flex gap-4 mb-12 text-sm text-textGray font-mono bg-[#2c2e31] p-1 rounded-lg">
        {[15, 30, 60].map((time) => (
          <button
            key={time}
            onClick={() => setConfig({ duration: time })}
            className={`px-4 py-1 rounded transition-colors ${
              config.duration === time
                ? "text-cskYellow font-bold bg-white/5"
                : "hover:text-textWhite"
            }`}
          >
            {time}
          </button>
        ))}
      </div>

      <TypingTest />

      {/* Footer Info Area - Good place for keyboard shortcuts or tips */}
      <div className="fixed bottom-8 text-center text-textGray/30 text-xs font-mono select-none pointer-events-none">
        Type Hard &copy; 2026 &bull; Enterprise Grade Typing
      </div>
    </div>
  );
};

export default Home;
