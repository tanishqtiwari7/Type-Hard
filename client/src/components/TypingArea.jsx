import React, { useEffect } from "react";
import gsap from "gsap";
import { FaRedoAlt } from "react-icons/fa";

const TypingArea = ({
  text,
  userInput,
  timeLeft,
  status,
  wpm,
  acc,
  inputRef,
  wordsContainerRef,
  cursorRef,
  resetGame,
  handleInput,
}) => {
  // Cursor Animation
  useEffect(() => {
    if (wordsContainerRef.current && status !== "finished") {
      const charElements =
        wordsContainerRef.current.querySelectorAll(".data-char");
      const currentIndex = userInput.length;

      if (charElements[currentIndex]) {
        const charRect = charElements[currentIndex].getBoundingClientRect();
        const containerRect = wordsContainerRef.current.getBoundingClientRect();

        gsap.to(cursorRef.current, {
          left: charRect.left - containerRect.left - 2,
          top: charRect.top - containerRect.top + 4,
          duration: 0.1,
          ease: "power2.out",
        });
      }
    }
  }, [userInput, status, text]);

  return (
    <div
      className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center mt-12 relative outline-none"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Header Info */}
      <div className="flex w-full justify-between items-end text-cskYellow font-bold mb-4 font-mono select-none px-4">
        <div className="text-textGray text-xl flex gap-4">
          {status === "finished" ? (
            "Result"
          ) : (
            <>
              <span className="text-cskYellow">{timeLeft}s</span>
              <span className="hidden md:inline text-sm opacity-50 self-center">
                time
              </span>
            </>
          )}
        </div>
        {status === "playing" && (
          <div className="text-3xl opacity-20">{wpm}</div>
        )}
      </div>

      {/* Hidden Input */}
      <input
        ref={inputRef}
        className="absolute opacity-0 -z-10"
        value={userInput}
        onChange={handleInput}
        autoFocus
        tabIndex={0}
      />

      {/* Typing Area */}
      <div className="relative w-full min-h-[160px] bg-halkaBlack/0 p-4 rounded-xl">
        {/* Text Container */}
        <div
          ref={wordsContainerRef}
          className={`relative text-2xl md:text-3xl leading-relaxed font-mono w-full break-words whitespace-pre-wrap cursor-text select-none text-left transition-all duration-300 ${
            status === "finished" ? "blur-sm opacity-50 grayscale" : ""
          }`}
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          {/* Cursor Element */}
          {status !== "finished" && (
            <div
              ref={cursorRef}
              className="absolute w-[2px] h-[36px] bg-cskYellow rounded-full z-10 transition-opacity duration-75"
              style={{ left: 0, top: 0 }}
            />
          )}

          {text.split("").map((char, index) => {
            let className = "text-textGray transition-colors duration-100";
            const inputChar = userInput[index];

            if (inputChar != null) {
              className = inputChar === char ? "text-textWhite" : "text-error";
            }

            return (
              <span key={index} className={`data-char relative ${className}`}>
                {char}
              </span>
            );
          })}
        </div>

        {/* Result Overlay */}
        {status === "finished" && (
          <div className="absolute inset-0 flex items-center justify-center z-20 animate-in fade-in duration-500">
            <div className="flex gap-16 text-center">
              <div className="group">
                <div className="text-sm text-textGray uppercase tracking-widest mb-2">
                  WPM
                </div>
                <div className="text-6xl font-black text-cskYellow drop-shadow-[0_0_15px_rgba(226,183,20,0.3)]">
                  {wpm}
                </div>
              </div>
              <div>
                <div className="text-sm text-textGray uppercase tracking-widest mb-2">
                  ACC
                </div>
                <div className="text-6xl font-black text-cskYellow drop-shadow-[0_0_15px_rgba(226,183,20,0.3)]">
                  {acc}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Control Actions */}
      <div className="mt-16 flex gap-4 opacity-70 hover:opacity-100 transition-opacity">
        <button
          onClick={resetGame}
          className="flex items-center gap-2 bg-[#323437] hover:bg-white hover:text-[#1b1b1b] text-textGray px-8 py-3 rounded-lg transition-all font-mono group"
          title="Restart Test"
        >
          <FaRedoAlt className="group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-sm tracking-widest uppercase">Restart</span>
        </button>
      </div>

      <div className="mt-8 text-xs text-textGray/40 font-mono">
        <span className="border border-white/10 px-2 py-1 rounded kbd">
          Tab
        </span>{" "}
        to restart
      </div>
    </div>
  );
};

export default TypingArea;
