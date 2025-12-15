import { Page } from "@/components/page/page";
import { useEffect, useRef, useState } from "react";
import { AudioWave } from "./AudioWave";

export const GenerateWhiteNoise = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [bufferDuration, setBufferDuration] = useState(3); // seconds
  const [channels, setChannels] = useState(2); // 1 = mono, 2 = stereo
  const [fadeDuration, setFadeDuration] = useState(0.1); // seconds
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);

  // Initialize AudioContext (requires user gesture in modern browsers)
  const initializeAudioContext = () => {
    if (audioContextRef.current) {
      return audioContextRef.current;
    }

    // Cross-browser compatibility: AudioContext || webkitAudioContext
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const context = new AudioContextClass();
    audioContextRef.current = context;

    // Resume context if suspended (required for autoplay policies)
    if (context.state === "suspended") {
      context.resume();
    }

    return context;
  };

  // Create white noise buffer: uniform random samples
  const createWhiteNoiseBuffer = (context: AudioContext): AudioBuffer => {
    const sampleRate = context.sampleRate;
    const frameCount = sampleRate * bufferDuration;
    const numberOfChannels = channels;

    // Create buffer
    const buffer = context.createBuffer(numberOfChannels, frameCount, sampleRate);

    // Fill each channel with uniform random samples: value = (Math.random() * 2) - 1
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        // Generate uniform random sample in range [-1, 1]
        channelData[i] = Math.random() * 2 - 1;
      }
    }

    return buffer;
  };

  // Fade function using linearRampToValueAtTime for smooth fades
  const fade = (
    gainNode: GainNode,
    targetVolume: number
  ) => {
    const currentTime = gainNode.context.currentTime;
    const currentVolume = gainNode.gain.value;

    // Set current value explicitly to avoid jumps
    gainNode.gain.setValueAtTime(currentVolume, currentTime);
    // Ramp to target volume over fade duration
    gainNode.gain.linearRampToValueAtTime(
      targetVolume,
      currentTime + fadeDuration
    );
  };

  // Play white noise
  const play = () => {
    const context = initializeAudioContext();

    // Resume context if suspended
    if (context.state === "suspended") {
      context.resume();
    }

    // Always regenerate buffer with current parameters
    bufferRef.current = createWhiteNoiseBuffer(context);

    // Stop existing source if playing
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
      } catch (e) {
        // Source may already be stopped
      }
      sourceNodeRef.current = null;
    }

    // Create AudioBufferSourceNode
    const source = context.createBufferSource();
    source.buffer = bufferRef.current;
    source.loop = true; // Enable looping

    // Create GainNode for volume control (default 0.3-0.5 to avoid clipping)
    const gainNode = context.createGain();
    gainNode.gain.value = 0; // Start at 0 for fade in

    // Connect: source -> gain -> destination
    source.connect(gainNode);
    gainNode.connect(context.destination);

    // Store references
    sourceNodeRef.current = source;
    gainNodeRef.current = gainNode;

    // Start playback
    source.start(0);

    // Fade in
    fade(gainNode, volume);

    setIsPlaying(true);
  };

  // Stop white noise with fade out
  const stop = () => {
    if (gainNodeRef.current && sourceNodeRef.current) {
      const gainNode = gainNodeRef.current;
      const source = sourceNodeRef.current;

      // Fade out
      fade(gainNode, 0);

      // Stop source after fade completes
      setTimeout(() => {
        try {
          source.stop();
        } catch (e) {
          // Source may already be stopped
        }
        sourceNodeRef.current = null;
        gainNodeRef.current = null;
        setIsPlaying(false);
      }, 150); // Slightly longer than fade duration
    } else {
      setIsPlaying(false);
    }
  };

  // Update volume while playing
  useEffect(() => {
    if (gainNodeRef.current && isPlaying) {
      const currentTime = gainNodeRef.current.context.currentTime;
      gainNodeRef.current.gain.setValueAtTime(volume, currentTime);
    }
  }, [volume, isPlaying]);

  // Regenerate buffer when buffer-related params change
  useEffect(() => {
    if (isPlaying && audioContextRef.current) {
      // Restart with new buffer
      const wasPlaying = isPlaying;
      stop();
      setTimeout(() => {
        if (wasPlaying) {
          play();
        }
      }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bufferDuration, channels]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.stop();
        } catch (e) {
          // Ignore errors
        }
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handleToggle = () => {
    if (isPlaying) {
      stop();
    } else {
      play();
    }
  };

  return (
    <Page name="Generate White Noise" description="High-quality white noise generator using Web Audio API">
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <button
          className={`btn btn-lg ${isPlaying ? "btn-error" : "btn-primary"}`}
          onClick={handleToggle}
        >
          {isPlaying ? "⏹ Stop" : "▶ Generate & Play"}
        </button>

        <div className="w-full space-y-4 max-w-md">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Volume</span>
              <span className="label-text-alt">{Math.round(volume * 100)}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="range range-primary"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Buffer Duration</span>
              <span className="label-text-alt">{bufferDuration.toFixed(1)}s</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.1"
              value={bufferDuration}
              onChange={(e) => setBufferDuration(parseFloat(e.target.value))}
              className="range range-primary"
              disabled={isPlaying}
            />
            <label className="label">
              <span className="label-text-alt">Length of the audio buffer (requires restart)</span>
            </label>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Channels</span>
              <span className="label-text-alt">{channels === 1 ? "Mono" : "Stereo"}</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={channels}
              onChange={(e) => setChannels(parseInt(e.target.value))}
              disabled={isPlaying}
            >
              <option value={1}>Mono</option>
              <option value={2}>Stereo</option>
            </select>
            <label className="label">
              <span className="label-text-alt">Audio channels (requires restart)</span>
            </label>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Fade Duration</span>
              <span className="label-text-alt">{(fadeDuration * 1000).toFixed(0)}ms</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={fadeDuration}
              onChange={(e) => setFadeDuration(parseFloat(e.target.value))}
              className="range range-primary"
            />
            <label className="label">
              <span className="label-text-alt">Fade in/out duration</span>
            </label>
          </div>
        </div>
      </div>
    </Page>
  );
};
