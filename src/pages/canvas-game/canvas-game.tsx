import { Page } from "@/components/page/page";
import { useIsMobile } from "@/hooks/use-is-mobile/use-is-mobile";
import { useEffect, useRef, useState } from "react";

const MIN_DISTANCE = 25;

type Element = {
  x: number;
  y: number;
  dx: number; // delta x for movement
  dy: number; // delta y for movement
  type: ElementTypes;
};

type ElementTypes = "rock" | "paper" | "scissors";

const addImageToCanvas = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  name: ElementTypes,
) => {
  const image = new Image();
  image.src = `images/${name}.png`;
  ctx.drawImage(image, x, y, 30, 30);
};

const drawRock = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.fillStyle = "red";
  addImageToCanvas(ctx, x, y, "rock");
};

const drawScissors = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.save();
  ctx.translate(x + 15, y + 15); // Move the rotation point to the center of the image
  ctx.rotate(Math.PI); // Rotate 180 degrees (upside down)
  ctx.translate(-15, -15); // Move the image back
  addImageToCanvas(ctx, -15, -15, "scissors");
  ctx.restore();
};

const drawPaper = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.fillStyle = "green";
  addImageToCanvas(ctx, x, y, "paper");
};

const itsA = (type: ElementTypes, { type: eType }: Element) => eType === type;

const countFor = (type: ElementTypes, elementRef: Element[]) =>
  elementRef.filter((e) => itsA(type, e)).length;

const calculateWinner = (elementRef: Element[]) => {
  const rockCount = countFor("rock", elementRef);
  const paperCount = countFor("paper", elementRef);
  const scissorsCount = countFor("scissors", elementRef);

  if (rockCount > paperCount && rockCount > scissorsCount) {
    return "Rock";
  }

  if (paperCount > rockCount && paperCount > scissorsCount) {
    return "Paper";
  }

  if (scissorsCount > rockCount && scissorsCount > paperCount) {
    return "Scissors";
  }

  return "Tie";
};

export const CanvasGame = () => {
  const isMobile = useIsMobile();

  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elementsRef = useRef<Element[]>([]);

  const [numberOfElements, setNumberOfElements] = useState(10);
  const [runFor, setRunFor] = useState(10);
  const [remainingTime, setRemainingTime] = useState<number | string>(runFor);
  const [rockCount, setRockCount] = useState(numberOfElements);
  const [paperCount, setPaperCount] = useState(numberOfElements);
  const [scissorsCount, setScissorsCount] = useState(numberOfElements);
  const [winner, setWinner] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false); // State to control game start

  const generateElements = (type: ElementTypes) => {
    const canvas = canvasRef.current;
    if (!canvas) return [];
    const width = canvas.width;
    const height = canvas.height;

    const elements: Element[] = [];
    for (let i = 0; i < numberOfElements; i++) {
      const element: Element = {
        x: Math.random() * width,
        y: Math.random() * height,
        dx: Math.random() * 4 - 2, // random speed between -2 and 2 (faster)
        dy: Math.random() * 4 - 2,
        type,
      };

      if (type === "rock") {
        element.x = width * 0.1; // Place rocks on top left
        element.y = height * 0.1;
      } else if (type === "paper") {
        element.x = width * 0.9; // Place papers on top right
        element.y = height * 0.1;
      } else if (type === "scissors") {
        element.x = width * 0.9; // Place scissors on bottom right
        element.y = height * 0.9;
      }
      elements.push(element);
    }
    return elements;
  };

  const resetGame = () => {
    elementsRef.current = [
      ...generateElements("rock"),
      ...generateElements("paper"),
      ...generateElements("scissors"),
    ];

    setRockCount(numberOfElements);
    setPaperCount(numberOfElements);
    setScissorsCount(numberOfElements);
    setRemainingTime(runFor);
    setWinner(null);

    setGameStarted(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    if (!gameStarted) return; // Don't start the game until reset is clicked

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const newElements = elementsRef.current.map((element) => {
        // Update position
        element.x += element.dx;
        element.y += element.dy;

        // Bounce off walls
        if (element.x + 10 > width || element.x - 10 < 0) {
          element.dx *= -1;
        }

        if (element.y + 10 > height || element.y - 10 < 0) {
          element.dy *= -1;
        }

        return element;
      });

      const filteredElements = newElements.filter((element) => {
        let shouldKeep = true;

        elementsRef.current.forEach((other) => {
          if (element !== other) {
            const distanceX = Math.abs(element.x - other.x);
            const distanceY = Math.abs(element.y - other.y);
            const isColliding = distanceX < MIN_DISTANCE &&
              distanceY < MIN_DISTANCE;

            if (isColliding) {
              if (
                (itsA("rock", element) && itsA("paper", other)) ||
                (itsA("scissors", element) && itsA("rock", other)) ||
                (itsA("paper", element) && itsA("scissors", other))
              ) {
                shouldKeep = false;
                audioRef.current?.play();
              }
            }
          }
        });

        return shouldKeep;
      });

      const rockCount = countFor("rock", filteredElements);
      const paperCount = countFor("paper", filteredElements);
      const scissorsCount = countFor("scissors", filteredElements);

      setRockCount(rockCount);
      setPaperCount(paperCount);
      setScissorsCount(scissorsCount);

      // Check if there is a winner
      if (rockCount === 0 && paperCount === 0) {
        setWinner("Scissors");
      } else if (rockCount === 0 && scissorsCount === 0) {
        setWinner("Paper");
      } else if (paperCount === 0 && scissorsCount === 0) {
        setWinner("Rock");
      }

      elementsRef.current = filteredElements;

      filteredElements.forEach((element) => {
        if (element.type === "paper") {
          drawPaper(ctx, element.x, element.y);
        } else if (element.type === "rock") {
          drawRock(ctx, element.x, element.y);
        } else {
          drawScissors(ctx, element.x, element.y);
        }
      });
    };

    let animationID: number;
    let startTime: null | number = null;

    const animate = (time: number) => {
      if (!startTime) {
        startTime = time;
      }

      const elapsedTime = (time - startTime) / 1000;
      const remaining = runFor - elapsedTime;
      setRemainingTime(Math.max(remaining, 0).toFixed(2));

      if (winner) {
        window.cancelAnimationFrame(animationID);
        return;
      }

      if (remaining <= 0) {
        cancelAnimationFrame(animationID);
        setGameStarted(false);

        setWinner(calculateWinner(elementsRef.current));
        return;
      }

      draw();
      animationID = requestAnimationFrame(animate);
    };

    animationID = requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationID);
    };
  }, [gameStarted, winner]);

  return (
    <Page name="Canvas Game (Rock, Paper, Scissors)">
      <audio
        src="/sounds/impact.mp3"
        ref={audioRef}
        style={{ display: "none" }}
      />
      <div className="container mx-auto text-center my-10">
        <ul className="list-none space-y-4">
          {/* Run For Input */}
          <li className="flex items-center gap-2">
            <label className="inline-block text-sm mr-2">Run For (s)</label>
            <input
              type="number"
              disabled={gameStarted}
              value={runFor}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setRunFor(value);
                setRemainingTime(value);
              }}
              className="grow input input-sm"
              placeholder="Daisy"
            />
          </li>
          <li className="flex items-center justify-between">
            <label className="inline-block text-sm mr-2">
              Number of Elements
            </label>
            <div className="flex items-center space-x-2">
              <input
                disabled={gameStarted}
                min={10}
                step="0"
                max="50"
                type="range"
                value={numberOfElements}
                className="range input-sm"
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setNumberOfElements(value);
                  setRockCount(value);
                  setPaperCount(value);
                  setScissorsCount(value);
                }}
              />
            </div>
          </li>
        </ul>
      </div>
      <div className="flex flex-col-reverse md:flex-row md:items-center">
        <div className="justify-self-end w-52 md:w-full">
          <div>
            <table className="table">
              <tbody>
                <tr>
                  <td className="text-right">Rock Count</td>
                  <td>{rockCount}</td>
                </tr>
                <tr>
                  <td className="text-right">Paper Count</td>
                  <td>{paperCount}</td>
                </tr>
                <tr>
                  <td className="text-right">Scissors Count</td>
                  <td>{scissorsCount}</td>
                </tr>
              </tbody>
            </table>
            {winner && <div>Winner: {winner}</div>}
            <button className="btn btn-primary mt-4" onClick={resetGame}>
              Reset Game
            </button>
          </div>
        </div>
        <div className="justify-self-start w-full md:w-1/2">
          <canvas
            ref={canvasRef}
            width={!isMobile ? 600 : "auto"}
            height={!isMobile ? 400 : "auto"}
            style={{ objectFit: "contain" }}
            className="mx-auto block border border-black rounded-lg bg-white"
          />
        </div>
      </div>

      <div className="flex mt-4">
        <h3>Remaining Time: {remainingTime}</h3>
      </div>
      <div className="text-center p-10">
        <a
          className="underline"
          target="blank"
          href="https://www.instagram.com/p/C48bvLiIXM0/"
        >
          Based on this
        </a>
      </div>
    </Page>
  );
};
