import { Effects } from "@/audio.types";

type EffectParam = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
  type?: 'slider' | 'select';
  options?: { value: string; label: string }[];
};

type AudioEffectConfig = {
  key: keyof Effects;
  name: string;
  color: string;
  params: EffectParam[];
};

export const AudioEffects: AudioEffectConfig[] = [
  {
    key: "tempo",
    name: "Tempo",
    color: "#FF6B35",
    params: [
      {
        key: "playbackRate",
        label: "Speed",
        min: 0.25,
        max: 2,
        step: 0.05,
        unit: "x"
      }
    ]
  },
  {
    key: "eq3",
    name: "EQ3",
    color: "#4ECDC4",
    params: [
      {
        key: "low",
        label: "Low",
        min: -30,
        max: 30,
        step: 1,
        unit: "dB"
      },
      {
        key: "mid",
        label: "Mid",
        min: -30,
        max: 30,
        step: 1,
        unit: "dB"
      },
      {
        key: "high",
        label: "High",
        min: -30,
        max: 30,
        step: 1,
        unit: "dB"
      }
    ]
  },
  {
    key: "compressor",
    name: "Compressor",
    color: "#45B7D1",
    params: [
      {
        key: "threshold",
        label: "Threshold",
        min: -60,
        max: 0,
        step: 1,
        unit: "dB"
      },
      {
        key: "ratio",
        label: "Ratio",
        min: 1,
        max: 20,
        step: 0.1
      }
    ]
  },
  {
    key: "distortion",
    name: "Distortion",
    color: "#E74C3C",
    params: [
      {
        key: "amount",
        label: "Amount",
        min: 0,
        max: 1,
        step: 0.01
      }
    ]
  },
  {
    key: "filter",
    name: "Filter",
    color: "#9B59B6",
    params: [
      {
        key: "type",
        label: "Type",
        min: 0,
        max: 1,
        step: 1,
        type: "select",
        options: [
          { value: "lowpass", label: "Low Pass" },
          { value: "highpass", label: "High Pass" },
          { value: "bandpass", label: "Band Pass" },
          { value: "notch", label: "Notch" }
        ]
      },
      {
        key: "frequency",
        label: "Frequency",
        min: 20,
        max: 20000,
        step: 10,
        unit: "Hz"
      }
    ]
  },
  {
    key: "pitchShift",
    name: "Pitch",
    color: "#F39C12",
    params: [
      {
        key: "pitch",
        label: "Pitch",
        min: -24,
        max: 24,
        step: 1,
        unit: " semitones"
      }
    ]
  },
  {
    key: "chorus",
    name: "Chorus",
    color: "#1ABC9C",
    params: [
      {
        key: "frequency",
        label: "Rate",
        min: 0.1,
        max: 10,
        step: 0.1,
        unit: "Hz"
      },
      {
        key: "depth",
        label: "Depth",
        min: 0,
        max: 1,
        step: 0.01
      }
    ]
  },
  {
    key: "phaser",
    name: "Phaser",
    color: "#8E44AD",
    params: [
      {
        key: "frequency",
        label: "Rate",
        min: 0.1,
        max: 10,
        step: 0.1,
        unit: "Hz"
      },
      {
        key: "depth",
        label: "Depth",
        min: 0,
        max: 2,
        step: 0.1
      }
    ]
  },
  {
    key: "tremolo",
    name: "Tremolo",
    color: "#E67E22",
    params: [
      {
        key: "frequency",
        label: "Rate",
        min: 0.1,
        max: 20,
        step: 0.1,
        unit: "Hz"
      },
      {
        key: "depth",
        label: "Depth",
        min: 0,
        max: 1,
        step: 0.01
      }
    ]
  },
  {
    key: "delay",
    name: "Delay",
    color: "#27AE60",
    params: [
      {
        key: "delayTime",
        label: "Time",
        min: 0.01,
        max: 1,
        step: 0.01,
        unit: "s"
      },
      {
        key: "feedback",
        label: "Feedback",
        min: 0,
        max: 0.9,
        step: 0.01
      }
    ]
  },
  {
    key: "pingPongDelay",
    name: "Ping Pong",
    color: "#2ECC71",
    params: [
      {
        key: "delayTime",
        label: "Time",
        min: 0.01,
        max: 1,
        step: 0.01,
        unit: "s"
      },
      {
        key: "feedback",
        label: "Feedback",
        min: 0,
        max: 0.9,
        step: 0.01
      }
    ]
  },
  {
    key: "reverb",
    name: "Reverb",
    color: "#3498DB",
    params: [
      {
        key: "decay",
        label: "Decay",
        min: 0.1,
        max: 10,
        step: 0.1,
        unit: "s"
      },
      {
        key: "wet",
        label: "Wet",
        min: 0,
        max: 1,
        step: 0.01
      }
    ]
  },
  {
    key: "limiter",
    name: "Limiter",
    color: "#34495E",
    params: [
      {
        key: "threshold",
        label: "Threshold",
        min: -40,
        max: 0,
        step: 1,
        unit: "dB"
      }
    ]
  },
  {
    key: "volume",
    name: "Volume",
    color: "#FF9500",
    params: [
      {
        key: "volume",
        label: "Volume",
        min: -30,
        max: 20,
        step: 0.5,
        unit: "dB"
      }
    ]
  }
];
