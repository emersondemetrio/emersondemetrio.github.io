import "react";
import { Page } from "@/components/page/page";
import { FilePicker } from "@/components/file-picker/file-picker";
import { useRemoveBackground } from "@/hooks/use-remove-background/use-remove-background";
import { Loading } from "@/components/loading/loading";
import { useState } from "react";

export const RemoveBackground = () => {
  const { remove, isLoading, progress } = useRemoveBackground();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [urls, setUrls] = useState<
    { fileName: string; download: string; url: string }[]
  >([]);

  const handleFileChange = async (files: FileList | null) => {
    if (files) {
      setSelectedFiles(files);
      for (const file of files) {
        const result = await remove({
          file,
        });

        if (!result) {
          return;
        }

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
            await remove({
              file,
              download: true,
            });
          }
        }
      }
    }
  };

  return (
    <Page
      onPaste={handlePaste}
      style={{
        backgroundColor: "#f5f5f5",
        color: "#333",
      }}
    >
      <h2>Remove Background</h2>
      {progress && <span>{progress}</span>}
      {isLoading && <Loading />}
      <FilePicker onFileChange={handleFileChange} />
      <div
        className="container"
        style={{
          display: "flex",
          marginTop: "1rem",
        }}
      >
        <table className="table table-light">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">File Name</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {selectedFiles &&
              Array.from(selectedFiles).map((file, index) => {
                const result = urls.find((u) => u.fileName === file.name);

                return (
                  <tr key={file.name}>
                    <th scope="row">{index + 1}</th>
                    <td>{file.name}</td>
                    <td>
                      {result && (
                        <a
                          className="btn btn-dark"
                          href={result.url}
                          download={result.download}
                        >
                          Download
                        </a>
                      )}
                      {!result && <Loading />}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </Page>
  );
};
