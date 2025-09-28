import { FilePicker } from "@/components/file-picker/file-picker";
import { Modal } from "@/components/modal/modal";
import { Page } from "@/components/page/page";
import { Pedal } from "@/components/pedal/pedal";
import { useAudioEffects } from "@/hooks/use-audio-effects/use-audio-effects";
import React, { useRef, useState } from "react";

type PedalControlProps = {
  name: string;
  enabled: boolean;
  onToggle: () => void;
  color: string;
  children?: React.ReactNode;
};

const PedalControl = ({
  name,
  enabled,
  onToggle,
  color,
  children,
}: PedalControlProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-col items-center space-y-2 h-[135px]">
      <div
        className={`cursor-pointer transition-all duration-200 ${
          enabled ? "scale-100 opacity-100" : "scale-95 opacity-60"
        } hover:scale-105`}
        onClick={onToggle}
      >
        <Pedal
          color={enabled ? color : "#666666"}
          size={120}
          className={`drop-shadow-lg ${enabled ? "drop-shadow-xl" : ""}`}
          onSettingsClick={(e?: React.MouseEvent) => {
            e?.stopPropagation();
            setShowModal(true);
          }}
          showSettings={showModal}
        />
      </div>
      <div className="text-center">
        <div
          className={`text-sm font-bold ${
            enabled ? "text-primary" : "text-base-content/60"
          }`}
        >
          {name}
        </div>
        {enabled && (
          <div
            className={`w-2 h-2 rounded-full bg-red-500 mx-auto mt-1 ${
              enabled ? "animate-pulse" : ""
            }`}
          />
        )}
      </div>

      {/* Settings Modal */}
      <Modal
        title={`${name} Settings`}
        visible={showModal}
        onClose={() => setShowModal(false)}
      >
        <div className="space-y-4 py-4">{children}</div>
      </Modal>
    </div>
  );
};

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  unit?: string;
};

const Slider = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit = "",
}: SliderProps) => (
  <div>
    <label className="text-xs text-base-content/70">
      {label}: {typeof value === "number" ? value.toFixed(2) : value}
      {unit}
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="range range-xs range-primary w-full"
    />
  </div>
);

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
            <h2 className="text-xl font-bold mb-4">🎛️ Effects</h2>

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
              <div className="bg-gradient-to-b from-base-300 to-base-200 p-6 rounded-xl shadow-inner">
                <h3 className="text-lg font-bold mb-6 text-center">
                  🎸 Pedalboard
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                  {/* Tempo */}
                  <PedalControl
                    name="Tempo"
                    color="#FF6B35"
                    enabled={effects.tempo.enabled}
                    onToggle={() =>
                      updateEffect("tempo", { enabled: !effects.tempo.enabled })
                    }
                  >
                    <Slider
                      label="Speed"
                      value={effects.tempo.playbackRate}
                      min={0.25}
                      max={2}
                      step={0.05}
                      onChange={(value) =>
                        updateEffect("tempo", { playbackRate: value })
                      }
                      unit="x"
                    />
                  </PedalControl>

                  {/* EQ */}
                  <PedalControl
                    name="EQ3"
                    color="#4ECDC4"
                    enabled={effects.eq3.enabled}
                    onToggle={() =>
                      updateEffect("eq3", { enabled: !effects.eq3.enabled })
                    }
                  >
                    <Slider
                      label="Low"
                      value={effects.eq3.low}
                      min={-30}
                      max={30}
                      step={1}
                      onChange={(value) => updateEffect("eq3", { low: value })}
                      unit="dB"
                    />
                    <Slider
                      label="Mid"
                      value={effects.eq3.mid}
                      min={-30}
                      max={30}
                      step={1}
                      onChange={(value) => updateEffect("eq3", { mid: value })}
                      unit="dB"
                    />
                    <Slider
                      label="High"
                      value={effects.eq3.high}
                      min={-30}
                      max={30}
                      step={1}
                      onChange={(value) => updateEffect("eq3", { high: value })}
                      unit="dB"
                    />
                  </PedalControl>

                  {/* Compressor */}
                  <PedalControl
                    name="Compressor"
                    color="#45B7D1"
                    enabled={effects.compressor.enabled}
                    onToggle={() =>
                      updateEffect("compressor", {
                        enabled: !effects.compressor.enabled,
                      })
                    }
                  >
                    <Slider
                      label="Threshold"
                      value={effects.compressor.threshold}
                      min={-60}
                      max={0}
                      step={1}
                      onChange={(value) =>
                        updateEffect("compressor", { threshold: value })
                      }
                      unit="dB"
                    />
                    <Slider
                      label="Ratio"
                      value={effects.compressor.ratio}
                      min={1}
                      max={20}
                      step={0.1}
                      onChange={(value) =>
                        updateEffect("compressor", { ratio: value })
                      }
                    />
                  </PedalControl>

                  {/* Distortion */}
                  <PedalControl
                    name="Distortion"
                    color="#E74C3C"
                    enabled={effects.distortion.enabled}
                    onToggle={() =>
                      updateEffect("distortion", {
                        enabled: !effects.distortion.enabled,
                      })
                    }
                  >
                    <Slider
                      label="Amount"
                      value={effects.distortion.amount}
                      min={0}
                      max={1}
                      step={0.01}
                      onChange={(value) =>
                        updateEffect("distortion", { amount: value })
                      }
                    />
                  </PedalControl>

                  {/* Filter */}
                  <PedalControl
                    name="Filter"
                    color="#9B59B6"
                    enabled={effects.filter.enabled}
                    onToggle={() =>
                      updateEffect("filter", {
                        enabled: !effects.filter.enabled,
                      })
                    }
                  >
                    <div>
                      <label className="text-xs text-base-content/70">
                        Type
                      </label>
                      <select
                        value={effects.filter.type}
                        onChange={(e) =>
                          updateEffect("filter", { type: e.target.value })
                        }
                        className="select select-xs w-full"
                      >
                        <option value="lowpass">Low Pass</option>
                        <option value="highpass">High Pass</option>
                        <option value="bandpass">Band Pass</option>
                        <option value="notch">Notch</option>
                      </select>
                    </div>
                    <Slider
                      label="Frequency"
                      value={effects.filter.frequency}
                      min={20}
                      max={20000}
                      step={10}
                      onChange={(value) =>
                        updateEffect("filter", { frequency: value })
                      }
                      unit="Hz"
                    />
                  </PedalControl>

                  {/* Pitch Shift */}
                  <PedalControl
                    name="Pitch"
                    color="#F39C12"
                    enabled={effects.pitchShift.enabled}
                    onToggle={() =>
                      updateEffect("pitchShift", {
                        enabled: !effects.pitchShift.enabled,
                      })
                    }
                  >
                    <Slider
                      label="Pitch"
                      value={effects.pitchShift.pitch}
                      min={-24}
                      max={24}
                      step={1}
                      onChange={(value) =>
                        updateEffect("pitchShift", { pitch: value })
                      }
                      unit=" semitones"
                    />
                  </PedalControl>

                  {/* Chorus */}
                  <PedalControl
                    name="Chorus"
                    color="#1ABC9C"
                    enabled={effects.chorus.enabled}
                    onToggle={() =>
                      updateEffect("chorus", {
                        enabled: !effects.chorus.enabled,
                      })
                    }
                  >
                    <Slider
                      label="Rate"
                      value={effects.chorus.frequency}
                      min={0.1}
                      max={10}
                      step={0.1}
                      onChange={(value) =>
                        updateEffect("chorus", { frequency: value })
                      }
                      unit="Hz"
                    />
                    <Slider
                      label="Depth"
                      value={effects.chorus.depth}
                      min={0}
                      max={1}
                      step={0.01}
                      onChange={(value) =>
                        updateEffect("chorus", { depth: value })
                      }
                    />
                  </PedalControl>

                  {/* Phaser */}
                  <PedalControl
                    name="Phaser"
                    color="#8E44AD"
                    enabled={effects.phaser.enabled}
                    onToggle={() =>
                      updateEffect("phaser", {
                        enabled: !effects.phaser.enabled,
                      })
                    }
                  >
                    <Slider
                      label="Rate"
                      value={effects.phaser.frequency}
                      min={0.1}
                      max={10}
                      step={0.1}
                      onChange={(value) =>
                        updateEffect("phaser", { frequency: value })
                      }
                      unit="Hz"
                    />
                    <Slider
                      label="Depth"
                      value={effects.phaser.depth}
                      min={0}
                      max={2}
                      step={0.1}
                      onChange={(value) =>
                        updateEffect("phaser", { depth: value })
                      }
                    />
                  </PedalControl>

                  {/* Tremolo */}
                  <PedalControl
                    name="Tremolo"
                    color="#E67E22"
                    enabled={effects.tremolo.enabled}
                    onToggle={() =>
                      updateEffect("tremolo", {
                        enabled: !effects.tremolo.enabled,
                      })
                    }
                  >
                    <Slider
                      label="Rate"
                      value={effects.tremolo.frequency}
                      min={0.1}
                      max={20}
                      step={0.1}
                      onChange={(value) =>
                        updateEffect("tremolo", { frequency: value })
                      }
                      unit="Hz"
                    />
                    <Slider
                      label="Depth"
                      value={effects.tremolo.depth}
                      min={0}
                      max={1}
                      step={0.01}
                      onChange={(value) =>
                        updateEffect("tremolo", { depth: value })
                      }
                    />
                  </PedalControl>

                  {/* Delay */}
                  <PedalControl
                    name="Delay"
                    color="#27AE60"
                    enabled={effects.delay.enabled}
                    onToggle={() =>
                      updateEffect("delay", { enabled: !effects.delay.enabled })
                    }
                  >
                    <Slider
                      label="Time"
                      value={effects.delay.delayTime}
                      min={0.01}
                      max={1}
                      step={0.01}
                      onChange={(value) =>
                        updateEffect("delay", { delayTime: value })
                      }
                      unit="s"
                    />
                    <Slider
                      label="Feedback"
                      value={effects.delay.feedback}
                      min={0}
                      max={0.9}
                      step={0.01}
                      onChange={(value) =>
                        updateEffect("delay", { feedback: value })
                      }
                    />
                  </PedalControl>

                  {/* Ping Pong Delay */}
                  <PedalControl
                    name="Ping Pong"
                    color="#2ECC71"
                    enabled={effects.pingPongDelay.enabled}
                    onToggle={() =>
                      updateEffect("pingPongDelay", {
                        enabled: !effects.pingPongDelay.enabled,
                      })
                    }
                  >
                    <Slider
                      label="Time"
                      value={effects.pingPongDelay.delayTime}
                      min={0.01}
                      max={1}
                      step={0.01}
                      onChange={(value) =>
                        updateEffect("pingPongDelay", { delayTime: value })
                      }
                      unit="s"
                    />
                    <Slider
                      label="Feedback"
                      value={effects.pingPongDelay.feedback}
                      min={0}
                      max={0.9}
                      step={0.01}
                      onChange={(value) =>
                        updateEffect("pingPongDelay", { feedback: value })
                      }
                    />
                  </PedalControl>

                  {/* Reverb */}
                  <PedalControl
                    name="Reverb"
                    color="#3498DB"
                    enabled={effects.reverb.enabled}
                    onToggle={() =>
                      updateEffect("reverb", {
                        enabled: !effects.reverb.enabled,
                      })
                    }
                  >
                    <Slider
                      label="Decay"
                      value={effects.reverb.decay}
                      min={0.1}
                      max={10}
                      step={0.1}
                      onChange={(value) =>
                        updateEffect("reverb", { decay: value })
                      }
                      unit="s"
                    />
                    <Slider
                      label="Wet"
                      value={effects.reverb.wet}
                      min={0}
                      max={1}
                      step={0.01}
                      onChange={(value) =>
                        updateEffect("reverb", { wet: value })
                      }
                    />
                  </PedalControl>

                  {/* Limiter */}
                  <PedalControl
                    name="Limiter"
                    color="#34495E"
                    enabled={effects.limiter.enabled}
                    onToggle={() =>
                      updateEffect("limiter", {
                        enabled: !effects.limiter.enabled,
                      })
                    }
                  >
                    <Slider
                      label="Threshold"
                      value={effects.limiter.threshold}
                      min={-40}
                      max={0}
                      step={1}
                      onChange={(value) =>
                        updateEffect("limiter", { threshold: value })
                      }
                      unit="dB"
                    />
                  </PedalControl>

                  {/* Volume */}
                  <PedalControl
                    name="Volume"
                    color="#FF9500"
                    enabled={effects.volume.enabled}
                    onToggle={() =>
                      updateEffect("volume", {
                        enabled: !effects.volume.enabled,
                      })
                    }
                  >
                    <Slider
                      label="Volume"
                      value={effects.volume.volume}
                      min={-30}
                      max={20}
                      step={0.5}
                      onChange={(value) =>
                        updateEffect("volume", { volume: value })
                      }
                      unit="dB"
                    />
                  </PedalControl>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Player */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Audio Player</h2>

            {audioFile ? (
              <div className="space-y-6">
                {/* Player Controls */}
                <div className="bg-base-200 p-4 rounded-lg">
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
