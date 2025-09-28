import { ensure } from "@/utils/utils";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { useCallback, useEffect, useRef, useState } from "react";

const AudioMimeTypes: { [key: string]: string } = {
  mp3: "audio/mpeg",
  wav: "audio/wav",
  m4a: "audio/mp4",
  ogg: "audio/ogg",
};

const KnownFormats: Record<string, { name: string; mimeType: string }> = {
  mp3: { name: "mp3", mimeType: AudioMimeTypes.mp3 },
  wav: { name: "wav", mimeType: AudioMimeTypes.wav },
  m4a: { name: "m4a", mimeType: AudioMimeTypes.m4a },
  ogg: { name: "ogg", mimeType: AudioMimeTypes.ogg },
};

type AudioOutputFormat = keyof typeof KnownFormats;

export const useFFmpeg = () => {
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const ffmpegRef = useRef(new FFmpeg());

  const load = useCallback(async () => {
    const ffmpeg = ffmpegRef.current;

    ffmpeg.on("log", ({ message }) => {
      console.log("📝 FFmpeg:", message);
    });

    // Use local files from node_modules instead of CDN
    await ffmpeg.load();

    setLoaded(true);
  }, []);

  const manualLoad = useCallback(async () => {
    if (loaded) return;

    await load();
    return true;
  }, [loaded, load]);

  const convertAudio = useCallback(
    async (
      inputBlob: Blob,
      outputFormat: AudioOutputFormat = KnownFormats.mp3.name
    ): Promise<Blob> => {
      ensure(loaded, "FFmpeg");

      try {
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

        const outputBlob = new Blob([uint8Array as BlobPart], {
          type: AudioMimeTypes[outputFormat] || AudioMimeTypes.mp3,
        });
        console.log("✅ Conversion complete!");
        console.log(
          "  → Output size:",
          Math.round(outputBlob.size / 1024),
          "KB"
        );

        return outputBlob;
      } catch (error) {
        console.error("❌ FFmpeg conversion error:", error);
        throw error;
      }
    },
    [loaded]
  );

  // Auto-load on mount
  useEffect(() => {
    load().catch((error) => {
      console.error("❌ FFmpeg auto-load failed:", error);
      setLoadProgress(0);
    });
  }, [load]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        // console.log("🧹 Cleaning up FFmpeg...");
        // ffmpegRef.current.off("log", () => {});
        // ffmpegRef.current.off("progress", () => {});
      } catch (error) {
        console.error("Error cleaning up FFmpeg:", error);
      }
    };
  }, []);

  return {
    loaded,
    loadProgress,
    load: manualLoad,
    convertAudio,
    ffmpeg: ffmpegRef.current,
  };
};
