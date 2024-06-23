import { ImageSource, removeBackground } from "@imgly/background-removal";
import { useState } from "react";

const randomUUID = () => {
  return Math.random().toString(36).substring(2, 15);
}

export const useRemoveBackground = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [progress, setProgress] = useState<string | null>(null);

  const remove = async (image: ImageSource, output: string = "no-bg") => {
    try {
      setProgress("Started.")
      setIsLoading(true);

      const blob = await removeBackground(image, {
        device: "gpu",
        progress: (key, current, total) => {
          setProgress(`Downloading ${key}: ${current} of ${total}`);
        }
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${output}-${randomUUID()}.png`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      setIsLoading(false);
      setProgress("Finished.");

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
