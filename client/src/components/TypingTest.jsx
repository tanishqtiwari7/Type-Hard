import React, { useEffect } from "react";
import useStore from "../store/useStore";
import useTypingGame from "../hooks/useTypingGame";
import TypingArea from "./TypingArea";

const TypingTest = () => {
  const { config } = useStore();

  // Use the new hook which encapsulates all logic
  const game = useTypingGame(config.duration);

  // Sync restarts when config changes
  useEffect(() => {
    game.resetGame();
  }, [config.duration, config.mode]);

  return <TypingArea {...game} />;
};

export default TypingTest;
