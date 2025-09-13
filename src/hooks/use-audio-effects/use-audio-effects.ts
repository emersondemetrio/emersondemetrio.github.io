import { useState, useRef, useCallback, useEffect } from "react";
import * as Tone from "tone";

export type AudioState = {
  isPlaying: boolean;
  isLoading: boolean;
  duration: number;
  currentTime: number;
};

export type Effects = {
  // Distortion/Modulation
  distortion: { enabled: boolean; amount: number; oversample: string };
  chorus: { enabled: boolean; frequency: number; delayTime: number; depth: number };
  phaser: { enabled: boolean; frequency: number; octaves: number; depth: number };
  tremolo: { enabled: boolean; frequency: number; depth: number };
  vibrato: { enabled: boolean; frequency: number; depth: number };
  
  // Time-based
  reverb: { enabled: boolean; decay: number; wet: number };
  delay: { enabled: boolean; delayTime: number; feedback: number; wet: number };
  pingPongDelay: { enabled: boolean; delayTime: number; feedback: number; wet: number };
  
  // Filters
  filter: { enabled: boolean; frequency: number; type: string; Q: number };
  autoFilter: { enabled: boolean; frequency: number; depth: number; baseFrequency: number };
  
  // Dynamics
  compressor: { enabled: boolean; threshold: number; ratio: number; attack: number; release: number };
  limiter: { enabled: boolean; threshold: number };
  
  // Pitch
  pitchShift: { enabled: boolean; pitch: number; wet: number };
  
  // EQ
  eq3: { enabled: boolean; low: number; mid: number; high: number };
};

const defaultEffects: Effects = {
  distortion: { enabled: false, amount: 0.4, oversample: '4x' },
  chorus: { enabled: false, frequency: 1.5, delayTime: 3.5, depth: 0.7 },
  phaser: { enabled: false, frequency: 0.5, octaves: 3, depth: 1 },
  tremolo: { enabled: false, frequency: 10, depth: 0.9 },
  vibrato: { enabled: false, frequency: 5, depth: 0.1 },
  reverb: { enabled: false, decay: 1.5, wet: 0.3 },
  delay: { enabled: false, delayTime: 0.25, feedback: 0.125, wet: 0.25 },
  pingPongDelay: { enabled: false, delayTime: 0.25, feedback: 0.125, wet: 0.25 },
  filter: { enabled: false, frequency: 1000, type: 'lowpass', Q: 1 },
  autoFilter: { enabled: false, frequency: 1, depth: 1, baseFrequency: 200 },
  compressor: { enabled: false, threshold: -24, ratio: 12, attack: 0.003, release: 0.25 },
  limiter: { enabled: false, threshold: -20 },
  pitchShift: { enabled: false, pitch: 0, wet: 1 },
  eq3: { enabled: false, low: 0, mid: 0, high: 0 },
};

export const useAudioEffects = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
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
  const effectsChainRef = useRef<{ [key: string]: any }>({});
  const recorderRef = useRef<Tone.Recorder | null>(null);
  const gainNodeRef = useRef<Tone.Gain | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const createEffectChain = useCallback(() => {
    if (!playerRef.current) return;

    // Dispose of existing effects
    Object.values(effectsChainRef.current).forEach((effect: any) => {
      if (effect && effect.dispose) {
        try {
          effect.dispose();
        } catch (error) {
          console.warn('Error disposing effect:', error);
        }
      }
    });
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
    let currentOutput: any = playerRef.current;

    // EQ3 (first in chain)
    if (effects.eq3.enabled) {
      const eq = new Tone.EQ3(effects.eq3.low, effects.eq3.mid, effects.eq3.high);
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
        oversample: effects.distortion.oversample as any,
      });
      effectsChainRef.current.distortion = distortion;
      currentOutput.connect(distortion);
      currentOutput = distortion;
    }

    // Filters
    if (effects.filter.enabled) {
      const filter = new Tone.Filter({
        frequency: effects.filter.frequency,
        type: effects.filter.type as any,
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
    const normalizedWaveform = waveform.map(val => val / max);
    
    setWaveformData(normalizedWaveform);
  }, []);

  const loadYouTubeAudio = useCallback(async (url: string) => {
    if (!url.trim()) return;
    
    console.log('YouTube URL loading not implemented yet:', url);
    // TODO: Implement YouTube audio extraction
    // This would require a backend service or YouTube API integration
    alert('YouTube integration coming soon! For now, please upload an audio file.');
  }, []);

  const loadAudioFile = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setAudioFile(file);
    setAudioState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Note: AudioContext will start when user first interacts (clicks play)
      
      // Dispose of previous player and effects
      if (playerRef.current) {
        playerRef.current.dispose();
      }
      Object.values(effectsChainRef.current).forEach((effect: any) => {
        if (effect && effect.dispose) effect.dispose();
      });
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
          setAudioState(prev => ({
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
      console.error('Error loading audio file:', error);
      setAudioState(prev => ({ ...prev, isLoading: false }));
    }
  }, [createEffectChain]);

  const startProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    progressIntervalRef.current = setInterval(() => {
      if (playerRef.current && audioState.isPlaying) {
        const currentTime = Tone.Transport.seconds;
        setAudioState(prev => ({ ...prev, currentTime }));
      }
    }, 100); // Update every 100ms
  }, [audioState.isPlaying]);

  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const seekTo = useCallback((time: number) => {
    if (!playerRef.current) return;
    
    try {
      const wasPlaying = audioState.isPlaying;
      
      if (wasPlaying) {
        playerRef.current.stop();
      }
      
      // Seek by restarting at the desired time
      if (wasPlaying) {
        playerRef.current.start(0, time);
      }
      
      setAudioState(prev => ({ ...prev, currentTime: time }));
    } catch (error) {
      console.error('Seek error:', error);
    }
  }, [audioState.isPlaying]);

  const togglePlayback = useCallback(async () => {
    if (!playerRef.current) return;
    
    try {
      // Start AudioContext on first user interaction
      if (Tone.context.state !== 'running') {
        console.log('Starting AudioContext after user gesture...');
        await Tone.start();
      }
      
      if (audioState.isPlaying) {
        playerRef.current.stop();
        stopProgressTracking();
        setAudioState(prev => ({ ...prev, isPlaying: false }));
      } else {
        playerRef.current.start();
        startProgressTracking();
        setAudioState(prev => ({ ...prev, isPlaying: true }));
      }
    } catch (error) {
      console.error('Playback error:', error);
    }
  }, [audioState.isPlaying, startProgressTracking, stopProgressTracking]);

  const updateEffect = useCallback((effectName: keyof Effects, updates: Partial<Effects[keyof Effects]>) => {
    setEffects(prev => ({
      ...prev,
      [effectName]: { ...prev[effectName], ...updates },
    }));
  }, []);

  const downloadProcessedAudio = useCallback(async () => {
    if (!playerRef.current || !audioFile || isDownloading) return;
    
    try {
      setIsDownloading(true);
      
      // Get the original audio buffer
      const originalBuffer = playerRef.current.buffer.get();
      if (!originalBuffer) {
        throw new Error('No audio buffer available');
      }
      
      const sampleRate = originalBuffer.sampleRate;
      const length = originalBuffer.length;
      
      // Create offline context
      const offlineContext = new OfflineAudioContext(2, length, sampleRate);
      
      // Create buffer source for offline context
      const source = offlineContext.createBufferSource();
      source.buffer = originalBuffer;
      
      // Recreate the effects chain in offline context
      let currentNode: AudioNode = source;
      
      // Apply effects that are enabled
      if (effects.eq3.enabled) {
        // Create simple EQ using BiquadFilters
        const lowFilter = offlineContext.createBiquadFilter();
        lowFilter.type = 'lowshelf';
        lowFilter.frequency.value = 320;
        lowFilter.gain.value = effects.eq3.low;
        
        const highFilter = offlineContext.createBiquadFilter();
        highFilter.type = 'highshelf';
        highFilter.frequency.value = 3200;
        highFilter.gain.value = effects.eq3.high;
        
        currentNode.connect(lowFilter);
        lowFilter.connect(highFilter);
        currentNode = highFilter;
      }
      
      if (effects.filter.enabled) {
        const filter = offlineContext.createBiquadFilter();
        filter.type = effects.filter.type as BiquadFilterType;
        filter.frequency.value = effects.filter.frequency;
        filter.Q.value = effects.filter.Q;
        
        currentNode.connect(filter);
        currentNode = filter;
      }
      
      if (effects.compressor.enabled) {
        const compressor = offlineContext.createDynamicsCompressor();
        compressor.threshold.value = effects.compressor.threshold;
        compressor.ratio.value = effects.compressor.ratio;
        compressor.attack.value = effects.compressor.attack;
        compressor.release.value = effects.compressor.release;
        
        currentNode.connect(compressor);
        currentNode = compressor;
      }
      
      if (effects.delay.enabled) {
        const delay = offlineContext.createDelay(1.0);
        const feedback = offlineContext.createGain();
        const wet = offlineContext.createGain();
        
        delay.delayTime.value = effects.delay.delayTime;
        feedback.gain.value = effects.delay.feedback;
        wet.gain.value = effects.delay.wet;
        
        currentNode.connect(delay);
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(wet);
        wet.connect(offlineContext.destination);
        
        // Also connect dry signal
        const dry = offlineContext.createGain();
        dry.gain.value = 1 - effects.delay.wet;
        currentNode.connect(dry);
        dry.connect(offlineContext.destination);
      } else {
        currentNode.connect(offlineContext.destination);
      }
      
      // Start the source
      source.start(0);
      
      // Render the audio
      const renderedBuffer = await offlineContext.startRendering();
      
      // Convert to WAV blob
      const wavBlob = audioBufferToWav(renderedBuffer);
      
      // Download
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const originalName = audioFile.name.replace(/\.[^/.]+$/, '') || 'audio';
      const filename = `${originalName}-fx-${timestamp}.wav`;
      
      const url = URL.createObjectURL(wavBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      console.log(`Downloaded: ${filename}`);
      setIsDownloading(false);
      
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed: ' + error);
      setIsDownloading(false);
    }
  }, [audioFile, effects, isDownloading]);
  
  // Convert AudioBuffer to WAV blob
  const audioBufferToWav = (buffer: AudioBuffer): Blob => {
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
    const channels = [];
    for (let i = 0; i < numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }
    
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channels[channel][i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

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
      Object.values(effectsChainRef.current).forEach((effect: any) => {
        if (effect && effect.dispose) {
          effect.dispose();
        }
      });
    };
  }, [stopProgressTracking]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
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
  };
};
