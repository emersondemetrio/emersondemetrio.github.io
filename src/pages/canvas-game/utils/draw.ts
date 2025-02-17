import { ElementTypes } from "./game";

const COLORS = {
  rock: "#f87171", // red-400
  paper: "#4ade80", // green-400
  scissors: "#60a5fa", // blue-400
} as const;

export const addImageToCanvas = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  name: ElementTypes,
) => {
  const image = new Image();
  image.src = `images/${name}.png`;
  ctx.globalAlpha = 0.9;
  ctx.drawImage(image, x, y, 30, 30);
  ctx.globalAlpha = 1;
};

export const drawRock = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.fillStyle = COLORS.rock;
  addImageToCanvas(ctx, x, y, "rock");
};

export const drawScissors = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.fillStyle = COLORS.scissors;
  ctx.save();
  ctx.translate(x + 15, y + 15);
  ctx.rotate(Math.PI);
  ctx.translate(-15, -15);
  addImageToCanvas(ctx, -15, -15, "scissors");
  ctx.restore();
};

export const drawPaper = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.fillStyle = COLORS.paper;
  addImageToCanvas(ctx, x, y, "paper");
};