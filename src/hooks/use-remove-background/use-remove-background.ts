import { ImageSource, removeBackground } from "@imgly/background-removal";
import { useState } from "react";

const randomUUID = () => {
  return Math.random().toString(36).substring(2, 15);
}

export const useRemoveBackground = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  const remove = async ({
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

      const blob = await removeBackground(file, {
        device: isMobile ? "cpu" : "gpu",
        progress: (key, current, total) => {
          setProgress(`Downloading ${key}: ${current} of ${total}`);
        }
      });

      const url = URL.createObjectURL(blob);
      setIsLoading(false);
      setProgress("Finished.");

      if (download) {
        const link = document.createElement('a');
        link.href = url;
        link.download = `${output}-${randomUUID()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }

      return {
        name: `${output}-${randomUUID()}.png`,
        url
      }
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  }

  return {
    remove,
    progress,
    isLoading,
    error
  }
}
