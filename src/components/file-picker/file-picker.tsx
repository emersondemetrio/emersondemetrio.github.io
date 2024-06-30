import { ChangeEvent } from "react";

type FilePickerProps = {
  onFileChange: (files: FileList | null) => void;
};

export const FilePicker = ({ onFileChange }: FilePickerProps) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFileChange(event.target.files);
  };

  return (
    <div className="container">
      <label htmlFor="fileInput">Select File(s)</label>
      <input
        multiple
        type="file"
        id="fileInput"
        className="file-input w-full max-w-xs"
        onChange={handleFileChange}
      />
    </div>
  );
};
