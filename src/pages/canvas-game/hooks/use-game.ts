import { useEffect, useRef, useState } from "react";
import { drawPaper, drawRock, drawScissors } from "../utils/draw";
import { GameEngine, GameResult } from "../utils/game";

const FPS = 60;
const FRAME_TIME = 1000 / FPS;

export interface GameState {
  rockCount: number;
  paperCount: number;
  scissorsCount: number;
  winner: string | null;
  remainingTime: number | string;
  gameStarted: boolean;
  numberOfElements: number;
  runFor: number;
}

export interface GameActions {
  setNumberOfElements: (value: number) => void;
  setRunFor: (value: number) => void;
  setRemainingTime: (value: number | string) => void;
  setRockCount: (value: number) => void;
  setPaperCount: (value: number) => void;
  setScissorsCount: (value: number) => void;
  resetGame: () => void;
}

export interface GameRefs {
  audioRef: React.RefObject<HTMLAudioElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const useGame = (): {
  state: GameState;
  actions: GameActions;
  refs: GameRefs;
} => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);

  const [numberOfElements, setNumberOfElements] = useState(10);
  const [runFor, setRunFor] = useState(10);
  const [remainingTime, setRemainingTime] = useState<number | string>(runFor);
  const [rockCount, setRockCount] = useState(numberOfElements);
  const [paperCount, setPaperCount] = useState(numberOfElements);
  const [scissorsCount, setScissorsCount] = useState(numberOfElements);
  const [winner, setWinner] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const handleGameStateChange = (gameState: GameResult) => {
    setRockCount(gameState.rockCount);
    setPaperCount(gameState.paperCount);
    setScissorsCount(gameState.scissorsCount);
    if (gameState.winner) {
      setWinner(gameState.winner);
    }
  };

  const resetGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!gameEngineRef.current) {
      gameEngineRef.current = new GameEngine(
        canvas,
        handleGameStateChange,
        () => audioRef.current?.play()
      );
    }

    gameEngineRef.current.initializeGame(numberOfElements);
    setRemainingTime(runFor);
    setWinner(null);
    setGameStarted(true);
  };

  useEffect(() => {
    if (gameStarted && !winner) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => {
          const newTime = typeof prev === 'number' ? prev - 1 : parseFloat(prev as string);

          if (newTime <= 0) {
            clearInterval(timer);
            const gameState = gameEngineRef.current?.getGameState();

            if (gameState?.winner) {
              setWinner(gameState.winner);
            } else if (gameEngineRef.current?.getElements().length) {
              setWinner("Time's up - Draw!");
            } else {
              setWinner("Time's up!");
            }

            return 0;
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameStarted, winner]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasDimensions = () => {
      const container = canvas.parentElement;
      if (container) {
        const size = Math.min(container.clientWidth, 400);
        canvas.width = size;
        canvas.height = size;
      }
      gameEngineRef.current?.resize();
    };

    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);

    if (!gameStarted) return;

    let lastTime = 0;
    let accumulator = 0;
    let animationId: number;

    const draw = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime;
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      accumulator += deltaTime;

      while (accumulator >= FRAME_TIME) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!winner && gameEngineRef.current) {
          gameEngineRef.current.updateFrame(FRAME_TIME);
        }

        accumulator -= FRAME_TIME;
      }

      // Render
      gameEngineRef.current?.getElements().forEach((element) => {
        if (element.type === "paper") {
          drawPaper(ctx, element.x, element.y);
        } else if (element.type === "rock") {
          drawRock(ctx, element.x, element.y);
        } else {
          drawScissors(ctx, element.x, element.y);
        }
      });

      if (!winner && typeof remainingTime === 'number' && remainingTime > 0) {
        animationId = requestAnimationFrame(draw);
      }
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', updateCanvasDimensions);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [gameStarted, winner, remainingTime]);

  return {
    state: {
      rockCount,
      paperCount,
      scissorsCount,
      winner,
      remainingTime,
      gameStarted,
      numberOfElements,
      runFor,
    },
    actions: {
      setNumberOfElements,
      setRunFor,
      setRemainingTime,
      setRockCount,
      setPaperCount,
      setScissorsCount,
      resetGame,
    },
    refs: {
      audioRef,
      canvasRef,
    },
  };
};