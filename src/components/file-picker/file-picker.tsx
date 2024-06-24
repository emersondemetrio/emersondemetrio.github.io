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
      <form>
        <div className="form-group mb-3">
          <label htmlFor="fileInput">Select File(s)</label>
          <input
            multiple
            type="file"
            id="fileInput"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>
      </form>
    </div>
  );
};
