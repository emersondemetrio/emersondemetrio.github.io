import { Page } from "@/components/page/page";
import { useCallback, useEffect, useRef, useState } from "react";
import { AudioWave } from "./AudioWave";
import { Effects } from "@/audio.types";

type RainFrequencyConfig = {
  low: number;
  high: number;
  gain: number;
  pan: number;
};

// Default constants
const DEFAULT_WHITE_NOISE_GAIN = 0.15;
const DEFAULT_BUFFER_DURATION = 3;
const DEFAULT_FADE_DURATION = 0.5;
const DEFAULT_RAINDROP_GAIN = 0.08;
const DEFAULT_RAINDROP_DELAY_MIN = 30;
const DEFAULT_RAINDROP_DELAY_MAX = 150;
const DEFAULT_WHITE_NOISE_AMPLITUDE = 0.3;
const DEFAULT_BROWN_NOISE_AMPLITUDE = 0.3;
const DEFAULT_RAIN_NOISE_AMPLITUDE = 0.2;
const DEFAULT_BROWN_NOISE_INTEGRATION = 0.98;
const DEFAULT_BROWN_NOISE_NEW_SAMPLE = 0.02;

const DEFAULT_RAIN_FREQUENCIES: RainFrequencyConfig[] = [
  { low: 60, high: 120, gain: 0.35, pan: -0.4 },   // Deep rumble
  { low: 100, high: 300, gain: 0.3, pan: -0.3 },  // Low rumble
  { low: 200, high: 500, gain: 0.25, pan: -0.2 },  // Mid-low
  { low: 400, high: 800, gain: 0.2, pan: -0.1 },   // Mid
  { low: 800, high: 1500, gain: 0.18, pan: 0 },    // Center
  { low: 1500, high: 2500, gain: 0.16, pan: 0.1 }, // Mid-high
  { low: 2000, high: 4000, gain: 0.14, pan: 0.2 }, // High
  { low: 3000, high: 6000, gain: 0.12, pan: 0.3 }, // Very high
  { low: 5000, high: 8000, gain: 0.1, pan: 0.35 },  // Ultra high
  { low: 7000, high: 12000, gain: 0.08, pan: 0.4 }, // Highest
];

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
  volume: { enabled: false, volume: 0 },
};

export const WhiteNoise = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [buffer, setBuffer] = useState<AudioBuffer | null>(null);
  const [whiteNoiseGain, setWhiteNoiseGain] = useState(DEFAULT_WHITE_NOISE_GAIN);
  const [rainFrequencies, setRainFrequencies] = useState<RainFrequencyConfig[]>(DEFAULT_RAIN_FREQUENCIES);
  const [raindropGain, setRaindropGain] = useState(DEFAULT_RAINDROP_GAIN);
  const [raindropDelayMin, setRaindropDelayMin] = useState(DEFAULT_RAINDROP_DELAY_MIN);
  const [raindropDelayMax, setRaindropDelayMax] = useState(DEFAULT_RAINDROP_DELAY_MAX);
  const [effects, setEffects] = useState<Effects>(defaultEffects);
  const [timerMinutes, setTimerMinutes] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  // White noise source
  const whiteNoiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const whiteNoiseGainRef = useRef<GainNode | null>(null);

  // Rain layers - 10 different frequencies
  const rainSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const rainFiltersRef = useRef<BiquadFilterNode[]>([]);
  const rainGainsRef = useRef<GainNode[]>([]);
  const rainPannersRef = useRef<StereoPannerNode[]>([]);

  // Individual raindrops
  const dropIntervalRef = useRef<number | null>(null);

  // Master gain
  const masterGainRef = useRef<GainNode | null>(null);

  // Effect nodes
  const eqLowRef = useRef<BiquadFilterNode | null>(null);
  const eqMidRef = useRef<BiquadFilterNode | null>(null);
  const eqHighRef = useRef<BiquadFilterNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const compressorRef = useRef<DynamicsCompressorNode | null>(null);
  const limiterRef = useRef<DynamicsCompressorNode | null>(null);
  const effectsInputRef = useRef<AudioNode | null>(null);

  // Initialize AudioContext
  const initializeAudioContext = () => {
    // If context exists and is not closed, return it
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      return audioContextRef.current;
    }

    // If context is closed or doesn't exist, create a new one
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const context = new AudioContextClass();
    audioContextRef.current = context;

    if (context.state === "suspended") {
      context.resume();
    }

    return context;
  };

  // Create white noise buffer
  const createWhiteNoiseBuffer = (context: AudioContext, duration: number = DEFAULT_BUFFER_DURATION): AudioBuffer => {
    const sampleRate = context.sampleRate;
    const frameCount = sampleRate * duration;
    const buffer = context.createBuffer(2, frameCount, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = (Math.random() * 2 - 1) * DEFAULT_WHITE_NOISE_AMPLITUDE;
      }
    }

    return buffer;
  };

  // Create brown noise buffer (for rain rumble)
  const createBrownNoiseBuffer = (context: AudioContext, duration: number = DEFAULT_BUFFER_DURATION): AudioBuffer => {
    const sampleRate = context.sampleRate;
    const frameCount = sampleRate * duration;
    const buffer = context.createBuffer(2, frameCount, sampleRate);

    let lastValueL = 0;
    let lastValueR = 0;

    for (let i = 0; i < frameCount; i++) {
      const whiteNoiseL = (Math.random() * 2 - 1) * DEFAULT_BROWN_NOISE_AMPLITUDE;
      const whiteNoiseR = (Math.random() * 2 - 1) * DEFAULT_BROWN_NOISE_AMPLITUDE;

      lastValueL = lastValueL * DEFAULT_BROWN_NOISE_INTEGRATION + whiteNoiseL * DEFAULT_BROWN_NOISE_NEW_SAMPLE;
      lastValueR = lastValueR * DEFAULT_BROWN_NOISE_INTEGRATION + whiteNoiseR * DEFAULT_BROWN_NOISE_NEW_SAMPLE;

      lastValueL = Math.max(-0.8, Math.min(0.8, lastValueL));
      lastValueR = Math.max(-0.8, Math.min(0.8, lastValueR));

      buffer.getChannelData(0)[i] = lastValueL;
      buffer.getChannelData(1)[i] = lastValueR;
    }

    return buffer;
  };

  // Create filtered rain noise buffer for specific frequency range
  const createRainNoiseBuffer = (context: AudioContext, duration: number = DEFAULT_BUFFER_DURATION): AudioBuffer => {
    const sampleRate = context.sampleRate;
    const frameCount = sampleRate * duration;
    const buffer = context.createBuffer(2, frameCount, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = (Math.random() * 2 - 1) * DEFAULT_RAIN_NOISE_AMPLITUDE;
      }
    }

    return buffer;
  };

  // Generate preview buffer for visualization
  const generatePreviewBuffer = useCallback(() => {
    if (!audioContextRef.current) {
      const context = initializeAudioContext();
      if (!context) return;
    }
    const context = audioContextRef.current!;

    // Check if context is closed
    if (context.state === "closed") {
      return;
    }

    // Create a combined preview buffer (white noise + sample of rain layers)
    const previewBuffer = createWhiteNoiseBuffer(context, DEFAULT_BUFFER_DURATION);
    const channel0 = previewBuffer.getChannelData(0);
    const channel1 = previewBuffer.getChannelData(1);

    // Add weighted samples from rain frequencies to show their character
    rainFrequencies.forEach((freqConfig, index) => {
      // Sample a few rain layers to show in preview
      if (index % 3 === 0) {
        const centerFreq = (freqConfig.low + freqConfig.high) / 2;
        const sampleRate = context.sampleRate;

        // Add filtered noise character based on frequency range
        for (let i = 0; i < channel0.length; i++) {
          const t = i / sampleRate;
          // Simulate bandpass filtered noise
          const noise = (Math.random() * 2 - 1) * freqConfig.gain * 0.3;
          const freqComponent = Math.sin(2 * Math.PI * centerFreq * t) * 0.1;
          channel0[i] += noise + freqComponent;
          channel1[i] += noise + freqComponent;
        }
      }
    });

    // Normalize to prevent clipping
    let max = 0;
    for (let i = 0; i < channel0.length; i++) {
      max = Math.max(max, Math.abs(channel0[i]), Math.abs(channel1[i]));
    }
    if (max > 0.9) {
      const scale = 0.9 / max;
      for (let i = 0; i < channel0.length; i++) {
        channel0[i] *= scale;
        channel1[i] *= scale;
      }
    }

    setBuffer(previewBuffer);
  }, [rainFrequencies]);

  // Create individual raindrop sound
  const createRaindrop = (context: AudioContext): AudioBufferSourceNode => {
    const duration = 0.01;
    const sampleRate = context.sampleRate;
    const frameCount = Math.floor(sampleRate * duration);
    const buffer = context.createBuffer(2, frameCount, sampleRate);

    const useImpulse = Math.random() > 0.5;

    if (useImpulse) {
      const impulseLength = Math.floor(frameCount * 0.1);
      for (let channel = 0; channel < 2; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < impulseLength; i++) {
          channelData[i] = (Math.random() * 2 - 1) * 0.3 * (1 - i / impulseLength);
        }
      }
    } else {
      const startFreq = 1000 + Math.random() * 2000;
      const endFreq = 3000 + Math.random() * 2000;
      for (let channel = 0; channel < 2; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
          const t = i / frameCount;
          const freq = startFreq + (endFreq - startFreq) * t;
          const phase = (freq * 2 * Math.PI * i) / sampleRate;
          const envelope = Math.exp(-t * 50);
          channelData[i] = Math.sin(phase) * envelope * 0.2;
        }
      }
    }

    const source = context.createBufferSource();
    source.buffer = buffer;
    return source;
  };

  // Play combined white noise and rain
  const play = useCallback(() => {
    const context = initializeAudioContext();

    // Check if context is closed, recreate if needed
    if (context.state === "closed") {
      audioContextRef.current = null;
      const newContext = initializeAudioContext();
      if (!newContext || newContext.state === "closed") {
        return;
      }
    }

    if (context.state === "suspended") {
      context.resume();
    }

    // Check context state before creating nodes
    if (context.state === "closed") {
      console.warn("AudioContext is closed, cannot play");
      return;
    }

    // Master gain (create first)
    const masterGain = context.createGain();
    masterGain.gain.value = 0;
    masterGainRef.current = masterGain;

    // Build effects chain (in reverse order, connecting to masterGain)
    let effectsInput: AudioNode = masterGain;

    // Limiter (last effect, closest to masterGain)
    if (effects.limiter.enabled) {
      const limiter = context.createDynamicsCompressor();
      limiter.threshold.value = effects.limiter.threshold;
      limiter.ratio.value = 20;
      limiter.attack.value = 0.003;
      limiter.release.value = 0.01;
      limiterRef.current = limiter;
      limiter.connect(masterGain);
      effectsInput = limiter;
    }

    // Compressor
    if (effects.compressor.enabled) {
      const compressor = context.createDynamicsCompressor();
      compressor.threshold.value = effects.compressor.threshold;
      compressor.ratio.value = effects.compressor.ratio;
      compressor.attack.value = effects.compressor.attack;
      compressor.release.value = effects.compressor.release;
      compressorRef.current = compressor;
      compressor.connect(effectsInput);
      effectsInput = compressor;
    }

    // Filter
    if (effects.filter.enabled) {
      const filter = context.createBiquadFilter();
      filter.type = effects.filter.type as BiquadFilterType;
      filter.frequency.value = effects.filter.frequency;
      filter.Q.value = effects.filter.Q;
      filterRef.current = filter;
      filter.connect(effectsInput);
      effectsInput = filter;
    }

    // EQ3 (first in chain)
    let eqOutput: AudioNode = effectsInput;
    if (effects.eq3.enabled) {
      const eqLow = context.createBiquadFilter();
      eqLow.type = "lowshelf";
      eqLow.frequency.value = 250;
      eqLow.gain.value = effects.eq3.low;
      eqLowRef.current = eqLow;

      const eqMid = context.createBiquadFilter();
      eqMid.type = "peaking";
      eqMid.frequency.value = 1000;
      eqMid.Q.value = 1;
      eqMid.gain.value = effects.eq3.mid;
      eqMidRef.current = eqMid;

      const eqHigh = context.createBiquadFilter();
      eqHigh.type = "highshelf";
      eqHigh.frequency.value = 4000;
      eqHigh.gain.value = effects.eq3.high;
      eqHighRef.current = eqHigh;

      eqLow.connect(eqMid);
      eqMid.connect(eqHigh);
      eqHigh.connect(effectsInput);
      eqOutput = eqLow;
    }

    // Store effects input for raindrops
    effectsInputRef.current = eqOutput;

    // Connect master gain to destination
    masterGain.connect(context.destination);

    // ===== WHITE NOISE LAYER =====
    const whiteNoiseBuffer = createWhiteNoiseBuffer(context, DEFAULT_BUFFER_DURATION);
    const whiteNoiseSource = context.createBufferSource();
    whiteNoiseSource.buffer = whiteNoiseBuffer;
    whiteNoiseSource.loop = true;

    const whiteNoiseGainNode = context.createGain();
    whiteNoiseGainNode.gain.value = whiteNoiseGain;

    whiteNoiseSource.connect(whiteNoiseGainNode);
    // Connect to effects chain start
    if (effectsInputRef.current) {
      whiteNoiseGainNode.connect(effectsInputRef.current);
    } else {
      whiteNoiseGainNode.connect(masterGain);
    }

    whiteNoiseSourceRef.current = whiteNoiseSource;
    whiteNoiseGainRef.current = whiteNoiseGainNode;

    whiteNoiseSource.start(0);

    // ===== RAIN LAYERS - 10 different frequencies =====

    rainSourcesRef.current = [];
    rainFiltersRef.current = [];
    rainGainsRef.current = [];
    rainPannersRef.current = [];

    rainFrequencies.forEach((freqConfig, index) => {
      // Create brown noise for lower frequencies, white noise for higher
      const useBrownNoise = index < 3;
      const rainBuffer = useBrownNoise
        ? createBrownNoiseBuffer(context, DEFAULT_BUFFER_DURATION)
        : createRainNoiseBuffer(context, DEFAULT_BUFFER_DURATION);

      const rainSource = context.createBufferSource();
      rainSource.buffer = rainBuffer;
      rainSource.loop = true;

      // Bandpass filter for specific frequency range
      const filter = context.createBiquadFilter();
      filter.type = "bandpass";
      const centerFreq = (freqConfig.low + freqConfig.high) / 2;
      const bandwidth = freqConfig.high - freqConfig.low;
      filter.frequency.value = centerFreq;
      filter.Q.value = centerFreq / bandwidth;

      // Gain for this layer
      const gain = context.createGain();
      gain.gain.value = freqConfig.gain;

      // Stereo panner for spatial width
      const panner = context.createStereoPanner();
      panner.pan.value = freqConfig.pan;

      rainSource.connect(filter);
      filter.connect(gain);
      gain.connect(panner);
      // Connect to effects chain start
      if (effectsInputRef.current) {
        panner.connect(effectsInputRef.current);
      } else {
        panner.connect(masterGain);
      }

      rainSourcesRef.current.push(rainSource);
      rainFiltersRef.current.push(filter);
      rainGainsRef.current.push(gain);
      rainPannersRef.current.push(panner);

      rainSource.start(0);
    });

    // ===== INDIVIDUAL RAINDROPS =====
    const triggerRaindrop = () => {
      if (!audioContextRef.current || !masterGainRef.current) return;

      const dropSource = createRaindrop(audioContextRef.current);
      const dropGain = audioContextRef.current.createGain();
      dropGain.gain.value = raindropGain;

      const dropPanner = audioContextRef.current.createStereoPanner();
      dropPanner.pan.value = (Math.random() * 2 - 1) * 0.5; // Random panning

      dropSource.connect(dropGain);
      dropGain.connect(dropPanner);
      // Connect raindrops to effects chain start
      if (effectsInputRef.current) {
        dropPanner.connect(effectsInputRef.current);
      } else {
        dropPanner.connect(masterGainRef.current!);
      }

      dropSource.start(0);
      dropSource.stop(audioContextRef.current.currentTime + 0.1);
    };

    // Trigger raindrops randomly
    const scheduleNextDrop = () => {
      const delay = raindropDelayMin + Math.random() * (raindropDelayMax - raindropDelayMin);
      dropIntervalRef.current = window.setTimeout(() => {
        triggerRaindrop();
        if (masterGainRef.current && audioContextRef.current) {
          scheduleNextDrop();
        }
      }, delay);
    };

    scheduleNextDrop();

    // Generate preview buffer for visualization
    generatePreviewBuffer();

    // Fade in master gain
    const fadeInTime = context.currentTime + DEFAULT_FADE_DURATION;
    masterGain.gain.setValueAtTime(0, context.currentTime);
    masterGain.gain.linearRampToValueAtTime(1, fadeInTime);

    setIsPlaying(true);

    // Update previous enabled states
    prevEffectsEnabledRef.current = {
      eq3: effects.eq3.enabled,
      filter: effects.filter.enabled,
      compressor: effects.compressor.enabled,
      limiter: effects.limiter.enabled,
    };

    // Start timer if set
    if (timerMinutes > 0) {
      setTimeRemaining(timerMinutes * 60);
      timerIntervalRef.current = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
              timerIntervalRef.current = null;
            }
            stop();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [effects, timerMinutes, whiteNoiseGain, rainFrequencies, raindropGain, raindropDelayMin, raindropDelayMax, generatePreviewBuffer]);

  // Stop all sounds
  const stop = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
      setTimeRemaining(0);
    }

    if (dropIntervalRef.current) {
      clearTimeout(dropIntervalRef.current);
      dropIntervalRef.current = null;
    }

    if (masterGainRef.current && audioContextRef.current) {
      const fadeOutTime = audioContextRef.current.currentTime + DEFAULT_FADE_DURATION;
      masterGainRef.current.gain.linearRampToValueAtTime(0, fadeOutTime);

      setTimeout(() => {
        // Stop white noise
        if (whiteNoiseSourceRef.current) {
          try {
            whiteNoiseSourceRef.current.stop();
          } catch (e) {
            // Source may already be stopped
          }
          whiteNoiseSourceRef.current = null;
        }

        // Stop all rain layers
        rainSourcesRef.current.forEach((source) => {
          try {
            source.stop();
          } catch (e) {
            // Source may already be stopped
          }
        });
        rainSourcesRef.current = [];
        rainFiltersRef.current = [];
        rainGainsRef.current = [];
        rainPannersRef.current = [];

        setIsPlaying(false);
      }, 600);
    } else {
      setIsPlaying(false);
    }
  };

  // Randomize all parameters
  const randomize = () => {
    // Randomize white noise gain (0.05 - 0.3)
    setWhiteNoiseGain(0.05 + Math.random() * 0.25);

    // Randomize rain frequencies - ensure unique, non-overlapping ranges
    const numLayers = 10;
    const frequencyRanges: RainFrequencyConfig[] = [];
    const usedFrequencies = new Set<number>();

    // Generate frequency ranges that don't overlap
    for (let i = 0; i < numLayers; i++) {
      let low, high;
      let attempts = 0;

      do {
        // Distribute across full spectrum (20Hz to 20000Hz)
        const minFreq = 20 + (i * 1800);
        low = minFreq + Math.random() * 500;
        high = low + 200 + Math.random() * 1500;

        // Ensure high doesn't exceed next layer's space
        if (i < numLayers - 1) {
          const nextMinFreq = 20 + ((i + 1) * 1800);
          high = Math.min(high, nextMinFreq - 50);
        }

        attempts++;
      } while (usedFrequencies.has(Math.floor(low / 100)) && attempts < 10);

      usedFrequencies.add(Math.floor(low / 100));

      // Random gain (0.05 - 0.4)
      const gain = 0.05 + Math.random() * 0.35;

      // Random pan (-0.5 to 0.5)
      const pan = (Math.random() * 2 - 1) * 0.5;

      frequencyRanges.push({ low, high, gain, pan });
    }

    // Sort by frequency
    frequencyRanges.sort((a, b) => a.low - b.low);

    setRainFrequencies(frequencyRanges);

    // Randomize raindrop gain (0.03 - 0.15)
    setRaindropGain(0.03 + Math.random() * 0.12);

    // Randomize raindrop delay (20 - 200ms)
    const newDelayMin = 20 + Math.random() * 50;
    setRaindropDelayMin(newDelayMin);
    setRaindropDelayMax(newDelayMin + 50 + Math.random() * 130);

    // Generate preview buffer to show waveform change
    setTimeout(() => {
      generatePreviewBuffer();
    }, 0);
  };

  const updateEffect = (effectName: keyof Effects, updates: Partial<Effects[keyof Effects]>) => {
    setEffects((prev) => ({
      ...prev,
      [effectName]: { ...prev[effectName], ...updates },
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Generate initial preview buffer when parameters change
  useEffect(() => {
    if (!isPlaying) {
      generatePreviewBuffer();
    }
  }, [whiteNoiseGain, rainFrequencies, raindropGain, isPlaying, generatePreviewBuffer]);

  // Track previous enabled states to detect toggles
  const prevEffectsEnabledRef = useRef({
    eq3: false,
    filter: false,
    compressor: false,
    limiter: false,
  });

  // Update effects while playing
  useEffect(() => {
    if (!isPlaying) return;

    // Check if any effect was enabled/disabled (requires chain rebuild)
    const effectToggled =
      prevEffectsEnabledRef.current.eq3 !== effects.eq3.enabled ||
      prevEffectsEnabledRef.current.filter !== effects.filter.enabled ||
      prevEffectsEnabledRef.current.compressor !== effects.compressor.enabled ||
      prevEffectsEnabledRef.current.limiter !== effects.limiter.enabled;

    // If effect was toggled, restart playback to rebuild chain
    if (effectToggled) {
      prevEffectsEnabledRef.current = {
        eq3: effects.eq3.enabled,
        filter: effects.filter.enabled,
        compressor: effects.compressor.enabled,
        limiter: effects.limiter.enabled,
      };

      const wasPlaying = isPlaying;
      stop();
      setTimeout(() => {
        if (wasPlaying) {
          play();
        }
      }, 200);
      return;
    }

    // Update previous enabled states for parameter changes
    prevEffectsEnabledRef.current = {
      eq3: effects.eq3.enabled,
      filter: effects.filter.enabled,
      compressor: effects.compressor.enabled,
      limiter: effects.limiter.enabled,
    };

    // Update parameters in real-time (only if effects are enabled)
    if (eqLowRef.current && effects.eq3.enabled) {
      eqLowRef.current.gain.value = effects.eq3.low;
    }
    if (eqMidRef.current && effects.eq3.enabled) {
      eqMidRef.current.gain.value = effects.eq3.mid;
    }
    if (eqHighRef.current && effects.eq3.enabled) {
      eqHighRef.current.gain.value = effects.eq3.high;
    }

    if (filterRef.current && effects.filter.enabled) {
      filterRef.current.frequency.value = effects.filter.frequency;
      filterRef.current.Q.value = effects.filter.Q;
      filterRef.current.type = effects.filter.type as BiquadFilterType;
    }

    if (compressorRef.current && effects.compressor.enabled) {
      compressorRef.current.threshold.value = effects.compressor.threshold;
      compressorRef.current.ratio.value = effects.compressor.ratio;
      compressorRef.current.attack.value = effects.compressor.attack;
      compressorRef.current.release.value = effects.compressor.release;
    }

    if (limiterRef.current && effects.limiter.enabled) {
      limiterRef.current.threshold.value = effects.limiter.threshold;
    }
  }, [effects, isPlaying, play]);

  // Cleanup - only on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }

      if (dropIntervalRef.current) {
        clearTimeout(dropIntervalRef.current);
        dropIntervalRef.current = null;
      }

      // Stop all audio sources
      if (whiteNoiseSourceRef.current) {
        try {
          whiteNoiseSourceRef.current.stop();
        } catch (e) {
          // Source may already be stopped
        }
      }

      rainSourcesRef.current.forEach((source) => {
        try {
          source.stop();
        } catch (e) {
          // Source may already be stopped
        }
      });

      // Don't close the context - let it stay open for potential reuse
      // Only close if we're sure we're unmounting and won't need it
      // Closing the context makes it unusable, so we avoid it unless necessary
    };
  }, []);

  return (
    <Page name="Generate White Noise" description="Rain Sound Generator Web Audio API">
      <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex gap-4 w-full max-w-md">
            {!isPlaying ? (
              <button
                className="btn btn-lg btn-primary flex-1"
                onClick={play}
              >
                ▶ Play White Noise
              </button>
            ) : (
              <button
                className="btn btn-lg btn-error flex-1"
                onClick={stop}
              >
                ⏹ Stop White Noise
              </button>
            )}
            <button
              className="btn btn-lg btn-secondary"
              onClick={randomize}
              disabled={isPlaying}
              title="Randomize all parameters"
            >
              Randomize Params
            </button>
          </div>
        </div>
        {buffer && (
          <div className="w-full">
            <AudioWave buffer={buffer} width={800} height={200} />
          </div>
        )}

        {/* Timer Control */}
        <div className="w-full max-w-md space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Timer (minutes)</span>
              {timeRemaining > 0 && (
                <span className="label-text-alt text-primary font-bold">
                  {formatTime(timeRemaining)} remaining
                </span>
              )}
            </label>
            <input
              type="number"
              min="0"
              max="120"
              step="1"
              value={timerMinutes}
              onChange={(e) => setTimerMinutes(Math.max(0, parseInt(e.target.value) || 0))}
              className="input input-bordered w-full"
              disabled={isPlaying}
              placeholder="0 = no timer"
            />
            <label className="label">
              <span className="label-text-alt">Set timer to auto-stop playback (0 to disable)</span>
            </label>
          </div>
        </div>

        {/* Effects Controls */}
        <div className="w-full max-w-2xl space-y-4">
          <h3 className="text-xl font-bold text-center">Effects</h3>

          {/* EQ3 */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between mb-2">
                <h4 className="card-title text-lg">EQ3</h4>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={effects.eq3.enabled}
                  onChange={(e) => updateEffect("eq3", { enabled: e.target.checked })}
                />
              </div>
              {effects.eq3.enabled && (
                <div className="space-y-2">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Low</span>
                      <span className="label-text-alt">{effects.eq3.low.toFixed(1)} dB</span>
                    </label>
                    <input
                      type="range"
                      min="-30"
                      max="30"
                      step="1"
                      value={effects.eq3.low}
                      onChange={(e) => updateEffect("eq3", { low: parseFloat(e.target.value) })}
                      className="range range-primary"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Mid</span>
                      <span className="label-text-alt">{effects.eq3.mid.toFixed(1)} dB</span>
                    </label>
                    <input
                      type="range"
                      min="-30"
                      max="30"
                      step="1"
                      value={effects.eq3.mid}
                      onChange={(e) => updateEffect("eq3", { mid: parseFloat(e.target.value) })}
                      className="range range-primary"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">High</span>
                      <span className="label-text-alt">{effects.eq3.high.toFixed(1)} dB</span>
                    </label>
                    <input
                      type="range"
                      min="-30"
                      max="30"
                      step="1"
                      value={effects.eq3.high}
                      onChange={(e) => updateEffect("eq3", { high: parseFloat(e.target.value) })}
                      className="range range-primary"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Filter */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between mb-2">
                <h4 className="card-title text-lg">Filter</h4>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={effects.filter.enabled}
                  onChange={(e) => updateEffect("filter", { enabled: e.target.checked })}
                />
              </div>
              {effects.filter.enabled && (
                <div className="space-y-2">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Type</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={effects.filter.type}
                      onChange={(e) => updateEffect("filter", { type: e.target.value })}
                    >
                      <option value="lowpass">Low Pass</option>
                      <option value="highpass">High Pass</option>
                      <option value="bandpass">Band Pass</option>
                      <option value="notch">Notch</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Frequency</span>
                      <span className="label-text-alt">{effects.filter.frequency.toFixed(0)} Hz</span>
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="20000"
                      step="10"
                      value={effects.filter.frequency}
                      onChange={(e) => updateEffect("filter", { frequency: parseFloat(e.target.value) })}
                      className="range range-primary"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Q</span>
                      <span className="label-text-alt">{effects.filter.Q.toFixed(2)}</span>
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="10"
                      step="0.1"
                      value={effects.filter.Q}
                      onChange={(e) => updateEffect("filter", { Q: parseFloat(e.target.value) })}
                      className="range range-primary"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Compressor */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between mb-2">
                <h4 className="card-title text-lg">Compressor</h4>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={effects.compressor.enabled}
                  onChange={(e) => updateEffect("compressor", { enabled: e.target.checked })}
                />
              </div>
              {effects.compressor.enabled && (
                <div className="space-y-2">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Threshold</span>
                      <span className="label-text-alt">{effects.compressor.threshold.toFixed(1)} dB</span>
                    </label>
                    <input
                      type="range"
                      min="-60"
                      max="0"
                      step="1"
                      value={effects.compressor.threshold}
                      onChange={(e) => updateEffect("compressor", { threshold: parseFloat(e.target.value) })}
                      className="range range-primary"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Ratio</span>
                      <span className="label-text-alt">{effects.compressor.ratio.toFixed(1)}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="0.1"
                      value={effects.compressor.ratio}
                      onChange={(e) => updateEffect("compressor", { ratio: parseFloat(e.target.value) })}
                      className="range range-primary"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Limiter */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between mb-2">
                <h4 className="card-title text-lg">Limiter</h4>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={effects.limiter.enabled}
                  onChange={(e) => updateEffect("limiter", { enabled: e.target.checked })}
                />
              </div>
              {effects.limiter.enabled && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Threshold</span>
                    <span className="label-text-alt">{effects.limiter.threshold.toFixed(1)} dB</span>
                  </label>
                  <input
                    type="range"
                    min="-40"
                    max="0"
                    step="1"
                    value={effects.limiter.threshold}
                    onChange={(e) => updateEffect("limiter", { threshold: parseFloat(e.target.value) })}
                    className="range range-primary"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};
