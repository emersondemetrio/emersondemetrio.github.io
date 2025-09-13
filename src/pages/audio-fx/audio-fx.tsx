import React from "react";
import { Page } from "@/components/page/page";
import { FilePicker } from "@/components/file-picker/file-picker";
import { useAudioEffects } from "@/hooks/use-audio-effects/use-audio-effects";

type EffectControlProps = {
  name: string;
  enabled: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
};

const EffectControl = ({ name, enabled, onToggle, children }: EffectControlProps) => (
  <div className="border border-base-300 p-3 rounded w-full h-40 flex flex-col">
    <div className="flex items-center justify-between mb-2">
      <label className="text-sm font-semibold truncate flex-1 mr-2">{name}</label>
      <input
        type="checkbox"
        checked={enabled}
        onChange={onToggle}
        className="checkbox checkbox-primary checkbox-sm flex-shrink-0"
      />
    </div>
    <div className="flex-1 overflow-y-auto">
      {enabled && children && (
        <div className="space-y-2 pt-2 border-t border-base-300">
          {children}
        </div>
      )}
      {!enabled && (
        <div className="flex items-center justify-center h-full text-base-content/40">
          <span className="text-xs">Disabled</span>
        </div>
      )}
    </div>
  </div>
);

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  unit?: string;
};

const Slider = ({ label, value, min, max, step, onChange, unit = "" }: SliderProps) => (
  <div>
    <label className="text-xs text-base-content/70">
      {label}: {typeof value === 'number' ? value.toFixed(2) : value}{unit}
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

const Waveform = ({ waveformData, duration, currentTime, onSeek }: WaveformProps) => {
  if (waveformData.length === 0) return null;
  
  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progress = clickX / rect.width;
    const seekTime = progress * duration;
    onSeek(seekTime);
  };
  
  const progress = duration > 0 ? currentTime / duration : 0;
  
  return (
    <div className="w-full">
      <svg
        width="100%"
        height="60"
        viewBox={`0 0 ${waveformData.length} 60`}
        className="cursor-pointer"
        onClick={handleClick}
      >
        {/* Background bars */}
        {waveformData.map((amplitude, index) => {
          const height = Math.max(1, amplitude * 50);
          const isPast = index / waveformData.length <= progress;
          
          return (
            <rect
              key={index}
              x={index}
              y={(60 - height) / 2}
              width={0.8}
              height={height}
              fill={isPast ? "hsl(var(--p))" : "hsl(var(--b3))"}
              className="transition-colors duration-75"
            />
          );
        })}
        
        {/* Progress line */}
        <line
          x1={progress * waveformData.length}
          y1={0}
          x2={progress * waveformData.length}
          y2={60}
          stroke="hsl(var(--p))"
          strokeWidth={2}
        />
      </svg>
    </div>
  );
};

export const AudioFx = () => {
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
  } = useAudioEffects();

  return (
    <Page name="Audio Effects Studio" description="Professional audio effects with real-time processing">
      <div className="min-h-screen bg-base-100">
        {/* Header */}
        <div className="bg-primary text-primary-content p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">🎵 Audio Effects Studio</h1>
              <p className="text-primary-content/80">Real-time audio processing with Tone.js</p>
            </div>
            {audioFile && (
              <div className="text-right">
                <div className="text-sm opacity-80">{audioFile.name}</div>
                <div className="text-xs opacity-60">{formatTime(audioState.duration)}</div>
              </div>
            )}
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
                  <p className="text-base-content/60 mt-2">MP3, WAV, OGG, M4A</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* EQ */}
                <EffectControl
                  name="🎚️ EQ3"
                  enabled={effects.eq3.enabled}
                  onToggle={() => updateEffect('eq3', { enabled: !effects.eq3.enabled })}
                >
                  <Slider
                    label="Low"
                    value={effects.eq3.low}
                    min={-30}
                    max={30}
                    step={1}
                    onChange={(value) => updateEffect('eq3', { low: value })}
                    unit="dB"
                  />
                  <Slider
                    label="Mid"
                    value={effects.eq3.mid}
                    min={-30}
                    max={30}
                    step={1}
                    onChange={(value) => updateEffect('eq3', { mid: value })}
                    unit="dB"
                  />
                  <Slider
                    label="High"
                    value={effects.eq3.high}
                    min={-30}
                    max={30}
                    step={1}
                    onChange={(value) => updateEffect('eq3', { high: value })}
                    unit="dB"
                  />
                </EffectControl>

                {/* Compressor */}
                <EffectControl
                  name="🗜️ Compressor"
                  enabled={effects.compressor.enabled}
                  onToggle={() => updateEffect('compressor', { enabled: !effects.compressor.enabled })}
                >
                  <Slider
                    label="Threshold"
                    value={effects.compressor.threshold}
                    min={-60}
                    max={0}
                    step={1}
                    onChange={(value) => updateEffect('compressor', { threshold: value })}
                    unit="dB"
                  />
                  <Slider
                    label="Ratio"
                    value={effects.compressor.ratio}
                    min={1}
                    max={20}
                    step={0.1}
                    onChange={(value) => updateEffect('compressor', { ratio: value })}
                  />
                </EffectControl>

                {/* Distortion */}
                <EffectControl
                  name="🔥 Distortion"
                  enabled={effects.distortion.enabled}
                  onToggle={() => updateEffect('distortion', { enabled: !effects.distortion.enabled })}
                >
                  <Slider
                    label="Amount"
                    value={effects.distortion.amount}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={(value) => updateEffect('distortion', { amount: value })}
                  />
                </EffectControl>

                {/* Filter */}
                <EffectControl
                  name="🌊 Filter"
                  enabled={effects.filter.enabled}
                  onToggle={() => updateEffect('filter', { enabled: !effects.filter.enabled })}
                >
                  <div>
                    <label className="text-xs text-base-content/70">Type</label>
                    <select
                      value={effects.filter.type}
                      onChange={(e) => updateEffect('filter', { type: e.target.value })}
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
                    onChange={(value) => updateEffect('filter', { frequency: value })}
                    unit="Hz"
                  />
                </EffectControl>

                {/* Pitch Shift */}
                <EffectControl
                  name="🎵 Pitch Shift"
                  enabled={effects.pitchShift.enabled}
                  onToggle={() => updateEffect('pitchShift', { enabled: !effects.pitchShift.enabled })}
                >
                  <Slider
                    label="Pitch"
                    value={effects.pitchShift.pitch}
                    min={-24}
                    max={24}
                    step={1}
                    onChange={(value) => updateEffect('pitchShift', { pitch: value })}
                    unit=" semitones"
                  />
                </EffectControl>

                {/* Chorus */}
                <EffectControl
                  name="🌈 Chorus"
                  enabled={effects.chorus.enabled}
                  onToggle={() => updateEffect('chorus', { enabled: !effects.chorus.enabled })}
                >
                  <Slider
                    label="Rate"
                    value={effects.chorus.frequency}
                    min={0.1}
                    max={10}
                    step={0.1}
                    onChange={(value) => updateEffect('chorus', { frequency: value })}
                    unit="Hz"
                  />
                  <Slider
                    label="Depth"
                    value={effects.chorus.depth}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={(value) => updateEffect('chorus', { depth: value })}
                  />
                </EffectControl>

                {/* Phaser */}
                <EffectControl
                  name="🌀 Phaser"
                  enabled={effects.phaser.enabled}
                  onToggle={() => updateEffect('phaser', { enabled: !effects.phaser.enabled })}
                >
                  <Slider
                    label="Rate"
                    value={effects.phaser.frequency}
                    min={0.1}
                    max={10}
                    step={0.1}
                    onChange={(value) => updateEffect('phaser', { frequency: value })}
                    unit="Hz"
                  />
                  <Slider
                    label="Depth"
                    value={effects.phaser.depth}
                    min={0}
                    max={2}
                    step={0.1}
                    onChange={(value) => updateEffect('phaser', { depth: value })}
                  />
                </EffectControl>

                {/* Tremolo */}
                <EffectControl
                  name="📳 Tremolo"
                  enabled={effects.tremolo.enabled}
                  onToggle={() => updateEffect('tremolo', { enabled: !effects.tremolo.enabled })}
                >
                  <Slider
                    label="Rate"
                    value={effects.tremolo.frequency}
                    min={0.1}
                    max={20}
                    step={0.1}
                    onChange={(value) => updateEffect('tremolo', { frequency: value })}
                    unit="Hz"
                  />
                  <Slider
                    label="Depth"
                    value={effects.tremolo.depth}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={(value) => updateEffect('tremolo', { depth: value })}
                  />
                </EffectControl>

                {/* Delay */}
                <EffectControl
                  name="⏰ Delay"
                  enabled={effects.delay.enabled}
                  onToggle={() => updateEffect('delay', { enabled: !effects.delay.enabled })}
                >
                  <Slider
                    label="Time"
                    value={effects.delay.delayTime}
                    min={0.01}
                    max={1}
                    step={0.01}
                    onChange={(value) => updateEffect('delay', { delayTime: value })}
                    unit="s"
                  />
                  <Slider
                    label="Feedback"
                    value={effects.delay.feedback}
                    min={0}
                    max={0.9}
                    step={0.01}
                    onChange={(value) => updateEffect('delay', { feedback: value })}
                  />
                </EffectControl>

                {/* Ping Pong Delay */}
                <EffectControl
                  name="🏓 Ping Pong"
                  enabled={effects.pingPongDelay.enabled}
                  onToggle={() => updateEffect('pingPongDelay', { enabled: !effects.pingPongDelay.enabled })}
                >
                  <Slider
                    label="Time"
                    value={effects.pingPongDelay.delayTime}
                    min={0.01}
                    max={1}
                    step={0.01}
                    onChange={(value) => updateEffect('pingPongDelay', { delayTime: value })}
                    unit="s"
                  />
                  <Slider
                    label="Feedback"
                    value={effects.pingPongDelay.feedback}
                    min={0}
                    max={0.9}
                    step={0.01}
                    onChange={(value) => updateEffect('pingPongDelay', { feedback: value })}
                  />
                </EffectControl>

                {/* Reverb */}
                <EffectControl
                  name="🏛️ Reverb"
                  enabled={effects.reverb.enabled}
                  onToggle={() => updateEffect('reverb', { enabled: !effects.reverb.enabled })}
                >
                  <Slider
                    label="Decay"
                    value={effects.reverb.decay}
                    min={0.1}
                    max={10}
                    step={0.1}
                    onChange={(value) => updateEffect('reverb', { decay: value })}
                    unit="s"
                  />
                  <Slider
                    label="Wet"
                    value={effects.reverb.wet}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={(value) => updateEffect('reverb', { wet: value })}
                  />
                </EffectControl>

                {/* Limiter */}
                <EffectControl
                  name="🚧 Limiter"
                  enabled={effects.limiter.enabled}
                  onToggle={() => updateEffect('limiter', { enabled: !effects.limiter.enabled })}
                >
                  <Slider
                    label="Threshold"
                    value={effects.limiter.threshold}
                    min={-40}
                    max={0}
                    step={1}
                    onChange={(value) => updateEffect('limiter', { threshold: value })}
                    unit="dB"
                  />
                </EffectControl>
              </div>
            )}
          </div>

          {/* Right Column - Player */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">🎮 Player</h2>
            
            {audioFile ? (
              <div className="space-y-6">
                {/* Player Controls */}
                <div className="bg-base-200 p-6 rounded-lg">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <button
                      onClick={togglePlayback}
                      disabled={audioState.isLoading}
                      className={`btn btn-primary btn-lg ${
                        audioState.isLoading ? "loading" : ""
                      }`}
                    >
                      {audioState.isPlaying ? "⏸️ Pause" : "▶️ Play"}
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
                  
                  {!audioState.isPlaying && (
                    <div className="text-center text-xs text-base-content/50 mb-2">
                      ℹ️ Click play to start audio processing
                    </div>
                  )}
                  
                  <div className="text-center text-sm text-base-content/60">
                    {audioFile.name}
                  </div>
                </div>

                {/* Download Controls */}
                <div className="bg-base-200 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">💾 Download with Effects</h3>
                  <button
                    className={`btn btn-success w-full ${
                      isDownloading ? "loading" : ""
                    }`}
                    onClick={downloadProcessedAudio}
                    disabled={isDownloading || !audioFile}
                  >
                    {isDownloading ? "Processing..." : "📥 Download WAV"}
                  </button>
                  <p className="text-xs text-base-content/60 mt-2">
                    {isDownloading 
                      ? "Rendering audio with effects offline..."
                      : "Downloads the audio with selected effects applied as WAV file"}
                  </p>
                  {Object.entries(effects).some(([_, effect]) => effect.enabled) && (
                    <div className="mt-2 text-xs text-success">
                      ✓ Active effects will be applied
                    </div>
                  )}
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
                    {Object.entries(effects).some(([_, effect]) => effect.enabled) ? (
                      Object.entries(effects)
                        .filter(([_, effect]) => effect.enabled)
                        .map(([name, _]) => (
                          <div key={name} className="badge badge-primary badge-sm mr-2">
                            {name}
                          </div>
                        ))
                    ) : (
                      <span className="text-base-content/60">No effects applied</span>
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
