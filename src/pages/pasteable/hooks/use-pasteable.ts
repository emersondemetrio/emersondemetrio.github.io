import { useRef, useState } from "react";
import { randomUUID } from "@/utils/utils";

type PastedImage = {
  id: string;
  url: string;
  fileName: string;
};

type PasteableState = {
  image: PastedImage | null;
  error: string | null;
  isLoading: boolean;
};

export const usePasteable = (downloadOnly = false) => {
  const [state, setState] = useState<PasteableState>({
    image: null,
    error: null,
    isLoading: false,
  });

  const processingPaste = useRef(false);

  const handlePaste = async (event: React.ClipboardEvent) => {
    if (processingPaste.current) return;
    processingPaste.current = true;

    event.preventDefault();
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const items = event.clipboardData?.items;
      if (!items) throw new Error("No clipboard data available");

      const imageItem = Array.from(items).find((item) => item.type.startsWith("image"));
      if (!imageItem) throw new Error("No image found in clipboard");

      const file = imageItem.getAsFile();
      if (!file) throw new Error("Failed to get image from clipboard");

      const id = randomUUID();
      const url = URL.createObjectURL(file);
      const newImage = {
        id,
        url,
        fileName: `pasted-image-${id}.png`,
      };

      // Download
      const link = document.createElement("a");
      link.href = url;
      link.download = newImage.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (!downloadOnly) {
        setState((prev) => ({
          ...prev,
          image: newImage,
          isLoading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        isLoading: false,
      }));
    } finally {
      setTimeout(() => {
        processingPaste.current = false;
      }, 100);
    }
  };

  const clearImage = () => {
    setState({ image: null, error: null, isLoading: false });
  };

  return {
    ...state,
    handlePaste,
    clearImage,
  };
};
