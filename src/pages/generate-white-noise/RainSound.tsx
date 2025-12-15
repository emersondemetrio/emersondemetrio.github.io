import { useEffect, useRef, useState } from "react";

export const useRainSound = (initialIntensity: number = 0.5) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [intensity, setIntensity] = useState(initialIntensity);

  const audioContextRef = useRef<AudioContext | null>(null);

  // Layer 1: Low-frequency brown noise (distant rumble)
  const rumbleSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const rumbleFilterRef = useRef<BiquadFilterNode | null>(null);
  const rumbleGainRef = useRef<GainNode | null>(null);
  const rumblePannerRef = useRef<StereoPannerNode | null>(null);

  // Layer 2: Mid-high frequency filtered white noise (pattering droplets)
  const patterSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const patterFilterRef = useRef<BiquadFilterNode | null>(null);
  const patterDelayRef = useRef<DelayNode | null>(null);
  const patterFeedbackRef = useRef<GainNode | null>(null);
  const patterGainRef = useRef<GainNode | null>(null);
  const patterPannerRef = useRef<StereoPannerNode | null>(null);

  // Layer 3: Individual raindrops
  const dropIntervalRef = useRef<number | null>(null);
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

  // Create brown noise buffer (lowpass filtered white noise)
  const createBrownNoiseBuffer = (context: AudioContext, duration: number): AudioBuffer => {
    const sampleRate = context.sampleRate;
    const frameCount = sampleRate * duration;
    const buffer = context.createBuffer(2, frameCount, sampleRate);

    // Generate brown noise by integrating white noise (lowpass effect)
    let lastValueL = 0;
    let lastValueR = 0;

    for (let i = 0; i < frameCount; i++) {
      const whiteNoiseL = (Math.random() * 2 - 1) * 0.5;
      const whiteNoiseR = (Math.random() * 2 - 1) * 0.5;

      // Brown noise: integrate (accumulate) white noise
      lastValueL = lastValueL * 0.98 + whiteNoiseL * 0.02;
      lastValueR = lastValueR * 0.98 + whiteNoiseR * 0.02;

      // Prevent clipping
      lastValueL = Math.max(-0.8, Math.min(0.8, lastValueL));
      lastValueR = Math.max(-0.8, Math.min(0.8, lastValueR));

      buffer.getChannelData(0)[i] = lastValueL;
      buffer.getChannelData(1)[i] = lastValueR;
    }

    return buffer;
  };

  // Create white noise buffer for pattering
  const createWhiteNoiseBuffer = (context: AudioContext, duration: number): AudioBuffer => {
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

  // Create individual raindrop sound
  const createRaindrop = (context: AudioContext): AudioBufferSourceNode => {
    const duration = 0.01; // 10ms impulse
    const sampleRate = context.sampleRate;
    const frameCount = Math.floor(sampleRate * duration);
    const buffer = context.createBuffer(2, frameCount, sampleRate);

    // Option 1: Short impulse
    const useImpulse = Math.random() > 0.5;

    if (useImpulse) {
      // Short impulse
      const impulseLength = Math.floor(frameCount * 0.1);
      for (let channel = 0; channel < 2; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < impulseLength; i++) {
          channelData[i] = (Math.random() * 2 - 1) * 0.5 * (1 - i / impulseLength);
        }
      }
    } else {
      // Option 2: Sine sweep 1-5kHz
      const startFreq = 1000;
      const endFreq = 5000;
      for (let channel = 0; channel < 2; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
          const t = i / frameCount;
          const freq = startFreq + (endFreq - startFreq) * t;
          const phase = (freq * 2 * Math.PI * i) / sampleRate;
          const envelope = Math.exp(-t * 50); // Exponential decay
          channelData[i] = Math.sin(phase) * envelope * 0.3;
        }
      }
    }

    const source = context.createBufferSource();
    source.buffer = buffer;
    return source;
  };

  // Play rain sound
  const play = () => {
    const context = initializeAudioContext();

    if (context.state === "suspended") {
      context.resume();
    }

    // Master gain for overall volume control
    const masterGain = context.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(context.destination);
    masterGainRef.current = masterGain;

    // ===== LAYER 1: Low-frequency brown noise (distant rumble) =====
    const rumbleBuffer = createBrownNoiseBuffer(context, 3);
    const rumbleSource = context.createBufferSource();
    rumbleSource.buffer = rumbleBuffer;
    rumbleSource.loop = true;

    // Lowpass filter at ~80Hz for distant rumble
    const rumbleFilter = context.createBiquadFilter();
    rumbleFilter.type = "lowpass";
    rumbleFilter.frequency.value = 80;
    rumbleFilter.Q.value = 1;

    // Gain: base 0.4, modulated by intensity
    const rumbleGain = context.createGain();
    rumbleGain.gain.value = 0.4 * intensity;

    // Stereo panner for spatial width
    const rumblePanner = context.createStereoPanner();
    rumblePanner.pan.value = -0.3; // Slightly left

    rumbleSource.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(rumblePanner);
    rumblePanner.connect(masterGain);

    rumbleSourceRef.current = rumbleSource;
    rumbleFilterRef.current = rumbleFilter;
    rumbleGainRef.current = rumbleGain;
    rumblePannerRef.current = rumblePanner;

    rumbleSource.start(0);

    // ===== LAYER 2: Mid-high frequency filtered white noise (pattering) =====
    const patterBuffer = createWhiteNoiseBuffer(context, 3);
    const patterSource = context.createBufferSource();
    patterSource.buffer = patterBuffer;
    patterSource.loop = true;

    // Highpass filter 2-6kHz for pattering droplets
    const patterFilter = context.createBiquadFilter();
    patterFilter.type = "highpass";
    patterFilter.frequency.value = 2000 + (intensity * 4000); // 2-6kHz based on intensity
    patterFilter.Q.value = 1;

    // Delay with feedback for subtle echo
    const delayTime = 0.01 + (intensity * 0.08); // 0.01-0.09s
    const patterDelay = context.createDelay(0.1);
    patterDelay.delayTime.value = delayTime;

    const patterFeedback = context.createGain();
    patterFeedback.gain.value = 0.15; // Subtle feedback

    // Gain: base 0.02-0.05, modulated by intensity
    const patterGain = context.createGain();
    patterGain.gain.value = (0.02 + intensity * 0.03);

    // Stereo panner for spatial width
    const patterPanner = context.createStereoPanner();
    patterPanner.pan.value = 0.3; // Slightly right

    patterSource.connect(patterFilter);
    patterFilter.connect(patterDelay);
    patterDelay.connect(patterFeedback);
    patterFeedback.connect(patterDelay); // Feedback loop
    patterDelay.connect(patterGain);
    patterGain.connect(patterPanner);
    patterPanner.connect(masterGain);

    patterSourceRef.current = patterSource;
    patterFilterRef.current = patterFilter;
    patterDelayRef.current = patterDelay;
    patterFeedbackRef.current = patterFeedback;
    patterGainRef.current = patterGain;
    patterPannerRef.current = patterPanner;

    patterSource.start(0);

    // ===== LAYER 3: Individual raindrops (randomly triggered) =====
    const triggerRaindrop = () => {
      if (!audioContextRef.current || !masterGainRef.current) return;

      const dropSource = createRaindrop(audioContextRef.current);
      const dropGain = audioContextRef.current.createGain();
      dropGain.gain.value = 0.1 * intensity;

      dropSource.connect(dropGain);
      dropGain.connect(masterGainRef.current);

      dropSource.start(0);
      dropSource.stop(audioContextRef.current.currentTime + 0.1);
    };

    // Trigger raindrops randomly every 50-200ms
    const scheduleNextDrop = () => {
      const delay = 50 + Math.random() * 150; // 50-200ms
      dropIntervalRef.current = window.setTimeout(() => {
        if (masterGainRef.current && audioContextRef.current) {
          triggerRaindrop();
          scheduleNextDrop();
        }
      }, delay);
    };

    scheduleNextDrop();

    // Fade in master gain
    const fadeInTime = context.currentTime + 0.5;
    masterGain.gain.setValueAtTime(0, context.currentTime);
    masterGain.gain.linearRampToValueAtTime(1, fadeInTime);

    setIsPlaying(true);
  };

  // Stop rain sound
  const stop = () => {
    if (dropIntervalRef.current) {
      clearTimeout(dropIntervalRef.current);
      dropIntervalRef.current = null;
    }

    if (masterGainRef.current && audioContextRef.current) {
      const fadeOutTime = audioContextRef.current.currentTime + 0.5;
      masterGainRef.current.gain.linearRampToValueAtTime(0, fadeOutTime);

      setTimeout(() => {
        if (rumbleSourceRef.current) {
          try {
            rumbleSourceRef.current.stop();
          } catch (e) {
            // Source may already be stopped
          }
          rumbleSourceRef.current = null;
        }
        if (patterSourceRef.current) {
          try {
            patterSourceRef.current.stop();
          } catch (e) {
            // Source may already be stopped
          }
          patterSourceRef.current = null;
        }
        setIsPlaying(false);
      }, 600);
    } else {
      setIsPlaying(false);
    }
  };

  // Update intensity while playing
  useEffect(() => {
    if (!isPlaying) return;

    if (rumbleGainRef.current) {
      rumbleGainRef.current.gain.value = 0.4 * intensity;
    }

    if (patterFilterRef.current) {
      patterFilterRef.current.frequency.value = 2000 + (intensity * 4000);
    }

    if (patterDelayRef.current) {
      patterDelayRef.current.delayTime.value = 0.01 + (intensity * 0.08);
    }

    if (patterGainRef.current) {
      patterGainRef.current.gain.value = 0.02 + (intensity * 0.03);
    }
  }, [intensity, isPlaying]);

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

  return {
    isPlaying,
    intensity,
    setIntensity,
    play,
    stop,
  };
};

