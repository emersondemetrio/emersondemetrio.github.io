import { Page } from "@/components/page/page";
import { useCallback, useEffect, useRef, useState } from "react";
import { AudioWave } from "./AudioWave";

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

export const WhiteNoise = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [buffer, setBuffer] = useState<AudioBuffer | null>(null);
  const [whiteNoiseGain, setWhiteNoiseGain] = useState(DEFAULT_WHITE_NOISE_GAIN);
  const [rainFrequencies, setRainFrequencies] = useState<RainFrequencyConfig[]>(DEFAULT_RAIN_FREQUENCIES);
  const [raindropGain, setRaindropGain] = useState(DEFAULT_RAINDROP_GAIN);
  const [raindropDelayMin, setRaindropDelayMin] = useState(DEFAULT_RAINDROP_DELAY_MIN);
  const [raindropDelayMax, setRaindropDelayMax] = useState(DEFAULT_RAINDROP_DELAY_MAX);
  const audioContextRef = useRef<AudioContext | null>(null);

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
  const play = () => {
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

    // Master gain
    const masterGain = context.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(context.destination);
    masterGainRef.current = masterGain;

    // ===== WHITE NOISE LAYER =====
    const whiteNoiseBuffer = createWhiteNoiseBuffer(context, DEFAULT_BUFFER_DURATION);
    const whiteNoiseSource = context.createBufferSource();
    whiteNoiseSource.buffer = whiteNoiseBuffer;
    whiteNoiseSource.loop = true;

    const whiteNoiseGainNode = context.createGain();
    whiteNoiseGainNode.gain.value = whiteNoiseGain;

    whiteNoiseSource.connect(whiteNoiseGainNode);
    whiteNoiseGainNode.connect(masterGain);

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
      panner.connect(masterGain);

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
      dropPanner.connect(masterGainRef.current);

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
  };

  // Stop all sounds
  const stop = () => {
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

  // Generate initial preview buffer when parameters change
  useEffect(() => {
    if (!isPlaying) {
      generatePreviewBuffer();
    }
  }, [whiteNoiseGain, rainFrequencies, raindropGain, isPlaying, generatePreviewBuffer]);

  // Cleanup - only on unmount
  useEffect(() => {
    return () => {
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
      </div>
    </Page>
  );
};
