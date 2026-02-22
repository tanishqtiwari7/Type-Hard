import { useState, useEffect, useRef, useCallback } from "react";
import useStore from "../store/useStore";
import { GameService } from "../services/game.service";
import toast from "react-hot-toast";

const WORDS_LIST = "the be of and a to in he have it that for they I with as not on she at by this we you do but from or which one would all will there say who make when can more if no man out other so what time up go about than into could state only new year some take come these know see use get like then first any work now may such give over think most even find day also after way many must look before great back through long where much should well people down own just because good each those feel seem how high too place little world very still nation hand old life tell write become here show house both between need mean call develop under last right move thing general school never same another begin while number part turn real leave might want point form off child few small since against ask late home interest large person end open public follow during present without again hold govern around possible head consider word program program problem however lead system set order eye plan run keep face fact group play stand increase early course change help line".split(" ");

const SPECIAL_CHARS = "!@#$%^&*()_+-=[]{};':\",./<>?".split("");

const generateWords = (count = 50, includeSpecial = false) => {
  return new Array(count)
    .fill(0)
    .map(() => {
      let word = WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
      if (includeSpecial && Math.random() > 0.85) {
        word += SPECIAL_CHARS[Math.floor(Math.random() * SPECIAL_CHARS.length)];
      }
      return word;
    })
    .join(" ");
};

const useTypingGame = (duration = 60) => {
  const { isAuthenticated, resetStats } = useStore();
  const [text, setText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [status, setStatus] = useState("waiting");
  const [wpm, setWpm] = useState(0);
  const [acc, setAcc] = useState(100);

  const inputRef = useRef(null);
  const wordsContainerRef = useRef(null);
  const cursorRef = useRef(null);
  const isSaving = useRef(false);

  // Initialize text based on duration
  useEffect(() => {
    const count = duration <= 15 ? 30 : duration <= 30 ? 60 : 120;
    const special = duration >= 60;
    setText(generateWords(count, special));
  }, [duration]);

  const finishGame = useCallback(async (finalInput, finalText) => {
    if (isSaving.current) return;
    isSaving.current = true;
    setStatus("finished");

    const timeElapsedInMinutes = (duration - timeLeft) / 60 || duration / 60;
    const correctChars = finalInput.split("").filter((c, i) => c === finalText[i]).length;
    const finalWpm = Math.round(correctChars / 5 / timeElapsedInMinutes);
    const finalAcc = finalInput.length > 0 ? Math.round((correctChars / finalInput.length) * 100) : 0;

    setWpm(finalWpm);
    setAcc(finalAcc);

    if (isAuthenticated) {
      try {
        await GameService.saveResult({ wpm: finalWpm, accuracy: finalAcc, test_type: `${duration}s`, test_mode: "time" });
        toast.success(`Result Saved!`);
      } catch (e) { toast.error("Failed to save result"); }
    }
  }, [duration, isAuthenticated, timeLeft]);

  // FIXED TIMER: Does NOT depend on userInput
  useEffect(() => {
    let interval;
    if (status === "playing") {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  // Handle Game Over when time hits 0
  useEffect(() => {
    if (timeLeft === 0 && status === "playing") {
      finishGame(userInput, text);
    }
  }, [timeLeft, status, finishGame, userInput, text]);

  const handleInput = (e) => {
    if (status === "finished") return;
    const val = e.target.value;

    if (status === "waiting") {
      setStatus("playing");
      setStartTime(Date.now());
    }

    // Stop if user reaches end of text
    if (val.length <= text.length) {
      setUserInput(val);
    }

    if (val.length === text.length) {
      finishGame(val, text);
    }
  };

  const resetGame = () => {
    const count = duration <= 15 ? 30 : duration <= 30 ? 60 : 120;
    setUserInput("");
    setStartTime(null);
    setTimeLeft(duration);
    setStatus("waiting");
    setText(generateWords(count, duration >= 60));
    setWpm(0);
    setAcc(100);
    isSaving.current = false;
    resetStats?.();
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return { text, userInput, timeLeft, status, wpm, acc, inputRef, wordsContainerRef, cursorRef, resetGame, handleInput };
};

export default useTypingGame;