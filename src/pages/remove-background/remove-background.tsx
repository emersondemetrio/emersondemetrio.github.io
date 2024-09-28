import "react";
import { Page } from "@/components/page/page";
import { FilePicker } from "@/components/file-picker/file-picker";
import { useRemoveBackground } from "@/hooks/use-remove-background/use-remove-background";
import { Loading } from "@/components/loading/loading";
import { useState } from "react";
import ImageViewer from "./image-viewer";

type ProcessingFile = {
  fileName: string;
  download: string;
  url: string;
};

type ActionRowProps = {
  index: number;
  file: File;
  result?: ProcessingFile;
};

const ActionRow = ({ file, index, result }: ActionRowProps) => {
  return (
    <tr key={file.name}>
      <th scope="row">{index + 1}</th>
      <td>{file.name}</td>
      <td>
        {result && (
          <a
            href={result.url}
            className="btn btn-dark"
            download={result.download}
          >
            Download
          </a>
        )}
        {!result && <Loading />}
      </td>
      <td>
        {result && (
          <ImageViewer
            download={result.download}
            src={result.url}
            alt={file.name}
          />
        )}
        {!result && <Loading />}
      </td>
    </tr>
  );
};

export const RemoveBackground = () => {
  const { removeBackground, isLoading, progress } = useRemoveBackground();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [pastedFile, setPastedFile] = useState<ProcessingFile | null>(null);
  const [urls, setUrls] = useState<ProcessingFile[]>([]);

  const handleFileChange = async (files: FileList | null) => {
    if (files) {
      setSelectedFiles(files);
      for (const file of files) {
        const result = await removeBackground({ file });

        if (!result) return;

        setUrls((prev) => [
          ...prev,
          {
            fileName: file.name,
            download: result.name,
            url: result.url,
          },
        ]);
      }
    }
  };

  const handlePaste = async (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (items) {
      for (const item of items) {
        if (item.kind === "file") {
          const file = item.getAsFile();

          if (file) {
            const result = await removeBackground({
              file,
            });

            if (!result) return;

            setPastedFile({
              fileName: file.name,
              download: result.name,
              url: result.url,
            });
          }
        }
      }
    }
  };

  return (
    <Page
      className="table"
      onPaste={handlePaste}
      name="Remove Background"
      description="Select a file or paste it"
    >
      <div className="flex flex-col md:flex-row">
        {progress && (
          <div className="mt-2">
            <span>{progress}</span>
          </div>
        )}
        {isLoading && <Loading />}
        <FilePicker onFileChange={handleFileChange} />
        <div
          className="container"
          style={{
            display: "flex",
            marginTop: "1rem",
          }}
        >
          <table className="table table-light relative overflow-x-auto">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">File Name</th>
                <th scope="col">Actions</th>
                <th scope="col">Preview</th>
              </tr>
            </thead>
            <tbody>
              {pastedFile && (
                <ActionRow
                  index={1}
                  file={new File([], pastedFile.fileName)}
                  result={pastedFile}
                />
              )}
              {selectedFiles &&
                Array.from(selectedFiles).map((file, index) => {
                  const result = urls.find((u) => u.fileName === file.name);
                  return (
                    <ActionRow
                      key={file.name}
                      file={file}
                      index={index}
                      result={result}
                    />
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </Page>
  );
};
