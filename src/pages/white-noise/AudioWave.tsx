import { useEffect, useRef, useState } from "react";

type AudioWaveProps = {
  buffer: AudioBuffer | null;
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
};

export const AudioWave = ({
  buffer,
  width = 800,
  height = 200,
  color = "#4ECDC4",
  strokeWidth = 1,
}: AudioWaveProps) => {
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!buffer) {
      setWaveformData([]);
      return;
    }

    // Sample the buffer to create waveform data
    const samples = Math.min(1000, buffer.length); // Number of points to display
    const blockSize = Math.floor(buffer.length / samples);
    const waveform: number[] = [];

    // Get the first channel (or average if stereo)
    const channelData = buffer.getChannelData(0);

    // If stereo, average both channels
    let dataToUse = channelData;
    if (buffer.numberOfChannels > 1) {
      const channel2Data = buffer.getChannelData(1);
      dataToUse = new Float32Array(buffer.length);
      for (let i = 0; i < buffer.length; i++) {
        dataToUse[i] = (channelData[i] + channel2Data[i]) / 2;
      }
    }

    // Sample the data
    for (let i = 0; i < samples; i++) {
      const start = i * blockSize;
      const end = Math.min(start + blockSize, dataToUse.length);

      // Calculate RMS (root mean square) for this block
      let sum = 0;
      for (let j = start; j < end; j++) {
        sum += dataToUse[j] * dataToUse[j];
      }
      const rms = Math.sqrt(sum / (end - start));
      waveform.push(rms);
    }

    // Normalize to 0-1 range
    const max = Math.max(...waveform, 0.001); // Avoid division by zero
    const normalizedWaveform = waveform.map((val) => val / max);

    setWaveformData(normalizedWaveform);
  }, [buffer]);

  if (!buffer || waveformData.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-48 bg-base-200 rounded-lg">
        <span className="text-base-content/40">No waveform data</span>
      </div>
    );
  }

  const padding = 20;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;
  const stepX = graphWidth / waveformData.length;

  // Create path for the waveform
  const pathData = waveformData
    .map((value, index) => {
      const x = padding + index * stepX;
      const y = padding + graphHeight / 2 + (value * graphHeight / 2) * (index % 2 === 0 ? 1 : -1);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  // Create mirror path for symmetry
  const mirrorPathData = waveformData
    .map((value, index) => {
      const x = padding + index * stepX;
      const y = padding + graphHeight / 2 - (value * graphHeight / 2) * (index % 2 === 0 ? 1 : -1);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <div className="w-full bg-base-200 rounded-lg p-4">
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full"
      >
        {/* Background grid */}
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Center line */}
        <line
          x1={padding}
          y1={height / 2}
          x2={width - padding}
          y2={height / 2}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.2"
        />

        {/* Waveform path (top half) */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Waveform path (bottom half - mirrored) */}
        <path
          d={mirrorPathData}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Fill area */}
        <path
          d={`${pathData} L ${width - padding} ${height / 2} L ${padding} ${height / 2} Z`}
          fill={color}
          opacity="0.2"
        />
        <path
          d={`${mirrorPathData} L ${width - padding} ${height / 2} L ${padding} ${height / 2} Z`}
          fill={color}
          opacity="0.2"
        />
      </svg>
    </div>
  );
};

