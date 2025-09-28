import { useCallback, useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { AudioState, Effects } from "../../audio.types";
import { useFFmpeg } from "../use-ffmpeg/use-ffmpeg";

// Utility function to convert AudioBuffer to WAV Blob
const audioBufferToWav = (buffer: AudioBuffer): Promise<Blob> => {
  return new Promise((resolve) => {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * numberOfChannels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * numberOfChannels * 2, true);

    // Convert audio data
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }

    resolve(new Blob([arrayBuffer], { type: 'audio/wav' }));
  });
};

const defaultEffects: Effects = {
  tempo: { enabled: false, playbackRate: 1.0 },
  distortion: { enabled: false, amount: 0.4, oversample: "4x" },
  chorus: { enabled: false, frequency: 1.5, delayTime: 3.5, depth: 0.7 },
  phaser: { enabled: false, frequency: 0.5, octaves: 3, depth: 1 },
  tremolo: { enabled: false, frequency: 10, depth: 0.9 },
  vibrato: { enabled: false, frequency: 5, depth: 0.1 },
  reverb: { enabled: false, decay: 1.5, wet: 0.3 },
  delay: { enabled: false, delayTime: 0.25, feedback: 0.125, wet: 0.25 },
  pingPongDelay: {
    enabled: false,
    delayTime: 0.25,
    feedback: 0.125,
    wet: 0.25,
  },
  filter: { enabled: false, frequency: 1000, type: "lowpass", Q: 1 },
  autoFilter: { enabled: false, frequency: 1, depth: 1, baseFrequency: 200 },
  compressor: {
    enabled: false,
    threshold: -24,
    ratio: 12,
    attack: 0.003,
    release: 0.25,
  },
  limiter: { enabled: false, threshold: -20 },
  pitchShift: { enabled: false, pitch: 0, wet: 1 },
  eq3: { enabled: false, low: 0, mid: 0, high: 0 },
  volume: { enabled: false, volume: 0 }, // 0 dB = no change
};

export const useAudioEffects = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    isLoading: false,
    duration: 0,
    currentTime: 0,
    isLooping: false,
  });
  const [effects, setEffects] = useState<Effects>(defaultEffects);
  const [isDownloading, setIsDownloading] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  const playerRef = useRef<Tone.Player | null>(null);
  const effectsChainRef = useRef<{ [key: string]: Tone.ToneAudioNode }>({});
  const recorderRef = useRef<Tone.Recorder | null>(null);
  const gainNodeRef = useRef<Tone.Gain | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Use the FFmpeg hook
const {
    loaded: ffmpegLoaded,
    loadProgress: ffmpegLoadProgress,
    convertAudio,
  } = useFFmpeg();

  const createEffectChain = useCallback(() => {
    if (!playerRef.current) return;

    // Dispose of existing effects
    Object.values(effectsChainRef.current).forEach(
      (effect: Tone.ToneAudioNode) => {
        if (effect && effect.dispose) {
          try {
            effect.dispose();
          } catch (error) {
            console.warn("Error disposing effect:", error);
          }
        }
      }
    );
    effectsChainRef.current = {};

    // Disconnect player from previous connections
    try {
      playerRef.current.disconnect();
    } catch (error) {
      // Ignore if not connected
    }

    // Create gain node for final output
    const gainNode = new Tone.Gain(1);
    gainNodeRef.current = gainNode;

    // Build effect chain starting from the player
    let currentOutput: Tone.ToneAudioNode = playerRef.current;

    // Tempo effect (changes playback rate)
    if (effects.tempo.enabled) {
      playerRef.current.playbackRate = effects.tempo.playbackRate;
    } else {
      playerRef.current.playbackRate = 1;
    }

    // EQ3 (first in chain)
    if (effects.eq3.enabled) {
      const eq = new Tone.EQ3(
        effects.eq3.low,
        effects.eq3.mid,
        effects.eq3.high
      );
      effectsChainRef.current.eq3 = eq;
      currentOutput.connect(eq);
      currentOutput = eq;
    }

    // Compressor (early in chain)
    if (effects.compressor.enabled) {
      const compressor = new Tone.Compressor({
        threshold: effects.compressor.threshold,
        ratio: effects.compressor.ratio,
        attack: effects.compressor.attack,
        release: effects.compressor.release,
      });
      effectsChainRef.current.compressor = compressor;
      currentOutput.connect(compressor);
      currentOutput = compressor;
    }

    // Distortion
    if (effects.distortion.enabled) {
      const distortion = new Tone.Distortion({
        distortion: effects.distortion.amount,
        oversample: effects.distortion.oversample as "2x" | "4x" | "none",
      });
      effectsChainRef.current.distortion = distortion;
      currentOutput.connect(distortion);
      currentOutput = distortion;
    }

    // Filters
    if (effects.filter.enabled) {
      const filter = new Tone.Filter({
        frequency: effects.filter.frequency,
        type: effects.filter.type as BiquadFilterType,
        Q: effects.filter.Q,
      });
      effectsChainRef.current.filter = filter;
      currentOutput.connect(filter);
      currentOutput = filter;
    }

    if (effects.autoFilter.enabled) {
      const autoFilter = new Tone.AutoFilter({
        frequency: effects.autoFilter.frequency,
        depth: effects.autoFilter.depth,
        baseFrequency: effects.autoFilter.baseFrequency,
      }).start();
      effectsChainRef.current.autoFilter = autoFilter;
      currentOutput.connect(autoFilter);
      currentOutput = autoFilter;
    }

    // Pitch
    if (effects.pitchShift.enabled) {
      const pitchShift = new Tone.PitchShift({
        pitch: effects.pitchShift.pitch,
        wet: effects.pitchShift.wet,
      });
      effectsChainRef.current.pitchShift = pitchShift;
      currentOutput.connect(pitchShift);
      currentOutput = pitchShift;
    }

    // Modulation effects
    if (effects.chorus.enabled) {
      const chorus = new Tone.Chorus({
        frequency: effects.chorus.frequency,
        delayTime: effects.chorus.delayTime,
        depth: effects.chorus.depth,
      }).start();
      effectsChainRef.current.chorus = chorus;
      currentOutput.connect(chorus);
      currentOutput = chorus;
    }

    if (effects.phaser.enabled) {
      const phaser = new Tone.Phaser({
        frequency: effects.phaser.frequency,
        octaves: effects.phaser.octaves,
      });
      effectsChainRef.current.phaser = phaser;
      currentOutput.connect(phaser);
      currentOutput = phaser;
    }

    if (effects.tremolo.enabled) {
      const tremolo = new Tone.Tremolo({
        frequency: effects.tremolo.frequency,
        depth: effects.tremolo.depth,
      }).start();
      effectsChainRef.current.tremolo = tremolo;
      currentOutput.connect(tremolo);
      currentOutput = tremolo;
    }

    if (effects.vibrato.enabled) {
      const vibrato = new Tone.Vibrato({
        frequency: effects.vibrato.frequency,
        depth: effects.vibrato.depth,
      });
      effectsChainRef.current.vibrato = vibrato;
      currentOutput.connect(vibrato);
      currentOutput = vibrato;
    }

    // Time-based effects (later in chain)
    if (effects.delay.enabled) {
      const delay = new Tone.FeedbackDelay({
        delayTime: effects.delay.delayTime,
        feedback: effects.delay.feedback,
        wet: effects.delay.wet,
      });
      effectsChainRef.current.delay = delay;
      currentOutput.connect(delay);
      currentOutput = delay;
    }

    if (effects.pingPongDelay.enabled) {
      const pingPongDelay = new Tone.PingPongDelay({
        delayTime: effects.pingPongDelay.delayTime,
        feedback: effects.pingPongDelay.feedback,
        wet: effects.pingPongDelay.wet,
      });
      effectsChainRef.current.pingPongDelay = pingPongDelay;
      currentOutput.connect(pingPongDelay);
      currentOutput = pingPongDelay;
    }

    if (effects.reverb.enabled) {
      const reverb = new Tone.Reverb({
        decay: effects.reverb.decay,
        wet: effects.reverb.wet,
      });
      effectsChainRef.current.reverb = reverb;
      currentOutput.connect(reverb);
      currentOutput = reverb;
    }

    // Volume (before limiter)
    if (effects.volume.enabled) {
      const volume = new Tone.Volume(effects.volume.volume);
      effectsChainRef.current.volume = volume;
      currentOutput.connect(volume);
      currentOutput = volume;
    }

    // Limiter (last effect)
    if (effects.limiter.enabled) {
      const limiter = new Tone.Limiter(effects.limiter.threshold);
      effectsChainRef.current.limiter = limiter;
      currentOutput.connect(limiter);
      currentOutput = limiter;
    }

    // Connect to final gain node
    currentOutput.connect(gainNode);

    // Connect to recorder if it exists
    if (recorderRef.current) {
      gainNode.connect(recorderRef.current);
    }

    // Connect to destination
    gainNode.connect(Tone.Destination);
  }, [effects]);

  const generateWaveformData = useCallback((audioBuffer: AudioBuffer) => {
    const samples = 1000; // Number of bars in waveform
    const blockSize = Math.floor(audioBuffer.length / samples);
    const waveform: number[] = [];

    // Get the first channel
    const channelData = audioBuffer.getChannelData(0);

    for (let i = 0; i < samples; i++) {
      let sum = 0;
      const start = i * blockSize;
      const end = Math.min(start + blockSize, channelData.length);

      // Calculate RMS (root mean square) for this block
      for (let j = start; j < end; j++) {
        sum += channelData[j] * channelData[j];
      }

      const rms = Math.sqrt(sum / (end - start));
      waveform.push(rms);
    }

    // Normalize to 0-1 range
    const max = Math.max(...waveform);
    const normalizedWaveform = waveform.map((val) => val / max);

    setWaveformData(normalizedWaveform);
  }, []);

  const loadYouTubeAudio = useCallback(async (url: string) => {
    if (!url.trim()) return;

    console.log("YouTube URL loading not implemented yet:", url);
    // TODO: Implement YouTube audio extraction
    // This would require a backend service or YouTube API integration
    alert(
      "YouTube integration coming soon! For now, please upload an audio file."
    );
  }, []);

  const loadAudioFile = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const file = files[0];
      setAudioFile(file);
      setAudioState((prev) => ({ ...prev, isLoading: true }));

      try {
        // Start AudioContext on file load (this is a user gesture)
        if (Tone.getContext().state !== "running") {
          await Tone.start();
        }

        // Dispose of previous player and effects
        if (playerRef.current) {
          playerRef.current.dispose();
        }

        Object.values(effectsChainRef.current).forEach(
          (effect: Tone.ToneAudioNode) => {
            if (effect && effect.dispose) effect.dispose();
          }
        );
        if (recorderRef.current) {
          recorderRef.current.dispose();
        }
        if (gainNodeRef.current) {
          gainNodeRef.current.dispose();
        }

        effectsChainRef.current = {};

        // Create audio URL from file
        const audioUrl = URL.createObjectURL(file);

        // Create new player
        const player = new Tone.Player({
          url: audioUrl,
          loop: false, // Initialize loop to false
          onload: () => {
            console.log("Audio loaded successfully");
            setAudioState((prev) => ({
              ...prev,
              isLoading: false,
              duration: player.buffer.duration,
            }));

            // Generate waveform data
            const buffer = player.buffer.get();
            if (buffer) {
              generateWaveformData(buffer);
            }

            // Create recorder
            const recorder = new Tone.Recorder();
            recorderRef.current = recorder;

            // Create initial effect chain
            createEffectChain();
          },
          onerror: (error) => {
            console.error("Error loading audio:", error);
            setAudioState((prev) => ({ ...prev, isLoading: false }));
          },
        });

        playerRef.current = player;
      } catch (error) {
        console.error("Error loading audio file:", error);
        setAudioState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [createEffectChain, generateWaveformData]
  );

  const startProgressTracking = useCallback((startPosition?: number) => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    const startTime = Tone.now();
    let initialPosition = startPosition;

    // If no start position provided, get current time
    if (initialPosition === undefined) {
      setAudioState((prev) => {
        initialPosition = prev.currentTime;
        return prev;
      });
    }

    progressIntervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.state === "started") {
        const elapsed = Tone.now() - startTime;

        setAudioState((current) => {
          let currentTime = (initialPosition || 0) + elapsed;

          // Handle looping by using modulo
          if (current.isLooping && current.duration > 0) {
            currentTime = currentTime % current.duration;
          } else {
            currentTime = Math.min(currentTime, current.duration);
          }

          // Handle end of track (only for non-looping)
          if (currentTime >= current.duration && !current.isLooping) {
            // Stop playback
            playerRef.current?.stop();
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
            return {
              ...current,
              isPlaying: false,
              currentTime: 0,
            };
          }

          return { ...current, currentTime };
        });
      }
    }, 100); // Update every 100ms
  }, []);

  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const toggleLoop = useCallback(() => {
    setAudioState((prev) => {
      const newLooping = !prev.isLooping;

      // Update the player's loop setting if it exists
      if (playerRef.current) {
        playerRef.current.loop = newLooping;
      }

      return { ...prev, isLooping: newLooping };
    });
  }, []);

  const seekTo = useCallback(
    (time: number) => {
      if (!playerRef.current || !playerRef.current.loaded) return;

      try {
        const wasPlaying = audioState.isPlaying;

        // Stop current playback and progress tracking
        if (playerRef.current.state === "started") {
          playerRef.current.stop();
        }
        stopProgressTracking();

        // Update current time immediately for UI feedback
        setAudioState((prev) => ({
          ...prev,
          currentTime: time,
          isPlaying: false // Set to false during seek
        }));

        // If it was playing, restart from the new position
        if (wasPlaying) {
          // Small delay to ensure stop is processed
          setTimeout(() => {
            if (playerRef.current) {
              playerRef.current.start(0, time);
              setAudioState((prev) => ({ ...prev, isPlaying: true }));
              startProgressTracking(time);
            }
          }, 50); // Increased delay for more reliable seeking
        }
      } catch (error) {
        console.error("Seek error:", error);
      }
    },
    [audioState.isPlaying, startProgressTracking, stopProgressTracking]
  );

  const togglePlayback = useCallback(async () => {
    if (!playerRef.current) return;

    try {
      // Start AudioContext on first user interaction
      if (Tone.getContext().state !== "running") {
        console.log("Starting AudioContext after user gesture...");
        await Tone.start();
      }

      // Check if buffer is loaded
      if (!playerRef.current.loaded) {
        console.warn("Audio buffer not loaded yet");
        return;
      }

      if (audioState.isPlaying) {
        playerRef.current.stop();
        stopProgressTracking();
        setAudioState((prev) => ({ ...prev, isPlaying: false }));
      } else {
        // Start from current position
        playerRef.current.start(0, audioState.currentTime);
        startProgressTracking(audioState.currentTime);
        setAudioState((prev) => ({ ...prev, isPlaying: true }));
      }
    } catch (error) {
      console.error("Playback error:", error);
    }
  }, [
    audioState.isPlaying,
    audioState.currentTime,
    startProgressTracking,
    stopProgressTracking,
  ]);

  const updateEffect = useCallback(
    (effectName: keyof Effects, updates: Partial<Effects[keyof Effects]>) => {
      setEffects((prev) => ({
        ...prev,
        [effectName]: { ...prev[effectName], ...updates },
      }));
    },
    []
  );

  const downloadProcessedAudio = useCallback(
    async (outputFormat: string = "mp3") => {
      if (!playerRef.current || !audioFile || isDownloading) return;

      if (!ffmpegLoaded) {
        throw new Error("FFmpeg not ready");
      }

      try {
        setIsDownloading(true);
        console.log("🎛️ Starting offline audio processing...");

        const buffer = playerRef.current.buffer;
        if (!buffer) {
          throw new Error("No audio buffer loaded");
        }

        const duration = buffer.duration;
        console.log(`📊 Processing ${duration.toFixed(2)}s of audio offline...`);

        // Use Tone.Offline to render the audio with effects applied
        const processedBuffer = await Tone.Offline(async () => {
          // Create offline player and effects chain
          const offlinePlayer = new Tone.Player(buffer);
          let currentOutput: Tone.ToneAudioNode = offlinePlayer;

          // Build the same effects chain as in real-time
          if (effects.distortion.enabled) {
            const distortion = new Tone.Distortion(effects.distortion.amount);
            currentOutput.connect(distortion);
            currentOutput = distortion;
          }

          if (effects.chorus.enabled) {
            const chorus = new Tone.Chorus(effects.chorus.frequency, effects.chorus.delayTime, effects.chorus.depth);
            currentOutput.connect(chorus);
            currentOutput = chorus;
          }

          if (effects.phaser.enabled) {
            const phaser = new Tone.Phaser(effects.phaser.frequency, effects.phaser.octaves);
            currentOutput.connect(phaser);
            currentOutput = phaser;
          }

          if (effects.tremolo.enabled) {
            const tremolo = new Tone.Tremolo(effects.tremolo.frequency, effects.tremolo.depth);
            currentOutput.connect(tremolo);
            currentOutput = tremolo;
          }

          if (effects.vibrato.enabled) {
            const vibrato = new Tone.Vibrato(effects.vibrato.frequency, effects.vibrato.depth);
            currentOutput.connect(vibrato);
            currentOutput = vibrato;
          }

          if (effects.filter.enabled) {
            const filter = new Tone.Filter(effects.filter.frequency, effects.filter.type as BiquadFilterType);
            currentOutput.connect(filter);
            currentOutput = filter;
          }

          if (effects.autoFilter.enabled) {
            const autoFilter = new Tone.AutoFilter(effects.autoFilter.frequency, effects.autoFilter.baseFrequency, effects.autoFilter.depth);
            currentOutput.connect(autoFilter);
            currentOutput = autoFilter;
          }

          if (effects.compressor.enabled) {
            const compressor = new Tone.Compressor(effects.compressor.threshold, effects.compressor.ratio);
            currentOutput.connect(compressor);
            currentOutput = compressor;
          }

          if (effects.limiter.enabled) {
            const limiter = new Tone.Limiter(effects.limiter.threshold);
            currentOutput.connect(limiter);
            currentOutput = limiter;
          }

          if (effects.pitchShift.enabled) {
            const pitchShift = new Tone.PitchShift(effects.pitchShift.pitch);
            currentOutput.connect(pitchShift);
            currentOutput = pitchShift;
          }

          if (effects.eq3.enabled) {
            const eq3 = new Tone.EQ3(effects.eq3.low, effects.eq3.mid, effects.eq3.high);
            currentOutput.connect(eq3);
            currentOutput = eq3;
          }

          if (effects.delay.enabled) {
            const delay = new Tone.Delay(effects.delay.delayTime, effects.delay.feedback);
            currentOutput.connect(delay);
            currentOutput = delay;
          }

          if (effects.pingPongDelay.enabled) {
            const pingPongDelay = new Tone.PingPongDelay(effects.pingPongDelay.delayTime, effects.pingPongDelay.feedback);
            currentOutput.connect(pingPongDelay);
            currentOutput = pingPongDelay;
          }

          if (effects.reverb.enabled) {
            const reverb = new Tone.Reverb(effects.reverb.decay);
            currentOutput.connect(reverb);
            currentOutput = reverb;
          }

          if (effects.volume.enabled) {
            const volume = new Tone.Volume(effects.volume.volume);
            currentOutput.connect(volume);
            currentOutput = volume;
          }

          // Connect to destination and start
          currentOutput.toDestination();
          offlinePlayer.start(0);
        }, duration);

        console.log("✅ Offline processing complete!");

        // Convert ToneAudioBuffer to regular AudioBuffer, then to WAV Blob
        const audioBuffer = processedBuffer.get() as AudioBuffer;
        const processedBlob = await audioBufferToWav(audioBuffer);
        console.log("📦 Created WAV blob:", Math.round(processedBlob.size / 1024), "KB");

        // Use FFmpeg to convert to desired format
        const convertedBlob = await convertAudio(processedBlob, outputFormat);

        // Download the converted file
        const timestamp = new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/:/g, "-");
        const originalName = audioFile.name.replace(/\.[^/.]+$/, "") || "audio";
        const filename = `${originalName}-fx-${timestamp}.${outputFormat}`;

        const url = URL.createObjectURL(convertedBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => URL.revokeObjectURL(url), 100);

        console.log(`✅ Downloaded processed audio: ${filename}`);
        setIsDownloading(false);
      } catch (error) {
        console.error("❌ Offline processing error:", error);
        alert("Audio processing failed: " + error);
        setIsDownloading(false);
      }
    },
    [
      audioFile,
      effects,
      isDownloading,
      ffmpegLoaded,
      convertAudio,
    ]
  );

  // Update effects chain when effects change
  useEffect(() => {
    if (playerRef.current) {
      createEffectChain();
    }
  }, [effects, createEffectChain]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopProgressTracking();
      if (playerRef.current) {
        playerRef.current.dispose();
      }
      Object.values(effectsChainRef.current).forEach(
        (effect: Tone.ToneAudioNode) => {
          if (effect && effect.dispose) {
            effect.dispose();
          }
        }
      );

      // Clean up FFmpeg
      try {
        // console.log("🧹 Cleaning up FFmpeg...");
        // ffmpegRef.current.off("log", () => {});
        // ffmpegRef.current.off("progress", () => {});
      } catch (error) {
        console.error("Error cleaning up FFmpeg:", error);
      }
    };
  }, [stopProgressTracking]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    audioFile,
    resetAudioFile: () => setAudioFile(null),
    youtubeUrl,
    setYoutubeUrl,
    audioState,
    effects,
    waveformData,
    isDownloading,
    loaded: ffmpegLoaded,
    ffmpegLoadProgress,
    loadAudioFile,
    loadYouTubeAudio,
    togglePlayback,
    toggleLoop,
    seekTo,
    updateEffect,
    downloadProcessedAudio,
    formatTime,
    convertAudio,
  };
};
