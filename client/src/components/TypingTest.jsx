import React, { useState, useEffect, useRef } from "react";
import useStore from "../store/useStore";
import { FaRedoAlt, FaCrown } from "react-icons/fa";
import gsap from "gsap";

const WORDS_LIST = "the be of and a to in he have it that for they I with as not on she at by this we you do but from or which one would all will there say who make when can more if no man out other so what time up go about than into could state only new year some take come these know see use get like then first any work now may such give over think most even find day also after way many must look before great back through long where much should well people down own just because good each those feel seem how high too place little world very still nation hand old life tell write become here show house both between need mean call develop under last right move thing general school never same another begin while number part turn real leave might want point form off child few small since against ask late home interest large person end open public follow during present without again hold govern around possible head consider word program problem however lead system set order eye plan run keep face fact group play stand increase early course change help line".split(" ");

const generateWords = (count = 50) => {
  return new Array(count).fill(0).map(() => WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)]).join(" ");
};

const TypingTest = () => {
  const { config, resetStats } = useStore();
  const [text, setText] = useState(generateWords(50));
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(config.duration);
  const [status, setStatus] = useState("waiting"); // waiting, playing, finished
  const [wpm, setWpm] = useState(0);
  const [acc, setAcc] = useState(100);
  
  const inputRef = useRef(null);
  const wordsContainerRef = useRef(null);
  const cursorRef = useRef(null);

  // Focus input automatically
  useEffect(() => {
    if (status !== "finished") {
        inputRef.current?.focus();
    }
  }, [status]);

  useEffect(() => {
    resetGame();
  }, [config.duration, config.mode]);

  // Cursor Animation Sync
  useEffect(() => {
    if (wordsContainerRef.current && status !== 'finished') {
        const charElements = wordsContainerRef.current.querySelectorAll('.data-char');
        const currentIndex = userInput.length;
        
        if (charElements[currentIndex]) {
            const charRect = charElements[currentIndex].getBoundingClientRect();
            const containerRect = wordsContainerRef.current.getBoundingClientRect();
            
            // GSAP animation for smooth cursor movement
            gsap.to(cursorRef.current, {
                left: charRect.left - containerRect.left - 2,
                top: charRect.top - containerRect.top + 4,
                duration: 0.1,
                ease: "power2.out"
            });
        }
    }
  }, [userInput, status, text]);

  // Live WPM Calc
  useEffect(() => {
    if (status === 'playing' && startTime) {
      const interval = setInterval(() => {
        const timeElapsedInMinutes = (Date.now() - startTime) / 60000;
        if (timeElapsedInMinutes > 0) {
           const correctChars = userInput.split('').filter((c, i) => c === text[i]).length;
           setWpm(Math.round((correctChars / 5) / timeElapsedInMinutes));
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [status, startTime, userInput]);

  const resetGame = () => {
    setUserInput("");
    setStartTime(null);
    setTimeLeft(config.duration);
    setStatus("waiting");
    setText(generateWords(50));
    resetStats();
    setWpm(0);
    setAcc(100);
    if (inputRef.current) inputRef.current.focus();
  };

  useEffect(() => {
    let interval;
    if (status === "playing" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
            if (prev <= 1) {
                finishGame();
                return 0;
            }
            return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, timeLeft]);

  const finishGame = () => {
    setStatus("finished");
    const timeElapsedInMinutes = config.duration / 60;
    const correctChars = userInput.split('').filter((c, i) => c === text[i]).length;
    setWpm(Math.round((correctChars / 5) / timeElapsedInMinutes));
    
    // Calculate Accuracy
    const totalTyped = userInput.length;
    const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 0;
    setAcc(accuracy);
  };

  const handleChange = (e) => {
    if (status === "finished") return;
    
    if (status === "waiting") {
        setStatus("playing");
        setStartTime(Date.now());
    }

    const value = e.target.value;
    setUserInput(value);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center mt-12 relative outline-none" onClick={() => inputRef.current?.focus()}>
      
      {/* Header Info */}
      <div className="flex w-full justify-between items-end text-cskYellow font-bold mb-4 font-mono select-none px-4">
         <div className="text-textGray text-xl flex gap-4">
             {status === 'finished' ? 'Result' : (
                 <>
                    <span className="text-cskYellow">{timeLeft}s</span>
                    <span className="hidden md:inline text-sm opacity-50 self-center">time</span>
                 </>
             )}
         </div>
         {status === 'playing' && <div className="text-3xl opacity-20">{wpm}</div>}
      </div>

      {/* Hidden Input */}
      <input 
        ref={inputRef}
        className="absolute opacity-0 -z-10"
        value={userInput}
        onChange={handleChange}
        autoFocus
        tabIndex={0}
      />

      {/* Typing Area */}
      <div className="relative w-full min-h-[160px] bg-halkaBlack/0 p-4 rounded-xl">
          
          {/* Text Container */}
          <div 
            ref={wordsContainerRef}
            className={`relative text-2xl md:text-3xl leading-relaxed font-mono w-full break-words whitespace-pre-wrap cursor-text select-none text-left transition-all duration-300 ${status === 'finished' ? 'blur-sm opacity-50 grayscale' : ''}`}
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            {/* Cursor Element */}
            {status !== 'finished' && (
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
                        <div className="text-sm text-textGray uppercase tracking-widest mb-2">WPM</div>
                        <div className="text-6xl font-black text-cskYellow drop-shadow-[0_0_15px_rgba(226,183,20,0.3)]">{wpm}</div>
                    </div>
                    <div>
                        <div className="text-sm text-textGray uppercase tracking-widest mb-2">ACC</div>
                        <div className="text-6xl font-black text-cskYellow drop-shadow-[0_0_15px_rgba(226,183,20,0.3)]">{acc}%</div>
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
          <span className="border border-white/10 px-2 py-1 rounded kbd">Tab</span> to restart
      </div>
    </div>
  );
};

export default TypingTest;
