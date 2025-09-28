import { FilePicker } from "@/components/file-picker/file-picker";
import { Modal } from "@/components/modal/modal";
import { Page } from "@/components/page/page";
import { useAudioEffects } from "@/hooks/use-audio-effects/use-audio-effects";
import React, { useRef, useState } from "react";
import { PedalBoard } from "./PedalBoard";

type WaveformProps = {
  waveformData: number[];
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
};

const Waveform = ({
  waveformData,
  duration,
  currentTime,
  onSeek,
}: WaveformProps) => {
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);

  if (waveformData.length === 0) return null;

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progress = clickX / rect.width;
    const seekTime = progress * duration;
    onSeek(seekTime);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const hoverProgress = mouseX / rect.width;
    setHoverPosition(hoverProgress);
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
  };

  const progress = duration > 0 ? currentTime / duration : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full relative">
      {/* Hover time tooltip */}
      {hoverPosition !== null && (
        <div
          className="absolute -top-8 bg-base-100 text-base-content px-2 py-1 rounded shadow-lg text-xs pointer-events-none z-10"
          style={{
            left: `${hoverPosition * 100}%`,
            transform: "translateX(-50%)",
          }}
        >
          {formatTime(hoverPosition * duration)}
        </div>
      )}

      <svg
        width="100%"
        height="60"
        viewBox={`0 0 ${waveformData.length} 60`}
        className="cursor-pointer hover:bg-base-100/10 transition-colors rounded"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background bars */}
        {waveformData.map((amplitude, index) => {
          const height = Math.max(1, amplitude * 50);
          const barProgress = index / waveformData.length;
          const isPast = barProgress <= progress;
          const isNear = Math.abs(barProgress - progress) < 0.01; // Near current position

          let fillColor;
          if (isNear) {
            fillColor = "#FF6B35"; // Orange for current position
          } else if (isPast) {
            fillColor = "#4ECDC4"; // Teal for played sections
          } else {
            fillColor = "hsl(var(--b3))"; // Default for unplayed
          }

          return (
            <rect
              key={index}
              x={index}
              y={(60 - height) / 2}
              width={0.8}
              height={height}
              fill={fillColor}
              className="transition-colors duration-150"
              opacity={isPast ? 1 : 0.6}
            />
          );
        })}

        {/* Progress line with glow effect */}
        <defs>
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FF6B35" stopOpacity="1" />
            <stop offset="100%" stopColor="#FF6B35" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glow line behind */}
        <line
          x1={progress * waveformData.length}
          y1={0}
          x2={progress * waveformData.length}
          y2={60}
          stroke="#FF6B35"
          strokeWidth={4}
          opacity={0.3}
          filter="url(#glow)"
        />

        {/* Main progress line */}
        <line
          x1={progress * waveformData.length}
          y1={0}
          x2={progress * waveformData.length}
          y2={60}
          stroke="url(#progressGradient)"
          strokeWidth={3}
        />

        {/* Progress indicator circle */}
        <circle
          cx={progress * waveformData.length}
          cy={30}
          r={4}
          fill="#FF6B35"
          stroke="#FFF"
          strokeWidth={2}
          filter="url(#glow)"
        />

        {/* Hover indicator */}
        {hoverPosition !== null && (
          <>
            <line
              x1={hoverPosition * waveformData.length}
              y1={0}
              x2={hoverPosition * waveformData.length}
              y2={60}
              stroke="#FFF"
              strokeWidth={2}
              opacity={0.7}
              strokeDasharray="4,4"
            />
            <circle
              cx={hoverPosition * waveformData.length}
              cy={30}
              r={3}
              fill="#FFF"
              opacity={0.8}
            />
          </>
        )}
      </svg>
    </div>
  );
};

export const AudioFx = () => {
  const messageRef = useRef<HTMLParagraphElement>(null);

  const {
    audioFile,
    youtubeUrl,
    setYoutubeUrl,
    audioState,
    effects,
    waveformData,
    isDownloading,
    loadAudioFile,
    loadYouTubeAudio,
    togglePlayback,
    toggleLoop,
    seekTo,
    updateEffect,
    downloadProcessedAudio,
    formatTime,
    loaded: isFFmpegReady,
    ffmpegLoadProgress,
    resetAudioFile,
  } = useAudioEffects();

  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadProcessedAudio = async () => {
    setIsLoading(true);
    await downloadProcessedAudio();
    setIsLoading(false);
  };

  return (
    <Page
      name="Audio Effects Studio"
      description="Professional audio effects with real-time processing"
    >
      <div className="min-h-screen bg-base-100 w-full">
        <Modal title="Downloading file" visible={isLoading}>
          <div className="text-gray-500">Please wait...</div>
        </Modal>
        {/* Header */}
        <div className="text-primary-content p-4 mb-6">
          <div className="w-full">
            <div className="flex justify-between items-start">
              {/* Left side - Title and File name */}
              <div>
                <h1 className="text-2xl font-bold">🎵 Audio Effects Studio</h1>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {isFFmpegReady
                      ? "Audio processor ready"
                      : `Initializing audio processor... ${Math.round(
                          ffmpegLoadProgress * 100
                        )}%`}
                  </span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isFFmpegReady ? "bg-success" : "bg-warning animate-pulse"
                    }`}
                  ></div>
                </div>
              </div>

              {/* Right side - Audio message and Reset */}
              <div className="flex flex-col items-right gap-2 text-primary-content/90">
                {audioFile && (
                  <div className="mt-1">
                    <div className="text-sm opacity-80">{audioFile.name}</div>
                    <div className="text-xs opacity-60">
                      {formatTime(audioState.duration)}
                    </div>
                  </div>
                )}
                {audioFile && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={resetAudioFile}
                  >
                    🔄 Reset File
                  </button>
                )}
                <p ref={messageRef} className="text-xs text-error ml-2"></p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4">
          {/* Left Column - Effects */}
          <div className="space-y-4">
            {/* File Input */}
            {!audioFile && (
              <div className="space-y-4">
                {/* Audio File Upload */}
                <div className="border-2 border-dashed border-base-300 p-6 rounded-lg text-center">
                  <FilePicker onFileChange={loadAudioFile} />
                  <p className="text-base-content/60 mt-2">
                    MP3, WAV, OGG, M4A
                  </p>
                </div>

                {/* Divider */}
                <div className="flex items-center">
                  <div className="flex-1 h-px bg-base-300"></div>
                  <span className="px-3 text-sm text-base-content/60">OR</span>
                  <div className="flex-1 h-px bg-base-300"></div>
                </div>

                {/* YouTube URL Input */}
                <div className="border border-base-300 p-6 rounded-lg">
                  <h3 className="text-sm font-semibold mb-3">🎥 YouTube URL</h3>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      className="input input-bordered flex-1"
                    />
                    <button
                      onClick={() => loadYouTubeAudio(youtubeUrl)}
                      disabled={!youtubeUrl.trim()}
                      className="btn btn-primary"
                    >
                      Load
                    </button>
                  </div>
                  <p className="text-xs text-base-content/50 mt-2">
                    ⚠️ Coming soon - YouTube audio extraction
                  </p>
                </div>
              </div>
            )}

            {audioFile && (
              <PedalBoard effects={effects} updateEffect={updateEffect} />
            )}
          </div>

          {/* Right Column - Player */}
          <div className="space-y-4">
            {audioFile ? (
              <div className="space-y-6">
                {/* Player Controls */}
                <div className="bg-base-200 p-4 rounded-lg">
                  <h2 className="text-xl font-bold mb-6">Audio Player</h2>
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <button
                      onClick={togglePlayback}
                      disabled={audioState.isLoading}
                      className={`btn btn-primary w-[100px] ${
                        audioState.isLoading ? "loading" : ""
                      }`}
                    >
                      {audioState.isPlaying ? "⏸️ Pause" : "▶️ Play"}
                    </button>
                    <button
                      onClick={toggleLoop}
                      className={`btn ${
                        audioState.isLooping ? "btn-accent" : "btn-outline"
                      } w-[60px]`}
                      title={audioState.isLooping ? "Loop: ON" : "Loop: OFF"}
                    >
                      🔂
                    </button>
                    <button
                      className={`btn btn-success ${
                        isDownloading ? "btn-primary" : ""
                      }`}
                      onClick={
                        isDownloading ? undefined : handleDownloadProcessedAudio
                      }
                      disabled={!isFFmpegReady}
                    >
                      {isDownloading ? "Downloading..." : "⬇️ Download"}
                      {isDownloading && (
                        <span className="loading loading-spinner loading-xs"></span>
                      )}
                    </button>
                  </div>

                  {/* Waveform Visualization */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-base-content/60 mb-2">
                      <span>{formatTime(audioState.currentTime)}</span>
                      <span>{formatTime(audioState.duration)}</span>
                    </div>

                    {waveformData.length > 0 ? (
                      <div className="bg-base-300 rounded p-2">
                        <Waveform
                          waveformData={waveformData}
                          duration={audioState.duration}
                          currentTime={audioState.currentTime}
                          onSeek={seekTo}
                        />
                      </div>
                    ) : (
                      <div className="bg-base-300 rounded p-4 text-center text-base-content/40">
                        <p className="text-sm">Waveform will appear here</p>
                      </div>
                    )}
                  </div>
                  <div className="text-center text-sm text-base-content/60">
                    {audioFile.name}
                  </div>
                </div>

                {/* Recording Controls - DISABLED FOR NOW */}
                {/* <div className="bg-base-200 p-6 rounded-lg opacity-50">
                  <h3 className="font-semibold mb-4">📹 Recording (Disabled)</h3>
                  <div className="flex space-x-2">
                    {!isRecording ? (
                      <button
                        disabled
                        className="btn btn-error flex-1 btn-disabled"
                      >
                        🔴 Start Recording
                      </button>
                    ) : (
                      <button
                        disabled
                        className="btn btn-success flex-1 btn-disabled"
                      >
                        ⏹️ Stop & Download
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-base-content/40 mt-2">
                    Recording feature temporarily disabled
                  </p>
                </div> */}

                {/* Effect Status */}
                <div className="bg-base-200 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">🔧 Active Effects</h3>
                  <div className="text-sm space-y-1">
                    {Object.entries(effects).some(
                      ([, effect]) => effect.enabled
                    ) ? (
                      Object.entries(effects)
                        .filter(([, effect]) => effect.enabled)
                        .map(([name]) => (
                          <div
                            key={name}
                            className="badge badge-primary badge-sm mr-2"
                          >
                            {name}
                          </div>
                        ))
                    ) : (
                      <span className="text-base-content/60">
                        No effects applied
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-base-200 p-8 rounded-lg text-center text-base-content/60">
                <p className="mb-2">👈 Upload an audio file to get started</p>
                <p className="text-sm">Choose a file from the effects panel</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
};
