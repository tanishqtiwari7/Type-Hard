import { useState, useEffect, useRef } from "react";
import useStore from "../store/useStore";
import { GameService } from "../services/game.service";

const WORDS_LIST =
  "the be of and a to in he have it that for they I with as not on she at by this we you do but from or which one would all will there say who make when can more if no man out other so what time up go about than into could state only new year some take come these know see use get like then first any work now may such give over think most even find day also after way many must look before great back through long where much should well people down own just because good each those feel seem how high too place little world very still nation hand old life tell write become here show house both between need mean call develop under last right move thing general school never same another begin while number part turn real leave might want point form off child few small since against ask late home interest large person end open public follow during present without again hold govern around possible head consider word program problem however lead system set order eye plan run keep face fact group play stand increase early course change help line".split(
    " "
  );

const generateWords = (count = 50) => {
  return new Array(count)
    .fill(0)
    .map(() => WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)])
    .join(" ");
};

const useTypingGame = (duration = 60) => {
  const { config, resetStats, isAuthenticated } = useStore();
  const [text, setText] = useState(generateWords(50));
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [status, setStatus] = useState("waiting"); // waiting, playing, finished
  const [wpm, setWpm] = useState(0);
  const [acc, setAcc] = useState(100);

  const inputRef = useRef(null);
  const wordsContainerRef = useRef(null);
  const cursorRef = useRef(null);

  // Reset Game Logic
  const resetGame = () => {
    setUserInput("");
    setStartTime(null);
    setTimeLeft(duration);
    setStatus("waiting");
    setText(generateWords(50));
    resetStats();
    setWpm(0);
    setAcc(100);
    inputRef.current?.focus();
  };

  // Timer Logic
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

  // WPM Calculation
  useEffect(() => {
    if (status === "playing" && startTime) {
      const interval = setInterval(() => {
        const timeElapsedInMinutes = (Date.now() - startTime) / 60000;
        if (timeElapsedInMinutes > 0) {
          const correctChars = userInput
            .split("")
            .filter((c, i) => c === text[i]).length;
          setWpm(Math.round(correctChars / 5 / timeElapsedInMinutes));
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [status, startTime, userInput]);

  // Guest Limit & Auto Focus
  useEffect(() => {
    if (status === "waiting" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [status]);

  const finishGame = async () => {
    setStatus("finished");
    const timeElapsedInMinutes = duration / 60;
    const correctChars = userInput
      .split("")
      .filter((c, i) => c === text[i]).length;
    const finalWpm = Math.round(correctChars / 5 / timeElapsedInMinutes);
    const totalTyped = userInput.length;
    const finalAcc =
      totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 0;

    setWpm(finalWpm);
    setAcc(finalAcc);

    // Save to Backend
    try {
      await GameService.saveResult({
        wpm: finalWpm,
        accuracy: finalAcc,
        raw_wpm: finalWpm,
        test_type: `${duration}s`,
        test_mode: "time",
      });

      if (!isAuthenticated) {
        localStorage.setItem("th_last_guest_test", new Date().toDateString());
      }
    } catch (error) {
      console.error("Failed to save result", error);
    }
  };

  const handleInput = (e) => {
    if (status === "finished") return;

    if (status === "waiting") {
      if (!isAuthenticated) {
        const lastTest = localStorage.getItem("th_last_guest_test");
        if (lastTest === new Date().toDateString()) {
          alert("Only 1 guest test allow per day! Please Login.");
          return;
        }
      }
      setStatus("playing");
      setStartTime(Date.now());
    }

    setUserInput(e.target.value);
  };

  return {
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
  };
};

export default useTypingGame;
