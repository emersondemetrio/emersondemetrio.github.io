import { useState } from "react";
import { randomUUID } from "@/utils/utils";

type PastedImage = {
  id: string;
  url: string;
  fileName: string;
};

type PasteableState = {
  images: PastedImage[];
  error: string | null;
  isLoading: boolean;
};

export const usePasteable = () => {
  const [state, setState] = useState<PasteableState>({
    images: [],
    error: null,
    isLoading: false,
  });

  const handlePaste = async (event: React.ClipboardEvent) => {
    event.preventDefault();
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const items = event.clipboardData?.items;
      if (!items) throw new Error("No clipboard data available");

      // Get only the first image from clipboard
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

      const newState = {
        images: [...state.images, newImage],
        isLoading: false,
        error: null,
      };

      setState(newState);

      // Download
      const link = document.createElement("a");
      link.href = url;
      link.download = newImage.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        isLoading: false,
      }));
    }
  };

  const removeImage = (id: string) => {
    setState((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== id),
    }));
  };

  const clearAll = () => {
    setState((prev) => ({ ...prev, images: [], error: null }));
  };

  return {
    ...state,
    handlePaste,
    removeImage,
    clearAll,
  };
};
