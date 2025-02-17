export type ElementTypes = "rock" | "paper" | "scissors";
export type Corner = "topLeft" | "topRight" | "bottomRight" | "bottomLeft";
export type GameResult = {
  winner: string | null;
  rockCount: number;
  paperCount: number;
  scissorsCount: number;
};

export interface Element {
  x: number;
  y: number;
  dx: number;
  dy: number;
  type: ElementTypes;
}

const corners: Corner[] = ["topLeft", "topRight", "bottomRight", "bottomLeft"];

const getPositionInCorner = (corner: Corner, width: number, height: number) => {
  switch(corner) {
    case "topLeft":
      return {
        x: Math.random() * (width * 0.3),
        y: Math.random() * (height * 0.3)
      };
    case "topRight":
      return {
        x: width * 0.7 + Math.random() * (width * 0.3),
        y: Math.random() * (height * 0.3)
      };
    case "bottomRight":
      return {
        x: width * 0.7 + Math.random() * (width * 0.3),
        y: height * 0.7 + Math.random() * (height * 0.3)
      };
    case "bottomLeft":
      return {
        x: Math.random() * (width * 0.3),
        y: height * 0.7 + Math.random() * (height * 0.3)
      };
  }
};

// Shuffle array using Fisher-Yates algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

let lastCornerAssignments: Record<ElementTypes, Corner> | null = null;

export const generateRandomPosition = (width: number, height: number, type: ElementTypes) => {
  if (!lastCornerAssignments) {
    const shuffledCorners = shuffleArray(corners).slice(0, 3);
    lastCornerAssignments = {
      rock: shuffledCorners[0],
      paper: shuffledCorners[1],
      scissors: shuffledCorners[2]
    };
  }

  return getPositionInCorner(lastCornerAssignments[type], width, height);
};

export const generateElements = (type: ElementTypes, canvas: HTMLCanvasElement, count: number) => {
  const width = canvas.width;
  const height = canvas.height;

  const elements: Element[] = [];
  for (let i = 0; i < count; i++) {
    const { x, y } = generateRandomPosition(width, height, type);
    const element: Element = {
      x,
      y,
      dx: (Math.random() * 2 - 1) * 2,
      dy: (Math.random() * 2 - 1) * 2,
      type,
    };
    elements.push(element);
  }
  return elements;
};

// Reset corner assignments when starting a new game
export const resetCornerAssignments = () => {
  lastCornerAssignments = null;
};

export const itsA = (type: ElementTypes, { type: eType }: Element) => eType === type;

export const countFor = (type: ElementTypes, elementRef: Element[]) =>
  elementRef.filter((e) => itsA(type, e)).length;

export const checkGameState = (elements: Element[]): GameResult => {
  const totalElements = elements.length;
  const rockCount = countFor("rock", elements);
  const paperCount = countFor("paper", elements);
  const scissorsCount = elements.length - rockCount - paperCount;

  // Base case - no elements
  if (totalElements === 0) {
    return {
      winner: null,
      rockCount,
      paperCount,
      scissorsCount
    };
  }

  // Single type remaining wins
  if (rockCount === totalElements) {
    return {
      winner: "Rock",
      rockCount,
      paperCount,
      scissorsCount
    };
  }

  if (paperCount === totalElements) {
    return {
      winner: "Paper",
      rockCount,
      paperCount,
      scissorsCount
    };
  }

  if (scissorsCount === totalElements) {
    return {
      winner: "Scissors",
      rockCount,
      paperCount,
      scissorsCount
    };
  }

  // Two types eliminated means the remaining type wins
  if (rockCount === 0 && paperCount === 0) {
    return {
      winner: "Scissors",
      rockCount,
      paperCount,
      scissorsCount
    };
  }

  if (rockCount === 0 && scissorsCount === 0) {
    return {
      winner: "Paper",
      rockCount,
      paperCount,
      scissorsCount
    };
  }

  if (paperCount === 0 && scissorsCount === 0) {
    return {
      winner: "Rock",
      rockCount,
      paperCount,
      scissorsCount
    };
  }

  // No winner yet
  return {
    winner: null,
    rockCount,
    paperCount,
    scissorsCount
  };
};

export const processCollisions = (elements: Element[], onCollision?: () => void): Element[] => {
  return elements.filter((element) => {
    let shouldKeep = true;

    for (const other of elements) {
      if (element === other) continue;

      const dx = element.x - other.x;
      const dy = element.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 25) { // MIN_DISTANCE
        if (
          (itsA("rock", element) && itsA("paper", other)) ||
          (itsA("scissors", element) && itsA("rock", other)) ||
          (itsA("paper", element) && itsA("scissors", other))
        ) {
          shouldKeep = false;
          onCollision?.();
          break;
        }
      }
    }

    return shouldKeep;
  });
};

export const updatePositions = (elements: Element[], width: number, height: number, deltaTime: number): Element[] => {
  const SPRITE_SIZE = 30;
  return elements.map((element) => {
    const newElement = { ...element };
    newElement.x += element.dx * (deltaTime / 16);
    newElement.y += element.dy * (deltaTime / 16);

    if (newElement.x + SPRITE_SIZE > width || newElement.x < 0) {
      newElement.dx *= -1;
      newElement.x = Math.max(0, Math.min(width - SPRITE_SIZE, newElement.x));
    }

    if (newElement.y + SPRITE_SIZE > height || newElement.y < 0) {
      newElement.dy *= -1;
      newElement.y = Math.max(0, Math.min(height - SPRITE_SIZE, newElement.y));
    }

    return newElement;
  });
};

export class GameEngine {
  private elements: Element[] = [];
  private canvas: HTMLCanvasElement;
  private onStateChange: (state: GameResult) => void;
  private onCollision?: () => void;

  constructor(
    canvas: HTMLCanvasElement,
    onStateChange: (state: GameResult) => void,
    onCollision?: () => void
  ) {
    this.canvas = canvas;
    this.onStateChange = onStateChange;
    this.onCollision = onCollision;
  }

  initializeGame(numberOfElements: number) {
    resetCornerAssignments();

    this.elements = [
      ...generateElements("rock", this.canvas, numberOfElements),
      ...generateElements("paper", this.canvas, numberOfElements),
      ...generateElements("scissors", this.canvas, numberOfElements),
    ];

    const gameState = this.getGameState();
    this.onStateChange(gameState);
  }

  updateFrame(deltaTime: number) {
    // Update positions
    const newElements = updatePositions(this.elements, this.canvas.width, this.canvas.height, deltaTime);

    // Process collisions
    const filteredElements = processCollisions(newElements, this.onCollision);

    this.elements = filteredElements;

    // Check and notify state changes
    const gameState = this.getGameState();
    this.onStateChange(gameState);

    return gameState;
  }

  getGameState(): GameResult {
    return checkGameState(this.elements);
  }

  getElements(): Element[] {
    return this.elements;
  }

  resize() {
    // Ensure elements stay within bounds after resize
    this.elements = updatePositions(this.elements, this.canvas.width, this.canvas.height, 0);
  }
}