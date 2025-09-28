export type AudioState = {
  isPlaying: boolean;
  isLoading: boolean;
  duration: number;
  currentTime: number;
  isLooping: boolean;
};

export type Effects = {
  tempo: { enabled: boolean; playbackRate: number };
  // Distortion/Modulation
  distortion: { enabled: boolean; amount: number; oversample: string };
  chorus: {
    enabled: boolean;
    frequency: number;
    delayTime: number;
    depth: number;
  };
  phaser: {
    enabled: boolean;
    frequency: number;
    octaves: number;
    depth: number;
  };
  tremolo: { enabled: boolean; frequency: number; depth: number };
  vibrato: { enabled: boolean; frequency: number; depth: number };

  // Time-based
  reverb: { enabled: boolean; decay: number; wet: number };
  delay: { enabled: boolean; delayTime: number; feedback: number; wet: number };
  pingPongDelay: {
    enabled: boolean;
    delayTime: number;
    feedback: number;
    wet: number;
  };

  // Filters
  filter: { enabled: boolean; frequency: number; type: string; Q: number };
  autoFilter: {
    enabled: boolean;
    frequency: number;
    depth: number;
    baseFrequency: number;
  };

  // Dynamics
  compressor: {
    enabled: boolean;
    threshold: number;
    ratio: number;
    attack: number;
    release: number;
  };
  limiter: { enabled: boolean; threshold: number };

  // Pitch
  pitchShift: { enabled: boolean; pitch: number; wet: number };

  // EQ
  eq3: { enabled: boolean; low: number; mid: number; high: number };

  // Volume
  volume: { enabled: boolean; volume: number };
};
