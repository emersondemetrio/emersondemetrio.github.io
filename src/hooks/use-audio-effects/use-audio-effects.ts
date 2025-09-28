import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { useCallback, useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { AudioState, Effects } from "../../audio.types";

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
};

export const useAudioEffects = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    isLoading: false,
    duration: 0,
    currentTime: 0,
  });
  const [effects, setEffects] = useState<Effects>(defaultEffects);
  const [isDownloading, setIsDownloading] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  const playerRef = useRef<Tone.Player | null>(null);
  const effectsChainRef = useRef<{ [key: string]: Tone.ToneAudioNode }>({});
  const recorderRef = useRef<Tone.Recorder | null>(null);
  const gainNodeRef = useRef<Tone.Gain | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [ffmpegLoadProgress, setFfmpegLoadProgress] = useState(0);
  const ffmpegRef = useRef(new FFmpeg());

  const load = useCallback(async () => {
    // Try unpkg CDN first, fallback to jsdelivr
    const baseURLs = [
      "https://unpkg.com/@ffmpeg/core-mt@0.12.10/dist/esm",
      "https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@0.12.10/dist/esm"
    ];

    const ffmpeg = ffmpegRef.current;

    console.log("🎬 Starting FFmpeg load...");

    ffmpeg.on("log", ({ message }) => {
      console.log("📝 FFmpeg:", message);
    });

    let lastError;

    for (const baseURL of baseURLs) {
      try {
        console.log("🔗 Trying CDN:", baseURL);

        // toBlobURL is used to bypass CORS issue, urls with the same
        // domain can be used directly.
        console.log("📦 Loading coreURL...");
        const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript");
        console.log("✓ coreURL loaded:", coreURL.substring(0, 50) + "...");

        console.log("📦 Loading wasmURL...");
        const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm");
        console.log("✓ wasmURL loaded:", wasmURL.substring(0, 50) + "...");

        console.log("📦 Loading workerURL...");
        const workerURL = await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript");
        console.log("✓ workerURL loaded:", workerURL.substring(0, 50) + "...");

        // Test if SharedArrayBuffer is available
        console.log("🔍 SharedArrayBuffer available:", typeof SharedArrayBuffer !== 'undefined');
        console.log("🔍 WebAssembly available:", typeof WebAssembly !== 'undefined');
        console.log("🔍 Worker available:", typeof Worker !== 'undefined');

        console.log("🚀 Calling ffmpeg.load()...");

        // Add timeout to prevent infinite hanging
        const loadPromise = ffmpeg.load({ coreURL, wasmURL, workerURL });
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('FFmpeg load timeout after 30 seconds')), 30000)
        );

        await Promise.race([loadPromise, timeoutPromise]);
        console.log("✅ ffmpeg.load() completed successfully");

        setLoaded(true);
        console.log("🎉 FFmpeg is ready!");
        return; // Success, exit the loop
      } catch (error) {
        console.error(`❌ Error with CDN ${baseURL}:`, error);
        lastError = error;
        continue; // Try next CDN
      }
    }

    // If we get here, all CDNs failed
    throw lastError || new Error('All CDN attempts failed');
  }, []);

  useEffect(() => {
    load().catch(error => {
      console.error("❌ FFmpeg failed:", error);
      setFfmpegLoadProgress(0);
    });
  }, [load]);


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
          console.log("Starting AudioContext on file load...");
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
          onload: () => {
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
        });

        playerRef.current = player;
      } catch (error) {
        console.error("Error loading audio file:", error);
        setAudioState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [createEffectChain, generateWaveformData]
  );

  const startProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      if (playerRef.current && audioState.isPlaying) {
        const currentTime = playerRef.current.now();
        setAudioState((prev) => ({ ...prev, currentTime }));
      }
    }, 100); // Update every 100ms
  }, [audioState.isPlaying]);

  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const seekTo = useCallback(
    (time: number) => {
      if (!playerRef.current || !playerRef.current.loaded) return;

      try {
        const wasPlaying = audioState.isPlaying;
        playerRef.current.stop();

        // Only start if it was playing before
        if (wasPlaying) {
          playerRef.current.start(undefined, time);
        }

        setAudioState((prev) => ({ ...prev, currentTime: time }));
      } catch (error) {
        console.error("Seek error:", error);
      }
    },
    [audioState.isPlaying]
  );

  const togglePlayback = useCallback(async () => {
    if (!playerRef.current) return;

    try {
      // Start AudioContext on first user interaction
      if (Tone.getContext().state !== "running") {
        console.log("Starting AudioContext after user gesture...");
        await Tone.start();
      }

      if (audioState.isPlaying) {
        playerRef.current.stop();
        stopProgressTracking();
        setAudioState((prev) => ({ ...prev, isPlaying: false }));
      } else {
        playerRef.current.start();
        startProgressTracking();
        setAudioState((prev) => ({ ...prev, isPlaying: true }));
      }
    } catch (error) {
      console.error("Playback error:", error);
    }
  }, [audioState.isPlaying, startProgressTracking, stopProgressTracking]);

  const updateEffect = useCallback(
    (effectName: keyof Effects, updates: Partial<Effects[keyof Effects]>) => {
      setEffects((prev) => ({
        ...prev,
        [effectName]: { ...prev[effectName], ...updates },
      }));
    },
    []
  );

  const convertAudioWithFFmpeg = useCallback(async (
    inputBlob: Blob,
    outputFormat: string = "mp3"
  ): Promise<Blob> => {
    try {
      console.log("🎵 Starting audio conversion...");
      console.log("  → Input size:", Math.round(inputBlob.size / 1024), "KB");
      console.log("  → Output format:", outputFormat);

      const inputFileName = "input.wav";
      const outputFileName = `output.${outputFormat}`;

      // Write input file
      console.log("📝 Writing input file...");
      const arrayBuffer = await inputBlob.arrayBuffer();
      const ffmpeg = ffmpegRef.current;
      await ffmpeg.writeFile(inputFileName, new Uint8Array(arrayBuffer));
      console.log("✓ Input file written");

      // Run FFmpeg command
      const command = [
        "-i",
        inputFileName,
        // Add quality settings for MP3
        ...(outputFormat === "mp3" ? ["-b:a", "192k"] : []),
        outputFileName,
      ];
      console.log("🎬 Running FFmpeg command:", command.join(" "));
      await ffmpeg.exec(command);
      console.log("✓ FFmpeg command completed");

      // Read the output file
      console.log("📤 Reading output file...");
      const data = await ffmpeg.readFile(outputFileName);
      const uint8Array =
        data instanceof Uint8Array
          ? data
          : new Uint8Array(data as unknown as ArrayBuffer);
      console.log("✓ Output file read");

      // Create blob with appropriate MIME type
      const mimeTypes: { [key: string]: string } = {
        mp3: "audio/mpeg",
        wav: "audio/wav",
        m4a: "audio/mp4",
        ogg: "audio/ogg",
      };

      const outputBlob = new Blob([uint8Array as BlobPart], {
        type: mimeTypes[outputFormat] || "audio/mpeg",
      });
      console.log("✅ Conversion complete!");
      console.log("  → Output size:", Math.round(outputBlob.size / 1024), "KB");

      return outputBlob;
    } catch (error) {
      console.error("❌ FFmpeg conversion error:", error);
      throw error;
    }
  }, []);

  const downloadProcessedAudio = useCallback(
    async (outputFormat: string = "mp3") => {
      if (!playerRef.current || !audioFile || isDownloading) return;

      if (!loaded) {
        throw new Error("FFmpeg not ready");
      }

      try {
        setIsDownloading(true);

        // Create a new recorder for this session
        if (recorderRef.current) {
          recorderRef.current.dispose();
        }
        recorderRef.current = new Tone.Recorder();

        // Connect the gain node to the recorder
        if (gainNodeRef.current) {
          gainNodeRef.current.connect(recorderRef.current);
        }

        // Start recording
        await recorderRef.current.start();

        // Store current playback state
        const wasPlaying = audioState.isPlaying;
        const currentPosition = audioState.currentTime;

        // Stop if currently playing
        if (wasPlaying) {
          playerRef.current.stop();
        }

        // Play the audio silently to record with effects
        playerRef.current.start();

        // Wait for the full duration
        const duration = playerRef.current.buffer.duration;
        await new Promise((resolve) => setTimeout(resolve, duration * 1000));

        // Stop playback
        playerRef.current.stop();

        // If it was playing before, resume from previous position
        if (wasPlaying) {
          playerRef.current.start(0, currentPosition);
        }

        // Stop recording and get the WAV blob
        const recordedBlob = await recorderRef.current.stop();

        // Convert to desired format using FFmpeg
        const convertedBlob = await convertAudioWithFFmpeg(
          recordedBlob,
          outputFormat
        );

        // Download
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

        console.log(`Downloaded: ${filename}`);
        setIsDownloading(false);
      } catch (error) {
        console.error("Download error:", error);
        alert("Download failed: " + error);
        setIsDownloading(false);
      }
    },
    [
      audioFile,
      audioState.isPlaying,
      audioState.currentTime,
      isDownloading,
      loaded,
      convertAudioWithFFmpeg,
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

  const manualLoadFFmpeg = useCallback(async () => {
    if (loaded) return;

    try {
      console.log("🎬 Manual Loading FFmpeg...");
      await load();
      console.log("✅ Manual FFmpeg ready!");
    } catch (error) {
      console.error("❌ Manual FFmpeg failed:", error);
      setFfmpegLoadProgress(0);
    }
  }, [loaded, load]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    audioFile,
    youtubeUrl,
    setYoutubeUrl,
    audioState,
    effects,
    waveformData,
    isDownloading,
    loaded,
    ffmpegLoadProgress,
    loadAudioFile,
    loadYouTubeAudio,
    togglePlayback,
    seekTo,
    updateEffect,
    downloadProcessedAudio,
    formatTime,
    convertAudioWithFFmpeg,
    manualLoadFFmpeg,
  };
};
