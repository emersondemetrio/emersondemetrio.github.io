import "react";
import { Page } from "@/components/page/page";
import { FilePicker } from "@/components/file-picker/file-picker";
import { useRemoveBackground } from "@/utils/image";
import { Loading } from "@/components/loading/loading";

export const RemoveBackground = () => {
  const {
    remove,
    isLoading,
    progress
  } = useRemoveBackground();

  const handleFileChange = (files: FileList | null) => {
    if (files) {
      for (const file of files) {
        remove(file);
      }
    }
  }

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (items) {
      for (const item of items) {
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) {
            remove(file);
          }
        }
      }
    }
  }

  return (
    <div onPaste={handlePaste} autoFocus>
      <Page
        style={{
          padding: 100,
          backgroundColor: "#f0f0f0"
        }}>
        <h2>Remove Background</h2>
        {progress && <span>{progress}</span>}
        {isLoading && <Loading />}
        <FilePicker onFileChange={handleFileChange} />
      </Page>
    </div>
  );
};
