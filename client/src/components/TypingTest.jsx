import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import useStore from "../store/useStore";

const WORDS =
  "the be of and a to in he have it that for they I with as not on she at by this we you do but from or which one would all will there say who make when can more if no man out other so what time up go about than into could state only new year some take come these know see use get like then first any work now may such give over think most even find day also after way many must look before great back through long where much should well people down own just because good each those feel seem how high too place little world very still nation hand old life tell write become here show house both between need mean call develop under last right move thing general school never same another begin while number part turn real leave might want point form off child few small since against ask late home interest large person end open public follow during present without again hold govern around possible head consider word program problem however lead system set order eye plan run keep face fact group play stand increase early course change help line".split(
    " "
  );

const TypingTest = () => {
  const { config, isTyping, setIsTyping, updateStats, resetStats } = useStore();
  const [text, setText] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(config.duration);
  const [wordIndex, setWordIndex] = useState(0);

  const inputRef = useRef(null);
  const cursorRef = useRef(null);
  const wordsRef = useRef([]);

  // Initialize test
  useEffect(() => {
    resetTest();
  }, [config]);

  const resetTest = () => {
    const newText = Array(50)
      .fill(0)
      .map(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
    setText(newText);
    setUserInput("");
    setWordIndex(0);
    setTimeLeft(config.duration);
    setIsTyping(false);
    setStartTime(null);
    resetStats();
    if (inputRef.current) inputRef.current.focus();
  };

  // Timer logic
  useEffect(() => {
    let interval;
    if (isTyping && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTyping, timeLeft]);

  // Cursor animation
  useEffect(() => {
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        opacity: 0,
        repeat: -1,
        yoyo: true,
        duration: 0.5,
        ease: "power1.inOut",
      });
    }
  }, []);

  const finishTest = () => {
    setIsTyping(false);
    // Calculate final stats
    // TODO: Save result
  };

  const handleInput = (e) => {
    const value = e.target.value;

    if (!isTyping && value.length === 1) {
      setIsTyping(true);
      setStartTime(Date.now());
    }

    if (value.endsWith(" ")) {
      // Word completed
      const currentWord = text[wordIndex];
      const typedWord = value.trim();

      // Check accuracy
      const isCorrect = currentWord === typedWord;

      // Animate word
      const wordEl = wordsRef.current[wordIndex];
      if (wordEl) {
        gsap.to(wordEl, {
          color: isCorrect ? "#e2b714" : "#ca4754",
          duration: 0.2,
        });
      }

      setWordIndex((prev) => prev + 1);
      setUserInput("");
    } else {
      setUserInput(value);
    }

    // Calculate live WPM
    if (startTime) {
      const timeElapsed = (Date.now() - startTime) / 1000 / 60;
      const wpm = Math.round((wordIndex + 1) / timeElapsed);
      updateStats({ wpm });
    }
  };

  return (
    <div
      className="w-full max-w-5xl mx-auto p-8 font-mono"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Stats Header */}
      <div className="flex justify-between mb-12 text-2xl text-cskYellow">
        <div>{timeLeft}s</div>
        <div>WPM: {useStore.getState().stats.wpm}</div>
      </div>

      {/* Typing Area */}
      <div className="relative text-2xl leading-relaxed break-all min-h-[200px] outline-none">
        {/* Hidden Input */}
        <input
          ref={inputRef}
          type="text"
          className="absolute opacity-0 top-0 left-0 cursor-default"
          value={userInput}
          onChange={handleInput}
          autoFocus
        />

        {/* Text Display */}
        <div className="flex flex-wrap gap-2 text-gray-500 select-none">
          {text.map((word, idx) => {
            let className = "transition-colors duration-200";
            if (idx === wordIndex) className = "text-white relative";

            return (
              <span
                key={idx}
                ref={(el) => (wordsRef.current[idx] = el)}
                className={className}
              >
                {word.split("").map((char, charIdx) => {
                  let charColor = "";
                  if (idx === wordIndex && charIdx < userInput.length) {
                    charColor =
                      userInput[charIdx] === char
                        ? "text-white"
                        : "text-red-500";
                  }
                  return (
                    <span key={charIdx} className={charColor}>
                      {char}
                    </span>
                  );
                })}
                {/* Cursor */}
                {idx === wordIndex && (
                  <span
                    ref={cursorRef}
                    className="absolute -left-1 top-0 w-0.5 h-8 bg-cskYellow ml-[calc(1ch*${userInput.length})]"
                    style={{ left: `${userInput.length}ch` }}
                  />
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Restart Hint */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        <span className="bg-gray-800 px-2 py-1 rounded">Tab</span> to restart
      </div>
    </div>
  );
};

export default TypingTest;
