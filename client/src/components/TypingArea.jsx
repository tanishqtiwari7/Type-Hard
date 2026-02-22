import React, { useState, useEffect } from "react";
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
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    if (wordsContainerRef.current && status !== "finished") {
      const charElements = wordsContainerRef.current.querySelectorAll(".data-char");
      const currentIndex = userInput.length;

      if (charElements[currentIndex]) {
        const charEl = charElements[currentIndex];
        const left = charEl.offsetLeft;
        const top = charEl.offsetTop;

        gsap.to(cursorRef.current, {
          left: left - 2,
          top: top + 4,
          duration: 0.08,
          ease: "power2.out",
        });

        // 5-line logic: trigger scroll when user moves past the 3rd line
        const lineHeight = 44; 
        const triggerPoint = lineHeight * 2; 

        if (top > scrollOffset + triggerPoint) {
          setScrollOffset(top - triggerPoint);
        } else if (top < scrollOffset) {
          setScrollOffset(top);
        }
      }
    } else if (status === "waiting") {
      setScrollOffset(0);
    }
  }, [userInput, status, scrollOffset, wordsContainerRef, cursorRef]);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center mt-12 relative outline-none">
      <div className="flex w-full justify-between items-end text-cskYellow font-bold mb-4 font-mono px-4">
        <span className="text-2xl">{timeLeft}s</span>
       
      </div>

      <input
        ref={inputRef}
        className="absolute opacity-0"
        value={userInput}
        onChange={handleInput}
        autoFocus
      />

      <div 
        className="relative w-full overflow-hidden" 
        style={{ 
          height: '225px', // Exactly 5 lines
          maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
        }}
      >
        <div
          ref={wordsContainerRef}
          className={`relative text-3xl leading-[44px] font-mono w-full break-words whitespace-pre-wrap transition-transform duration-300 ${
            status === "finished" ? "blur-md opacity-20" : ""
          }`}
          style={{ 
            fontFamily: '"JetBrains Mono", monospace',
            transform: `translateY(-${scrollOffset}px)` 
          }}
        >
          {status !== "finished" && (
            <div
              ref={cursorRef}
              className="absolute w-[2px] h-[32px] bg-cskYellow z-10"
              style={{ left: 0, top: 0 }}
            />
          )}

          {text.split("").map((char, index) => {
            let colorClass = "text-textGray/40";
            if (userInput[index] != null) {
              colorClass = userInput[index] === char ? "text-white" : "text-red-500";
            }
            return (
              <span key={index} className={`data-char ${colorClass}`}>
                {char}
              </span>
            );
          })}
        </div>

        {status === "finished" && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="flex gap-16 text-center bg-[#1b1b1b] p-10 rounded-3xl border border-white/10 shadow-2xl">
              <div>
                <div className="text-xs text-textGray uppercase tracking-widest mb-2">WPM</div>
                <div className="text-7xl font-black text-cskYellow">{wpm}</div>
              </div>
              <div>
                <div className="text-xs text-textGray uppercase tracking-widest mb-2">Accuracy</div>
                <div className="text-7xl font-black text-cskYellow">{acc}%</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <button onClick={resetGame} className="mt-12 flex items-center gap-2 text-textGray hover:text-white transition-all uppercase tracking-tighter text-sm bg-white/5 px-4 py-2 rounded-md">
        <FaRedoAlt /> Restart Test
      </button>
    </div>
  );
};

export default TypingArea;