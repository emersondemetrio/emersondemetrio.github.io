import "react";
import { Page } from "@/components/page/page";
import { FilePicker } from "@/components/file-picker/file-picker";
import { ImageToAsciiArt } from 'image-to-ascii-art'
import { useState } from "react";

export const AsciiArt = () => {
  const [loading, setLoading] = useState(false);

  const readAsAscii = async (file: File) => {
    setLoading(true);
    const image = new Image();
    image.src = URL.createObjectURL(file);

    const originalWidth = image.width;
    const originalHeight = image.height;

    const aspectRatio = originalWidth / originalHeight;
    const newHeight = 300;
    const newWidth = newHeight * aspectRatio;

    const el = document.getElementById('vai');

    const config = {
      drawWidth: 1,
    }
    const imageToAsciiArt = new ImageToAsciiArt({

      config
    });

    try {
      const result = await imageToAsciiArt.convert(image)

      console.log(`result`, result);

      if (!el) {
        return;
      }
      el.style.width = `${newWidth}px`;
      el.style.height = `${newHeight}px`;

      el.innerHTML = result;
      // el.value = result;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
      imageToAsciiArt.destroy();
    }
  }

  const onPick = async (files: FileList | null) => {
    setLoading(true);
    if (!files) {
      return;
    }

    const file = files[0];
    readAsAscii(file);
  }

  const handlePaste = async (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (items) {
      for (const item of items) {
        if (item.kind === "file") {
          const file = item.getAsFile();

          if (file) {
            readAsAscii(file);
          }
        }
      }
    }
  };

  return (
    <Page name="Ascii Art 🖼️ -> 🎨" onPaste={handlePaste} className="flex flex-col justify-center items-start" style={{ height: '500vh', }}>
      <h1>AsciiArt {loading && "Loading..."}</h1>
      <FilePicker onFileChange={onPick} />
      <div style={{
        width: "100%",
        fontSize: "4px",
        // border: "1px solid red",
        // color: 'black'
      }} id="vai">eae</div>
    </Page>
  );
};
