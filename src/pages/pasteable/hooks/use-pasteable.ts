import { useState } from "react";
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

export const usePasteable = () => {
  const [state, setState] = useState<PasteableState>({
    image: null,
    error: null,
    isLoading: false,
  });

  const handlePaste = async (event: React.ClipboardEvent) => {
    event.preventDefault();
    setState({ isLoading: true, error: null, image: null });

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

      setState({ image: newImage, error: null, isLoading: false });

      // Download
      const link = document.createElement("a");
      link.href = url;
      link.download = newImage.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setState({
        image: null,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        isLoading: false,
      });
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
