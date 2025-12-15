import { Page } from "@/components/page/page";
import { useEffect, useRef, useState } from "react";
import { AudioWave } from "./AudioWave";

export const GenerateWhiteNoise = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [buffer, setBuffer] = useState<AudioBuffer | null>(null);
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
    if (audioContextRef.current) {
      return audioContextRef.current;
    }

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
  const createWhiteNoiseBuffer = (context: AudioContext, duration: number = 3): AudioBuffer => {
    const sampleRate = context.sampleRate;
    const frameCount = sampleRate * duration;
    const buffer = context.createBuffer(2, frameCount, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = (Math.random() * 2 - 1) * 0.3;
      }
    }

    return buffer;
  };

  // Create brown noise buffer (for rain rumble)
  const createBrownNoiseBuffer = (context: AudioContext, duration: number = 3): AudioBuffer => {
    const sampleRate = context.sampleRate;
    const frameCount = sampleRate * duration;
    const buffer = context.createBuffer(2, frameCount, sampleRate);

    let lastValueL = 0;
    let lastValueR = 0;
    
    for (let i = 0; i < frameCount; i++) {
      const whiteNoiseL = (Math.random() * 2 - 1) * 0.3;
      const whiteNoiseR = (Math.random() * 2 - 1) * 0.3;
      
      lastValueL = lastValueL * 0.98 + whiteNoiseL * 0.02;
      lastValueR = lastValueR * 0.98 + whiteNoiseR * 0.02;
      
      lastValueL = Math.max(-0.8, Math.min(0.8, lastValueL));
      lastValueR = Math.max(-0.8, Math.min(0.8, lastValueR));
      
      buffer.getChannelData(0)[i] = lastValueL;
      buffer.getChannelData(1)[i] = lastValueR;
    }

    return buffer;
  };

  // Create filtered rain noise buffer for specific frequency range
  const createRainNoiseBuffer = (context: AudioContext, duration: number = 3): AudioBuffer => {
    const sampleRate = context.sampleRate;
    const frameCount = sampleRate * duration;
    const buffer = context.createBuffer(2, frameCount, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = (Math.random() * 2 - 1) * 0.2;
      }
    }

    return buffer;
  };

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

    if (context.state === "suspended") {
      context.resume();
    }

    // Master gain
    const masterGain = context.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(context.destination);
    masterGainRef.current = masterGain;

    // ===== WHITE NOISE LAYER =====
    const whiteNoiseBuffer = createWhiteNoiseBuffer(context, 3);
    const whiteNoiseSource = context.createBufferSource();
    whiteNoiseSource.buffer = whiteNoiseBuffer;
    whiteNoiseSource.loop = true;

    const whiteNoiseGain = context.createGain();
    whiteNoiseGain.gain.value = 0.15;

    whiteNoiseSource.connect(whiteNoiseGain);
    whiteNoiseGain.connect(masterGain);

    whiteNoiseSourceRef.current = whiteNoiseSource;
    whiteNoiseGainRef.current = whiteNoiseGain;

    whiteNoiseSource.start(0);

    // ===== RAIN LAYERS - 10 different frequencies =====
    const rainFrequencies = [
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

    rainSourcesRef.current = [];
    rainFiltersRef.current = [];
    rainGainsRef.current = [];
    rainPannersRef.current = [];

    rainFrequencies.forEach((freqConfig, index) => {
      // Create brown noise for lower frequencies, white noise for higher
      const useBrownNoise = index < 3;
      const rainBuffer = useBrownNoise 
        ? createBrownNoiseBuffer(context, 3)
        : createRainNoiseBuffer(context, 3);
      
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
      dropGain.gain.value = 0.08;
      
      const dropPanner = audioContextRef.current.createStereoPanner();
      dropPanner.pan.value = (Math.random() * 2 - 1) * 0.5; // Random panning
      
      dropSource.connect(dropGain);
      dropGain.connect(dropPanner);
      dropPanner.connect(masterGainRef.current);
      
      dropSource.start(0);
      dropSource.stop(audioContextRef.current.currentTime + 0.1);
    };

    // Trigger raindrops randomly every 30-150ms
    const scheduleNextDrop = () => {
      const delay = 30 + Math.random() * 120;
      dropIntervalRef.current = window.setTimeout(() => {
        triggerRaindrop();
        if (masterGainRef.current && audioContextRef.current) {
          scheduleNextDrop();
        }
      }, delay);
    };

    scheduleNextDrop();

    // Create a combined buffer for visualization (white noise + first rain layer)
    const combinedBuffer = createWhiteNoiseBuffer(context, 3);
    setBuffer(combinedBuffer);

    // Fade in master gain
    const fadeInTime = context.currentTime + 0.5;
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
      const fadeOutTime = audioContextRef.current.currentTime + 0.5;
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

  // Cleanup
  useEffect(() => {
    return () => {
      if (dropIntervalRef.current) {
        clearTimeout(dropIntervalRef.current);
      }
      stop();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <Page name="Generate White Noise" description="High-quality white noise and rain sound generator using Web Audio API">
      <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
        {buffer && (
          <div className="w-full">
            <AudioWave buffer={buffer} width={800} height={200} />
          </div>
        )}

        <div className="flex flex-col items-center gap-4 w-full">
          {!isPlaying ? (
            <button
              className="btn btn-lg btn-primary w-full max-w-md"
              onClick={play}
            >
              ▶ Play White Noise
            </button>
          ) : (
            <button
              className="btn btn-lg btn-error w-full max-w-md"
              onClick={stop}
            >
              ⏹ Stop White Noise
            </button>
          )}
        </div>
      </div>
    </Page>
  );
};
