import { Page } from "@/components/page/page";
import { useIsMobile } from "@/hooks/use-is-mobile/use-is-mobile";
import { useGame } from "./hooks/use-game";

export const CanvasGame = () => {
  const isMobile = useIsMobile();
  const { state, actions, refs } = useGame();

  return (
    <Page name="Canvas Game (Rock, Paper, Scissors)">
      <audio src="/sounds/impact.mp3" ref={refs.audioRef} className="hidden" />

      <div className="max-w-6xl mx-auto p-4">
        <div className="space-y-6 mb-8">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Run For (s)</label>
            <input
              type="number"
              disabled={state.gameStarted}
              value={state.runFor}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                actions.setRunFor(value);
                actions.setRemainingTime(value);
              }}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-[120px] text-black bg-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Number of Elements</label>
            <div className="flex items-center gap-4">
              <input
                disabled={state.gameStarted}
                min={10}
                max={50}
                type="range"
                value={state.numberOfElements}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  actions.setNumberOfElements(value);
                  actions.setRockCount(value);
                  actions.setPaperCount(value);
                  actions.setScissorsCount(value);
                }}
              />
              <span className="text-sm text-slate-200 min-w-[2rem]">
                {state.numberOfElements}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-64 space-y-6">
            <div className="space-y-2 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-red-400">🪨 Rock</span>
                <span className="text-red-400 font-medium">{state.rockCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-400">📄 Paper</span>
                <span className="text-green-400 font-medium">{state.paperCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-400">✂️ Scissors</span>
                <span className="text-blue-400 font-medium">{state.scissorsCount}</span>
              </div>
            </div>

            {state.winner && (
              <div className="text-xl font-bold text-center py-2 px-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                Winner: {state.winner}
              </div>
            )}

            <button
              className="w-full py-2 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={actions.resetGame}
              disabled={state.gameStarted && !state.winner}
            >
              Reset Game
            </button>
          </div>

          <canvas
            ref={refs.canvasRef}
            width={!isMobile ? 400 : "auto"}
            height={!isMobile ? 400 : "auto"}
            className="border border-slate-700 rounded-lg bg-slate-900 flex-grow max-w-full aspect-square"
          />
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="text-lg font-medium text-slate-200">
            Remaining Time: {state.remainingTime}s
          </div>
          <a
            className="text-indigo-400 hover:text-indigo-300 underline"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.instagram.com/p/C48bvLiIXM0/"
          >
            Based on this
          </a>
        </div>
      </div>
    </Page>
  );
};
