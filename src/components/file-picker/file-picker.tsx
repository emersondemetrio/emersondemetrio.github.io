import { ChangeEvent, useState } from 'react';

type FilePickerProps = {
  onFileChange: (files: FileList | null) => void;
};

export const FilePicker = ({ onFileChange }: FilePickerProps) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setSelectedFiles(files);
    onFileChange(files);
  };

  return (
    <div className="container">
      <form>
        <div className="form-group mb-3">
          <label htmlFor="fileInput">Select File(s)</label>
          <input
            className="form-control"
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            multiple
          />
          {selectedFiles && Array.from(selectedFiles).map(file => (
            <span className="badge bg-light text-dark" key={file.name}>
              - {file.name}
            </span>
          ))}
        </div>
      </form>
    </div>
  );
};
