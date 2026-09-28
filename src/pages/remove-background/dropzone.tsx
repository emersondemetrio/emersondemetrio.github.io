import { useRef, useState } from "react";

type DropzoneProps = {
  onFiles: (files: FileList | File[]) => void;
};

export const Dropzone = ({ onFiles }: DropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const openPicker = () => inputRef.current?.click();

  return (
    <div
      className={`rb-dropzone${isDragOver ? " is-dragover" : ""}`}
      role="button"
      tabIndex={0}
      onClick={openPicker}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openPicker();
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragOver(false);
        if (event.dataTransfer.files.length) {
          onFiles(event.dataTransfer.files);
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        className="rb-dropzone-input"
        onChange={(event) => {
          if (event.target.files?.length) {
            onFiles(event.target.files);
          }
          event.target.value = "";
        }}
      />
      <div className="rb-dropzone-icon">🖼️</div>
      <p className="rb-dropzone-title">Drop images here</p>
      <p className="rb-dropzone-sub">or click to browse, or paste from your clipboard</p>
    </div>
  );
};
