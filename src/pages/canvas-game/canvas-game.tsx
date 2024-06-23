import { Page } from '@/components/page/page';
import { useEffect, useRef, useState } from 'react';

const MIN_DISTANCE = 25;

type Element = {
  x: number;
  y: number;
  dx: number; // delta x for movement
  dy: number; // delta y for movement
  type: ElementTypes;
}

type ElementTypes = 'rock' | 'paper' | 'scissors';

const addImageToCanvas = (ctx: CanvasRenderingContext2D, x: number, y: number, name: ElementTypes) => {
  const image = new Image();
  image.src = `images/${name}.png`;
  ctx.drawImage(image, x, y, 30, 30);
};

const drawRock = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.fillStyle = 'red';
  addImageToCanvas(ctx, x, y, 'rock');
};

const drawScissors = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.save();
  ctx.translate(x + 15, y + 15); // Move the rotation point to the center of the image
  ctx.rotate(Math.PI); // Rotate 180 degrees (upside down)
  ctx.translate(-15, -15); // Move the image back
  addImageToCanvas(ctx, -15, -15, 'scissors');
  ctx.restore();
};

const drawPaper = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.fillStyle = 'green';
  addImageToCanvas(ctx, x, y, 'paper');
};

const calculateWinner = (elementRef: Element[]) => {
  const rockCount = elementRef.filter(e => e.type === 'rock').length;
  const paperCount = elementRef.filter(e => e.type === 'paper').length;
  const scissorsCount = elementRef.filter(e => e.type === 'scissors').length;

  if (rockCount > paperCount && rockCount > scissorsCount) {
    return 'Rock';
  }

  if (paperCount > rockCount && paperCount > scissorsCount) {
    return 'Paper';
  }

  if (scissorsCount > rockCount && scissorsCount > paperCount) {
    return 'Scissors';
  }

  return 'Tie';
}


export const CanvasGame = () => {
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
        dx: (Math.random() * 4 - 2), // random speed between -2 and 2 (faster)
        dy: (Math.random() * 4 - 2),
        type,
      };

      if (type === 'rock') {
        element.x = width * 0.1; // Place rocks on top left
        element.y = height * 0.1;
      } else if (type === 'paper') {
        element.x = width * 0.9; // Place papers on top right
        element.y = height * 0.1;
      } else if (type === 'scissors') {
        element.x = width * 0.9; // Place scissors on bottom right
        element.y = height * 0.9;
      }
      elements.push(element);
    }
    return elements;
  };

  const resetGame = () => {
    elementsRef.current = [
      ...generateElements('rock'),
      ...generateElements('paper'),
      ...generateElements('scissors'),
    ];
    setRockCount(numberOfElements);
    setPaperCount(numberOfElements);
    setScissorsCount(numberOfElements);
    setRemainingTime(runFor);
    setWinner(null);
    setGameStarted(true); // Start the game animation loop
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
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

      // Check for collisions and filter out collided elements based on rock-paper-scissors rules
      const filteredElements = newElements.filter((element) => {
        let shouldKeep = true;

        elementsRef.current.forEach((other) => {
          if (element !== other) {
            const distanceX = Math.abs(element.x - other.x);
            const distanceY = Math.abs(element.y - other.y);
            const isColliding = distanceX < MIN_DISTANCE && distanceY < MIN_DISTANCE;

            if (isColliding) {
              if ((element.type === 'rock' && other.type === 'paper') ||
                (element.type === 'scissors' && other.type === 'rock') ||
                (element.type === 'paper' && other.type === 'scissors')) {
                shouldKeep = false;
                audioRef.current?.play();
              }
            }
          }
        });

        // Only keep the element if it didn't collide in a losing interaction
        return shouldKeep;
      });

      // Update the counts
      const rockCount = filteredElements.filter(e => e.type === 'rock').length;
      const paperCount = filteredElements.filter(e => e.type === 'paper').length;
      const scissorsCount = filteredElements.filter(e => e.type === 'scissors').length;

      setRockCount(rockCount);
      setPaperCount(paperCount);
      setScissorsCount(scissorsCount);

      // Check if there is a winner
      if (rockCount === 0 && paperCount === 0) {
        setWinner('Scissors');
      } else if (rockCount === 0 && scissorsCount === 0) {
        setWinner('Paper');
      } else if (paperCount === 0 && scissorsCount === 0) {
        setWinner('Rock');
      }

      elementsRef.current = filteredElements;

      // Draw elements
      filteredElements.forEach((element) => {
        if (element.type === 'paper') {
          drawPaper(ctx, element.x, element.y);
        } else if (element.type === 'rock') {
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

      // Check if winner exists or animation time has elapsed
      if (remaining <= 0) {
        cancelAnimationFrame(animationID);
        setGameStarted(false);


        setWinner(
          calculateWinner(elementsRef.current)
        );
        return; // Exit the animation loop if there's a winner or time is up
      }

      draw();
      animationID = requestAnimationFrame(animate);
    };

    animationID = requestAnimationFrame(animate);

    return () => {
      // Cleanup function to stop animation on unmount
      window.cancelAnimationFrame(animationID);
    };
  }, [gameStarted, winner]);


  return (
    <Page style={{
      height: '100%',
      flexDirection: 'column',
      backgroundColor: '#001000',
      color: 'white',
    }}>
      <div style={{ textAlign: 'center', marginTop: '10px', marginBottom: '10px' }}>
        <h3>Rock, Paper, Scissors</h3>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: "400px",
          padding: 5,
          border: "solid 1px white",
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Time</span>
            <input disabled={gameStarted} type='number' min='1' max='50' value={runFor} onChange={(e) => {
              const value = parseInt(e.target.value);
              setRunFor(value);
              setRemainingTime(value);
            }} />
            <span>s</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <span>Pieces</span>
            <input disabled={gameStarted} type='range' min='1' max='50' value={numberOfElements} onChange={(e) => {
              const value = parseInt(e.target.value);
              setNumberOfElements(value);
              setRockCount(value);
              setPaperCount(value);
              setScissorsCount(value);
            }} />
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <audio src='/sounds/impact.mp3' ref={audioRef} style={{ display: 'none' }} />
        <div>Remaining Time: {remainingTime} seconds</div>
        <div>Rock Count: {rockCount}</div>
        <div>Paper Count: {paperCount}</div>
        <div>Scissors Count: {scissorsCount}</div>
        {winner && <div>Winner: {winner}</div>}
        <button onClick={resetGame}>Reset Game</button>
      </div>

      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        style={{
          border: '1px solid black',
          borderRadius: '5px',
          margin: 'auto',
          display: 'block',
          backgroundColor: 'white',
        }} />
      <div className='p10'>
        <a style={{
          textDecoration: 'underline',
        }} target='blank' href='https://www.instagram.com/p/C48bvLiIXM0/'>Based on this</a>
      </div>
    </Page>
  );
};
