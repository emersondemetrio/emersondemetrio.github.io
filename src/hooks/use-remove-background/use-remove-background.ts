import {
  ImageSource,
  removeBackground as removeBackgroundFromImage
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

  const removeBackground = async ({
    file,
    output = "no-bg",
    download = false
  }: {
    file: ImageSource,
    output?: string,
    download?: boolean
  }) => {
    try {
      setProgress("Started.")
      setIsLoading(true);

      const blob = await removeBackgroundFromImage(file, {
        model: REMOVE_MASK_MODEL,
        device: isMobile ? "cpu" : "gpu",
        progress: (key, current, total) => {
          setProgress(`Downloading ${key}: ${current} of ${total}`);
        }
      });

      const url = URL.createObjectURL(blob);
      setIsLoading(false);
      setProgress("Finished.");
      const outputFileName = `${output}-${randomUUID()}.png`;

      if (download) {
        const link = document.createElement('a');
        link.href = url;
        link.download = outputFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }

      return {
        name: outputFileName,
        url
      }
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  }

  return {
    removeBackground,
    progress,
    isLoading,
    error
  }
}
