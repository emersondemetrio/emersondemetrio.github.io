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

  // @imgly/background-removal memoizes its session-init promise by
  // JSON.stringify({ model, device, ... }), and that cache is never evicted
  // on rejection: once a given (model, device) pair fails, every later call
  // with the same shape replays the same cached failure without touching the
  // network again. `fetchArgs` is passed straight to `fetch()` and ignored
  // there, but it's a plain object (unlike the `progress` function, which
  // JSON.stringify drops), so a unique value inside it changes the memoized
  // cache key and forces a genuine retry.
  const runRemoveBackground = (
    file: ImageSource,
    device: "cpu" | "gpu",
    cacheBust?: string
  ) =>
    removeBackgroundFromImage(file, {
      model: REMOVE_MASK_MODEL,
      device,
      ...(cacheBust ? { fetchArgs: { _retryToken: cacheBust } } : {}),
      progress: (key, current, total) => {
        setProgress(`Downloading ${key}: ${current} of ${total}`);
      },
    });

  const removeBackground = async ({
    file,
    output = "no-bg",
    download = false,
    forceRetry = false,
  }: {
    file: ImageSource;
    output?: string;
    download?: boolean;
    forceRetry?: boolean;
  }) => {
    try {
      setProgress("Started.");
      setIsLoading(true);

      const preferredDevice = isMobile ? "cpu" : "gpu";
      const cacheBust = forceRetry ? `${Date.now()}-${Math.random()}` : undefined;
      let blob;
      try {
        blob = await runRemoveBackground(file, preferredDevice, cacheBust);
      } catch (deviceError) {
        // The WebGPU/JSEP backend can fail to resolve its worker-proxied wasm
        // (e.g. "Failed to parse URL from ort-wasm-simd.jsep.wasm") on some
        // browsers/bundler setups. Fall back to the CPU backend before giving up.
        if (preferredDevice !== "cpu") {
          blob = await runRemoveBackground(file, "cpu", cacheBust);
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
