import {
  ImageSource,
  removeBackground as removeBackgroundFromImage,
} from "@imgly/background-removal";
import { useState } from "react";
import { useIsMobile } from "../use-is-mobile/use-is-mobile";
import { randomUUID } from "@/utils/utils";

export const useRemoveBackground = () => {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [progress, setProgress] = useState<string | null>(null);

  const REMOVE_MASK_MODEL = "isnet";

  const runRemoveBackground = (file: ImageSource, device: "cpu" | "gpu") =>
    removeBackgroundFromImage(file, {
      model: REMOVE_MASK_MODEL,
      device,
      progress: (key, current, total) => {
        setProgress(`Downloading ${key}: ${current} of ${total}`);
      },
    });

  const removeBackground = async ({
    file,
    output = "no-bg",
    download = false,
  }: {
    file: ImageSource;
    output?: string;
    download?: boolean;
  }) => {
    try {
      setProgress("Started.");
      setIsLoading(true);

      const preferredDevice = isMobile ? "cpu" : "gpu";
      let blob;
      try {
        blob = await runRemoveBackground(file, preferredDevice);
      } catch (deviceError) {
        // The WebGPU/JSEP backend can fail to resolve its worker-proxied wasm
        // (e.g. "Failed to parse URL from ort-wasm-simd.jsep.wasm") on some
        // browsers/bundler setups. Fall back to the CPU backend before giving up.
        if (preferredDevice !== "cpu") {
          blob = await runRemoveBackground(file, "cpu");
        } else {
          throw deviceError;
        }
      }

      const url = URL.createObjectURL(blob);
      setIsLoading(false);
      setProgress("Finished.");
      const outputFileName = `${output}-${randomUUID()}.png`;

      if (download) {
        const link = document.createElement("a");
        link.href = url;
        link.download = outputFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }

      return {
        name: outputFileName,
        url,
      };
    } catch (error) {
      setError(error);
      setIsLoading(false);
      setProgress(null);
      throw error;
    }
  };

  return {
    removeBackground,
    progress,
    isLoading,
    error,
  };
};
